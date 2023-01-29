/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-cycle */
import { randomUUID } from 'crypto';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { getTimezoneOffset, utcToZonedTime } from 'date-fns-tz';
import { admin_directory_v1, calendar_v3, google } from 'googleapis';
import { groupBy, isEqual, map, merge, reduce } from 'lodash';
import { Transaction } from 'sequelize';
import type { GaxiosError } from 'gaxios';
import { stripIndent } from 'common-tags';
import Location from '../db/models/Location';
import User from '../db/models/User';
import WPMReservation, { WPMReservationProvider, WPMReservationStatus } from '../db/models/WPMReservation';
import WPMReservationTypeService from './wpm-reservation-type';
import { ClientLocationDTO } from '../dto/client-location';
import DateHelper from '../helpers/date';
import BlueprintService from './blueprint';
import ClientLocationService from './client-location';
import FloorService from './floor';
import GoogleMapsService from './google-maps';
import SeatService from './seat';
import WPMReservationService from './wpm-reservation';
import { WPMReservationTypes } from '../db/models/WPMReservationType';
import Seat, { SeatProvider } from '../db/models/Seat';
import Company from '../db/models/Company';
import logger from '../helpers/logger';
import db from '../db';
import CompanyService from './company';

const loggerInstance = logger('google-calendar-service');

const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
const { buildings, calendars } = google.admin('directory_v1').resources;
const { events, channels } = google.calendar('v3');

enum ResourceTypes {
  MEETING_ROOM = 'Meeting Room',
}

const serverTz = new Intl.DateTimeFormat().resolvedOptions().timeZone;

// TODO: If user account doesnt have Admin SDK API enabled, it throws an `Error: Resource Not Found` error.
// TODO: How should we handle it ?

export default class GoogleCalendarService {
  static async getResources(refresh_token: string) {
    oAuth2Client.setCredentials({ refresh_token });

    const { data } = await calendars.list(
      { auth: oAuth2Client, customer: 'my_customer' },
      { params: { resourceType: ResourceTypes.MEETING_ROOM } }
    );

    return data.items;
  }

  static async getResource(refresh_token: string, resourceId: string) {
    oAuth2Client.setCredentials({ refresh_token });

    const { data } = await calendars.get(
      { auth: oAuth2Client, customer: 'my_customer', calendarResourceId: resourceId },
      { params: { resourceType: ResourceTypes.MEETING_ROOM } }
    );

    return data;
  }

  static async parseBuildingToClientLocation(
    refresh_token: string,
    companyId: number,
    currencyId: number,
    buildingId: string
  ) {
    oAuth2Client.setCredentials({ refresh_token });

    const { data } = await buildings.get({ auth: oAuth2Client, buildingId, customer: 'my_customer' });
    const { coordinates } = data;
    const { latitude, longitude } = coordinates;
    const { formattedAddress, ...geoData } = await GoogleMapsService.getDataFromLatLng(latitude, longitude);

    return {
      provider: { id: data.buildingId, name: 'google' },
      name: data.buildingName,
      companyId,
      latitude,
      longitude,
      description: data.description,
      address: formattedAddress,
      ...geoData,
      currencyId,
    } as ClientLocationDTO;
  }

  static async getEvents(
    refresh_token: string,
    calendarId: string,
    opts: calendar_v3.Params$Resource$Events$List = {}
  ) {
    oAuth2Client.setCredentials({ refresh_token });

    const { data } = await events.list({
      auth: oAuth2Client,
      calendarId,
      ...opts,
    });

    return data;
  }

  static async getLastSyncToken(refreshToken: string, calendarId: string) {
    const destinationTimeMin = DateHelper.toDestinationTz(new Date(), serverTz, serverTz, startOfDay);
    const destinationTimeMax = DateHelper.toDestinationTz(new Date(), serverTz, serverTz, endOfDay);

    const { nextSyncToken } = await GoogleCalendarService.getEvents(refreshToken, calendarId, {
      timeMin: destinationTimeMin,
      timeMax: destinationTimeMax,
      timeZone: serverTz,
    });

    return nextSyncToken;
  }

  static parseEventToWPMReservation(
    event: calendar_v3.Schema$Event,
    seatId: number,
    timeZone: string,
    tzOffset: number
  ) {
    return {
      id: event.id as unknown as number,
      WPMReservationTypeId: null,
      userId: (event.creator.id as unknown as number) || null,
      seatId,
      originTz: timeZone,
      destinationTz: timeZone,
      originOffset: tzOffset,
      destinationOffset: tzOffset,
      startAt: event.start.dateTime,
      endAt: event.end.dateTime,
      status: WPMReservationStatus.PENDING,
      isFromGoogle: true,
      user: {
        id: (event.creator.id as unknown as number) || null,
        firstName: event.creator.displayName || event.attendees[0]?.displayName,
        email: event.creator.email,
      } as User['_attributes'],
    };
  }

  static parseEventsToWPMReservation(calendarEvents: calendar_v3.Schema$Events, seatId: number) {
    const { timeZone } = calendarEvents;
    const tzOffset = getTimezoneOffset(timeZone);

    return calendarEvents.items.map<WPMReservation['_attributes']>(e =>
      GoogleCalendarService.parseEventToWPMReservation(e, seatId, timeZone, tzOffset)
    );
  }

  static async watchEvents(refresh_token: string, calendarId: string) {
    oAuth2Client.setCredentials({ refresh_token });

    const { data } = await events.watch({
      auth: oAuth2Client,
      calendarId,
      requestBody: {
        id: randomUUID(),
        token: `baseURL=${process.env.API_BASE_URL}`,
        type: 'webhook',
        address: `${process.env.API_BASE_URL}/google/webhook/seat-reservation`,
      },
    });

    return data;
  }

  static async findOrCreateSeatAndRelations(
    resource: admin_directory_v1.Schema$CalendarResource,
    refreshToken: string,
    companyId: number,
    blueprintId: number,
    transaction?: Transaction
  ) {
    const { resourceName, resourceEmail, resourceId } = resource;

    const seat = await SeatService.findOrCreateByGoogleProvider(
      refreshToken,
      companyId,
      blueprintId,
      resourceName,
      resourceId,
      resourceEmail,
      transaction
    );

    return seat;
  }

  static async findOrCreateFloorAndRelations(
    resurces: admin_directory_v1.Schema$CalendarResource[],
    refreshToken: string,
    companyId: number,
    locationId: number,
    floorName: string,
    transaction?: Transaction
  ) {
    const floor = await FloorService.findOrCreateByLocationAndName(locationId, floorName, transaction);
    const blueprint = await BlueprintService.findOrCreateByFloor(companyId, locationId, floor.id, transaction);

    return Promise.all(
      resurces.map(r =>
        GoogleCalendarService.findOrCreateSeatAndRelations(r, refreshToken, companyId, blueprint.id, transaction)
      )
    );
  }

  static async findOrCreateLocationAndRelations(
    floorGroup: { [t: string]: admin_directory_v1.Schema$CalendarResource[] },
    refreshToken: string,
    userId: number,
    companyId: number,
    currencyId: number,
    buildingId: string,
    transaction?: Transaction
  ) {
    const location = await ClientLocationService.findOrCreateByGoogleProvider(
      refreshToken,
      userId,
      companyId,
      currencyId,
      buildingId,
      transaction
    );

    return Promise.all(
      map(floorGroup, (resourcesGroup, floorName) =>
        GoogleCalendarService.findOrCreateFloorAndRelations(
          resourcesGroup,
          refreshToken,
          companyId,
          location.id,
          floorName,
          transaction
        )
      )
    ).then(r => r.flat());
  }

  static async migrateFromResources(
    resources: admin_directory_v1.Schema$CalendarResource[],
    refreshToken: string,
    userId: number,
    companyId: number,
    currencyId: number,
    transaction?: Transaction
  ) {
    const groupedByBuilding = groupBy(resources, r => r.buildingId);
    const groupedByFloor = reduce(
      groupedByBuilding,
      (acc, el, key) => ({
        ...acc,
        [key]: groupBy(el, r => r.floorName),
      }),
      {} as { [k: string]: { [t: string]: admin_directory_v1.Schema$CalendarResource[] } }
    );

    return Promise.all(
      map(groupedByFloor, (floorGroup, buildingId) =>
        GoogleCalendarService.findOrCreateLocationAndRelations(
          floorGroup,
          refreshToken,
          userId,
          companyId,
          currencyId,
          buildingId,
          transaction
        )
      )
    ).then(r => r.flat());
  }

  static async createEvent(
    refresh_token: string,
    calendarId: string,
    start: string,
    end: string,
    reservedBy: User,
    seat: Seat,
    reservation: WPMReservation,
    location?: Location
  ) {
    oAuth2Client.setCredentials({ refresh_token });

    return events.insert({
      auth: oAuth2Client,
      calendarId,
      sendUpdates: 'all',
      requestBody: {
        summary: `Reserva Wimet: ${seat.name}`,
        description: `
          Reserved at: ${reservation.createdAt.toISOString()}.
          Reservation ID: ${reservation.id}.
          Seat:
            - ID: ${seat.id}.
            - Name: ${seat.name}
        `,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees: [
          {
            displayName: `${reservedBy.firstName} ${reservedBy.lastName}`.trim(),
            email: reservedBy.email,
            responseStatus: 'accepted',
          },
        ],
        location: location?.address,
        source: { title: 'Wimet | Clients', url: process.env.CLIENTS_BASE_URL },
      },
    });
  }

  static async cancelAllWPMReservationByEvent(eventId: string, transaction?: Transaction) {
    const wpmReservation = await WPMReservationService.findAllByProvider('google', eventId, false, transaction);
    return Promise.all(
      wpmReservation.map(r =>
        r?.update({ provider: { name: 'google', eventId, synced: true }, status: WPMReservationStatus.CANCEL })
      )
    );
  }

  static async cancelEvent(refresh_token: string, eventId: string, calendarId: string) {
    oAuth2Client.setCredentials({ refresh_token });
    return events.delete({ auth: oAuth2Client, calendarId, eventId, sendUpdates: 'all' });
  }

  static async handleCreatedWPMReservation(
    event: calendar_v3.Schema$Event,
    user: User,
    seatId: number,
    originTz: string,
    destinationTz: string,
    provider: WPMReservationProvider,
    transaction?: Transaction
  ) {
    // If event was edited, it keeps same `eventId` so we cancel previous one and then we created a new reservation.
    const canceledReservations = await GoogleCalendarService.cancelAllWPMReservationByEvent(event.id, transaction);
    const originStartAt = utcToZonedTime(event.start.dateTime, originTz);

    if (originStartAt < new Date()) {
      return loggerInstance.warn(
        `Skipped reservation '${event.id}': can't be imported to Wimet because it was created for the past.`
      );
    }

    const tzOffset = getTimezoneOffset(originTz);
    const { startAt, endAt } = GoogleCalendarService.parseEventToWPMReservation(event, seatId, originTz, tzOffset);
    const WPMReservationType = await WPMReservationTypeService.findByName(WPMReservationTypes.CUSTOM, transaction);

    return WPMReservationService.createReservation(
      user,
      WPMReservationType.id,
      seatId,
      parseISO(startAt),
      parseISO(endAt),
      originTz,
      destinationTz,
      provider,
      event,
      canceledReservations,
      transaction
    );
  }

  static async deleteOrCreateWPMReservations(
    refresh_token: string,
    data: calendar_v3.Schema$Events,
    user: User,
    seatId: number,
    calendarId: string,
    destinationTz: string,
    transaction?: Transaction
  ) {
    return Promise.all(
      data.items.map(async ev => {
        try {
          if (ev.status === 'cancelled') {
            return await GoogleCalendarService.cancelAllWPMReservationByEvent(ev.id, transaction);
          }

          const { timeZone } = data;
          const provider: WPMReservationProvider = { name: 'google', eventId: ev.id, synced: true };
          const reservationCreatedByWimet = await WPMReservationService.findOneByProvider(
            'google',
            ev.id,
            null,
            transaction
          );

          if (reservationCreatedByWimet) {
            const destinationStartAt = DateHelper.toDestinationTz(ev.start.dateTime, timeZone, destinationTz);
            const destinationEndAt = DateHelper.toDestinationTz(ev.end.dateTime, timeZone, destinationTz);
            const reservationStartAt = (reservationCreatedByWimet.startAt as unknown as Date).toISOString();
            const reservationEndAt = (reservationCreatedByWimet.endAt as unknown as Date).toISOString();
            const isSameReservation = isEqual(
              { startAt: destinationStartAt, endAt: destinationEndAt },
              { startAt: reservationStartAt, endAt: reservationEndAt }
            );
            if (isSameReservation) return await reservationCreatedByWimet.update({ provider }, { transaction });
          }

          return await GoogleCalendarService.handleCreatedWPMReservation(
            ev,
            user,
            seatId,
            timeZone,
            destinationTz,
            provider,
            transaction
          );
        } catch (e) {
          await GoogleCalendarService.cancelEvent(refresh_token, ev.id, calendarId);
          throw e;
        }
      })
    );
  }

  static async runPaginated(
    refreshToken: string,
    seat: Seat,
    calendarId: string,
    calendarSyncToken?: string,
    transaction?: Transaction,
    callback?: (events: calendar_v3.Schema$Events) => unknown | Promise<unknown>
  ) {
    const iterations: calendar_v3.Params$Resource$Events$List[] = [{ syncToken: calendarSyncToken }];
    let lastPageEvents: calendar_v3.Schema$Events = null;

    do {
      try {
        const iterationOpts = iterations.shift();
        lastPageEvents = await GoogleCalendarService.getEvents(refreshToken, calendarId, iterationOpts);

        await callback?.(lastPageEvents);

        const { nextPageToken } = lastPageEvents;
        if (nextPageToken) {
          iterations.push({ pageToken: nextPageToken });
        }
      } catch (e) {
        iterations.length = 0;

        const err = e as GaxiosError;
        if (Number(err.code) !== 410) throw err;
        loggerInstance.warn('Invalid sync token, re-syncing...');

        const startOfToday = startOfDay(new Date());
        const lastStoredReservation = await WPMReservationService.getLastReservationBySeat(seat.id, transaction);

        if (lastStoredReservation) {
          // If we can migrate all missing reservations from lastStoredReservation, use last stored time.
          const { startAt, destinationTz } = lastStoredReservation;
          const isOnFuture = utcToZonedTime(startAt, destinationTz) > startOfToday;

          iterations.push({
            timeMin: !isOnFuture ? startAt : startOfToday.toISOString(),
            timeZone: !isOnFuture ? destinationTz : serverTz,
            showDeleted: true,
          });
        } else {
          // If not, bring reservations from today
          loggerInstance.warn('No previous reservation found. ¡Full sync required!');

          iterations.push({
            timeMin: startOfToday.toISOString(),
            timeZone: serverTz,
            showDeleted: true,
          });
        }

        loggerInstance.warn(`Resync from date: ${iterations[0].timeMin}`);
      }
    } while (iterations.length > 0);

    const { nextSyncToken } = lastPageEvents;
    await SeatService.updateById(
      seat.id,
      { provider: merge(seat.provider, { calendarSyncToken: nextSyncToken } as SeatProvider) },
      transaction
    );
  }

  static async createAllMissingWPMReservations(
    refreshToken: string,
    user: User,
    seat: Seat,
    company: Company,
    calendarId: string,
    calendarSyncToken: string,
    transaction?: Transaction
  ) {
    return GoogleCalendarService.runPaginated(
      refreshToken,
      seat,
      calendarId,
      calendarSyncToken,
      transaction,
      async lastPageEvents =>
        GoogleCalendarService.deleteOrCreateWPMReservations(
          refreshToken,
          lastPageEvents,
          user,
          seat.id,
          calendarId,
          company.tz,
          transaction
        )
    );
  }

  static async stopWebhook(refresh_token: string, webhookId: string, resourceId: string) {
    oAuth2Client.setCredentials({ refresh_token });
    return channels.stop({ auth: oAuth2Client, requestBody: { id: webhookId, resourceId } });
  }

  static async refreshWebhooks() {
    loggerInstance.info('Refreshing Google webhooks near to expire...');

    return db.transaction(async transaction => {
      const nearToExpireSeats = await SeatService.getAllWebhooksNearToExpire('google', transaction);

      if (!nearToExpireSeats.length) {
        loggerInstance.info('No webhook to refresh! Skipping...');
        return;
      }

      loggerInstance.info(`Refreshing ${nearToExpireSeats.length} webhooks!`);

      await Promise.all(
        nearToExpireSeats.map(async s => {
          const { company } = s.blueprint.floor.location;
          const { refreshToken } = CompanyService.extractToken(company.adminProviders, 'google');
          const { webhook, calendarId } = s.provider;
          const { id: oldWebhookId, resourceId: oldResourceId, expiration: oldExpiration } = webhook;

          const { id, expiration, resourceId } = await GoogleCalendarService.watchEvents(refreshToken, calendarId);

          await SeatService.updateById(
            s.id,
            { provider: merge(s.provider, { webhook: { id, expiration, resourceId } } as SeatProvider) },
            transaction
          );

          try {
            await GoogleCalendarService.stopWebhook(refreshToken, oldWebhookId, oldResourceId);
          } catch (e) {
            const err = e as GaxiosError;
            if (Number(err.code) !== 404) throw e;

            loggerInstance.warn(
              `Attempt to stop webhook '${oldWebhookId}' with resourceId '${oldResourceId}' failed because it doesnt exist!`
            );
          }

          loggerInstance.info(
            stripIndent`
              Webhook refreshed!
              Old:
                - webhookId: '${oldWebhookId}'
                - resourceId: '${oldResourceId}'
                - expiration: '${oldExpiration}'
              New:
                - webhookId: '${id}'
                - resourceId: '${resourceId}'
                - expiration: '${expiration}'`
          );
        })
      );
    });
  }
}
