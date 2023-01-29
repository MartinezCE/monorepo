/* eslint-disable import/no-cycle */
import { App, Block, KnownBlock } from '@slack/bolt';
// import { api } from '@wimet/apps-shared';
import {
  inlineArrayTransformer,
  splitStringTransformer,
  stripIndentTransformer,
  TemplateTag,
  trimResultTransformer,
} from 'common-tags';
import { formatInTimeZone } from 'date-fns-tz';
import Company from '../db/models/Company';
import CompanyType from '../db/models/CompanyType';
import {
  HourlySpaceReservationHalfDayTypes,
  HourlySpaceReservationHourlyTypes,
} from '../db/models/HourlySpaceReservation';
import Location from '../db/models/Location';
import Plan from '../db/models/Plan';
import PlanCredit from '../db/models/PlanCredit';
import PlanType from '../db/models/PlanType';
import Space from '../db/models/Space';
import User from '../db/models/User';
import { SpaceReservationHalfDayTypes } from '../dto/space-reservation';
import logger from '../helpers/logger';
import CompanyService from './company';
import StateService from './state';
// eslint-disable-next-line import/no-cycle
import UserService from './user';

const loggerInstance = logger('slack-service');

const PREFIX = process.env.NODE_ENV !== 'production' ? '[TESTING]' : null;

const SpaceReservationHourlyTypesLabels = {
  [HourlySpaceReservationHourlyTypes.PER_HOUR]: 'Por hora',
  [HourlySpaceReservationHourlyTypes.HALF_DAY]: 'Medio día',
  [HourlySpaceReservationHourlyTypes.DAYPASS]: 'Daypass',
};

const SpaceReservationHalfDayTypesLabels = {
  [SpaceReservationHalfDayTypes.MORNING]: 'Mañana',
  [SpaceReservationHalfDayTypes.AFTERNOON]: 'Tarde',
};

const isValidValue = (x: unknown) => x != null && !Number.isNaN(x) && typeof x !== 'boolean';
const customRemoveNonPrintingValuesTransformer = () => ({
  onSubstitution(substitution: unknown) {
    if (Array.isArray(substitution)) return substitution.filter(isValidValue);
    if (isValidValue(substitution)) return substitution;
    return '';
  },
  onEndResult: (result: string) => result.replace(/^\s*\n/gm, ''),
});
const customNewLineTransformer = (marker = '@newline') => ({
  onEndResult: (result: string) => result.replace(marker, ''),
});

// Using `TemplateTag` because `createTag` is not yet available in @common-tags/1.8.2
/** @ts-ignore */
const customSource = new TemplateTag([
  splitStringTransformer('\n'),
  customRemoveNonPrintingValuesTransformer(),
  inlineArrayTransformer(),
  stripIndentTransformer(),
  trimResultTransformer(),
  customNewLineTransformer(),
]);

const useFormatDate = (tz: string) => (date: string | number | Date) => formatInTimeZone(date, tz, 'yyyy-MM-dd');
const useFormatHour = (tz: string) => (date: string | number | Date) => formatInTimeZone(date, tz, 'HH:mm');

type SendReservationMsgProps = {
  hourly?: {
    totalCredits?: number;
    reservations?: {
      day: Date;
      type: HourlySpaceReservationHourlyTypes;
      halfDayType?: HourlySpaceReservationHalfDayTypes;
      perHour?: { start: Date; end: Date };
      credits: number;
    }[];
  };
  monthly?: {
    totalPrice?: number;
    reservation?: { startDate: Date; untilDate: Date; monthsQuantity: number };
  };
};

class SlackService {
  instance?: App;

  client?: App['client'];

  constructor() {
    try {
      this.instance = new App({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: process.env.SLACK_BOT_TOKEN,
        appToken: process.env.SLACK_APP_TOKEN,
        socketMode: true,
      });
      this.client = this.instance.client;

      this.handleApproveUser();
      this.startApp();
    } catch (e) {
      loggerInstance.error('Error creating Slack client', e);
    }
  }

  async sendToReservationChannel(text: string, blocks?: (Block | KnownBlock)[]) {
    this.client?.chat.postMessage({ channel: process.env.SLACK_RESERVATION_CHANNEL, text, blocks });
  }

  async sendToPartnerChannel(text: string, blocks?: (Block | KnownBlock)[]) {
    this.client?.chat.postMessage({ channel: process.env.SLACK_PARTNERS_CHANNEL, text, blocks });
  }

  async sendToClientChannel(text: string, blocks?: (Block | KnownBlock)[]) {
    this.client?.chat.postMessage({ channel: process.env.SLACK_CLIENTS_CHANNEL, text, blocks });
  }

  async sendToUserChannel(text: string, blocks?: (Block | KnownBlock)[]) {
    this.client?.chat.postMessage({ channel: process.env.SLACK_USERS_CHANNEL, text, blocks });
  }

  async sendToWPMChannel(text: string, blocks?: (Block | KnownBlock)[]) {
    this.client?.chat.postMessage({ channel: process.env.SLACK_WPM_CHANNEL, text, blocks });
  }

  async ping() {
    this.sendToReservationChannel('Pong!');
  }

  async startApp() {
    await this.instance.start();
    loggerInstance.info('⚡️ Slack app is running!');
  }

  async handleApproveUser() {
    this.instance.action({ action_id: 'approved_user' }, async ({ ack, payload }) => {
      await ack();
      try {
        const { value } = JSON.parse(JSON.stringify(payload));
        loggerInstance.info('Params click', value);
      } catch (err) {
        loggerInstance.error('Error slack', err);
      }
    });
  }

  async sendNewReservationMsg(
    user: User,
    company: Company,
    space: Space,
    partner: User,
    { hourly, monthly }: SendReservationMsgProps
  ) {
    const formatDate = useFormatDate(company.tz);
    const formatHour = useFormatHour(company.tz);

    this.sendToReservationChannel('¡Nueva reserva!', [
      {
        type: 'section',
        text: /* prettier-ignore */ {
          type: 'mrkdwn',
          text: customSource`
            ${PREFIX}
            *¡Nueva reserva!*
            •   Cliente: *${`${company.name}`} - ${`${user.firstName} ${user.lastName}`.trim()}*
            •   Email: *${user.email}*
            •   Espacio: *${`${partner.firstName} ${partner.lastName} - ${space.name}`}*
            ${monthly?.reservation && customSource`
            •   Reserva por mes:
                ◦   Meses: *${monthly.reservation.monthsQuantity} mes(es)*
                ◦   Desde: *${formatDate(monthly.reservation.startDate)}*
                ◦   Hasta: *${formatDate(monthly.reservation.untilDate)}*
                ◦   Precio: *$${monthly.totalPrice}*
            `}
            ${hourly?.reservations && customSource`
            •   Reservas por hora/día:
                ${hourly.reservations.map(h => customSource`
                ◦   Fecha: *${formatDate(h.day)}*
                    -   Tipo: *${SpaceReservationHourlyTypesLabels[h.type]}*
                    ${h.type === HourlySpaceReservationHourlyTypes.HALF_DAY && customSource`
                    -   Reservado a la: *${SpaceReservationHalfDayTypesLabels[h.halfDayType]}*
                    `}
                    ${h.type === HourlySpaceReservationHourlyTypes.PER_HOUR && customSource`
                    -   Inicio: *${formatHour(h.perHour?.start)}hs*
                    -   Fin: *${formatHour(h.perHour?.end)}hs*
                    `}
                    -   Precio: *${h.credits} crédito(s)*
                `).join('\n')}
                ◦   Total: *${hourly.totalCredits} crédito(s)*
            `}
          `,
        },
      },
    ]);
  }

  async sendNewPartnerMsg(user: User, company: Company) {
    const [companyType, state] = await Promise.all([
      CompanyType.findOne({ where: { id: company.companyTypeId } }),
      StateService.findOneById(company.stateId),
    ]);

    this.sendToPartnerChannel('¡Nuevo partner creado!', [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '¡Nuevo Partner!',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '\n*Datos de la empresa:*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Nombre:* ${company.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Pais:* ${state.country.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Tipo:* ${companyType.value}`,
          },
          {
            type: 'mrkdwn',
            text: `*Ciudad:* ${state.name}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '\n*Datos del usuario:*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Nombre:* ${user.firstName} ${user.lastName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:* ${user.email}`,
          },
          {
            type: 'mrkdwn',
            text: `*Telefono:* ${user.phoneNumber}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            action_id: 'approved_user',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Aprobar nuevo partner',
            },
            style: 'primary',
            value: `${user.id}`,
          },
        ],
      },
    ]);
  }

  async sendNewClientLocation(user: User, company: Company, location: Location) {
    const state = await StateService.findOneById(company.stateId);

    this.sendToWPMChannel('¡Nueva locación de un Cliente creada!', [
      {
        type: 'section',
        text: /* prettier-ignore */ {
          type: 'mrkdwn',
          text: customSource`
            ${PREFIX}
            *¡Nueva locación de un Cliente creada!*
            •   Empresa:
                ◦   Nombre: *${company.name}*
            •   Usuario:
                ◦   Nombre: *${`${user.firstName} ${user.lastName}`}*
                ◦   Teléfono: *${user.phoneNumber}*
                ◦   Email: *${user.email}*
                ◦   Acceso a WPM: *${user.isWPMEnabled ? 'Si' : 'Pendiente de aprobación para usar WPM'}*
            •   Locación:
                ◦   ID: *${location.id}*
                ◦   Nombre: *${location.name}*
                ◦   Provincia: *${state.name}*
                ◦   Dirección: *${location.address}*
                ◦   Descripción: *${location.description}*
                ◦   Estado: *Pendiente de aprobación*
          `,
        },
      },
    ]);
  }

  async sendNewClientMsg(user: User, company: Company) {
    const state = await StateService.findOneById(company.stateId);
    this.sendToClientChannel('¡Nuevo cliente creado!', [
      {
        type: `header`,
        text: {
          type: `plain_text`,
          text: `¡Nuevo usuario! 🥳`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '\n*Datos de la empresa:*',
        },
      },
      {
        type: `section`,
        fields: [
          {
            type: 'mrkdwn',
            text: `*Nombre:* ${company.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Pais:* ${state.country.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Ciudad:* ${state.name}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '\n*Datos del usuario:*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Nombre:* ${`${user.firstName} ${user.lastName}`}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:* ${user.email}`,
          },
          /* {
            type: "mrkdwn",
            text: `*Telefono:* ${user.email}`
          } */
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            action_id: 'approved_user',
            text: {
              type: 'plain_text',
              emoji: true,
              text: `Aprobar nuevo usuario`,
            },
            style: 'primary',
            url: `${process.env.API_BASE_URL}/slack/aproved/${user.id}`,
          },
          {
            type: 'button',
            action_id: 'approved_user_wpm',
            text: {
              type: 'plain_text',
              emoji: true,
              text: `Habilitar WPM`,
            },
            style: 'primary',
            url: `${process.env.API_BASE_URL}/slack/aproved-wpm/${user.id}`,
          },
        ],
      },
    ]);
  }

  async sendNewUserMsg(user: User, company: Company) {
    const state = await StateService.findOneById(company.stateId);
    this.sendToUserChannel('¡Nuevo usuario creado!', [
      {
        type: 'section',
        text: /* prettier-ignore */ {
          type: 'mrkdwn',
          text: customSource`
            ${PREFIX}
            *¡Nuevo usuario!*
            •   Datos de la empresa:
                ◦   Nombre: *${company.name}*
                ◦   País: *${state.country.name}*
                ◦   Ciudad: *${state.name}*
            •   Datos del usuario:
                ◦   Nombre: *${`${user.firstName} ${user.lastName}`}*
                ◦   Email: *${user.email}*
          `,
        },
      },
    ]);
  }

  async sendNewPlanMsg(plan: Plan, userId: number, planType: PlanType, users: number[]) {
    const company = await CompanyService.findCompanyById(plan.companyId);
    const state = await StateService.findOneById(company.stateId);
    const user = await UserService.getUserById(userId);
    const formatDate = useFormatDate(company.tz);
    this.sendToWPMChannel('¡Nuevo plan creado!', [
      {
        type: 'section',
        text: /* prettier-ignore */ {
          type: 'mrkdwn',
          text: customSource`
            ${PREFIX}
            *¡Nuevo plan!*
            •   Estado: *Pendiente de aprobación*
            •   Datos de la empresa:
                ◦   Nombre: *${company.name}*
                ◦   País: *${state.country.name}*
                ◦   Ciudad: *${state.name}*
            •   Datos del usuario:
                ◦   Nombre: *${`${user.firstName} ${user.lastName}`}*
                ◦   Email: *${user.email}*
            •   Datos del plan:
                ◦   Nombre: *${`${plan.name}`}*
                ◦   Tipo de plan: *${`${planType.name}`}*
                ◦   Fecha de inicio: *${formatDate(plan.startDate)}*
                ◦   Colaboradores: *${users.length}*
                ◦   Máximo de créditos por persona / mes: *${plan.maxPersonalCredits}*
                ◦   Máximo de créditos por reserva: *${plan.maxReservationCredits}*
          `,
        },
      },
    ]);
  }

  async sendNewCompanyTeamCreditsAdded(team: Plan, planCredit: PlanCredit, companyId: number, paymentType: string) {
    const company = await CompanyService.findCompanyById(companyId);

    this.sendToWPMChannel('¡Nueva locación de un Cliente creada!', [
      {
        type: 'section',
        text: /* prettier-ignore */ {
          type: 'mrkdwn',
          text: customSource`
            ${PREFIX}
            *¡Se le asignaron créditos a un equipo!*
            •   Equipo:
                ◦   Nombre: *${team.name}*
                ◦   Companía: *${company.name}*
            •   Detalles:
                ◦   Créditos: *${planCredit.value}*
                ◦   Forma de pago: *${paymentType}*
          `,
        },
      },
    ]);
  }
}

export default new SlackService();
