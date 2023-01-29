import 'jest-extended';
import { addMonths, endOfDay, isEqual, set, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';
import { forEach, groupBy, last, map, random } from 'lodash';
import PlanRenovation from '../db/models/PlanRenovation';
import PlanType, { PlanTypes } from '../db/models/PlanType';
import PlanRenovationService from '../services/plan-renovation';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

jest
  .mock('./slack', jest.fn())
  .mock('redis', () => ({ createClient: () => ({ on: jest.fn() }) }))
  .mock('sequelize', () => ({ ...jest.requireActual('sequelize'), transaction: () => Promise.resolve() }));

const originTz = 'Pacific/Honolulu';
const destinationTz = 'Pacific/Honolulu';
const calculateEndDate = (startDate: Date) => endOfDay(subDays(addMonths(startDate, 1), 1));

const plan = { company: { tz: originTz } };
const lastRenovations = [...Array(30)].map<any>((_, i) => {
  const startDate = subMonths(set(new Date(), { date: random(0, 28), hours: random(0, 24) }), i + 1);
  const endDate = calculateEndDate(startDate);
  const destinationStartDate = zonedTimeToUtc(startDate, originTz);
  const destinationEndDate = zonedTimeToUtc(endDate, originTz);

  return {
    id: i,
    planId: i,
    startDate: destinationStartDate.toISOString(),
    endDate: destinationEndDate.toISOString(),
    planCreditId: 1,
    plan,
  };
}) as PlanRenovation[];
const planType = { name: PlanTypes.CUSTOM } as PlanType;

describe('Cron Service', () => {
  describe('running an instant sync', () => {
    describe('should handle missing renovations', () => {
      const PlanRenovationServiceSpy = {
        getAllLastRenovations: jest.spyOn(PlanRenovationService, 'getAllLastRenovations'),
        getMissingRenovations: jest.spyOn(PlanRenovationService, 'getMissingRenovations'),
      };
      const PlanTypeSpy = {
        findByPk: jest.spyOn(PlanType, 'findByPk'),
      };
      const PlanRenovationSpy = {
        bulkCreate: jest.spyOn(PlanRenovation, 'bulkCreate'),
      };

      beforeEach(() => {
        const { getAllLastRenovations } = PlanRenovationServiceSpy;
        const { findByPk } = PlanTypeSpy;
        const { bulkCreate } = PlanRenovationSpy;

        forEach(PlanRenovationServiceSpy, el => el.mockClear());
        forEach(PlanTypeSpy, el => el.mockClear());
        forEach(PlanRenovationSpy, el => el.mockClear());

        getAllLastRenovations.mockResolvedValue(lastRenovations);
        findByPk.mockResolvedValue(planType);
        bulkCreate.mockImplementation(jest.fn());
      });

      it('`getAllLastRenovations` should return mocked data', async () => {
        // when
        const renovations = await PlanRenovationService.getAllLastRenovations();

        // then
        expect(renovations).toBe(lastRenovations);
      });

      it('`getMissingRenovations` should generate all missing renovations payload', async () => {
        // when
        const renovations = await PlanRenovationService.getMissingRenovations(lastRenovations);

        // then
        expect(renovations).toSatisfyAll<{ startDate: string; endDate: string }>(({ endDate, startDate }) => {
          const start = utcToZonedTime(startDate, destinationTz);
          const end = utcToZonedTime(endDate, destinationTz);
          return isEqual(end, calculateEndDate(start));
        });

        const grouped = groupBy(renovations, el => el.planId);

        expect(map(grouped, last)).toSatisfyAll<{ startDate: string; endDate: string }>(el => {
          const start = utcToZonedTime(el.startDate, destinationTz);
          return startOfMonth(start).getMonth() === addMonths(startOfMonth(new Date()), 1).getMonth();
        });
      });

      it('`getMissingRenovations` should not generate a payload if is not needed', async () => {
        const { getMissingRenovations } = PlanRenovationServiceSpy;

        // given
        const renovations = await PlanRenovationService.getMissingRenovations(lastRenovations);
        const grouped = groupBy(renovations, el => el.planId);
        const allRenovations = map(grouped, last).map(r => ({ ...r, plan })) as PlanRenovation[];

        getMissingRenovations.mockClear();

        // when
        const missingRenovations = await PlanRenovationService.getMissingRenovations(allRenovations);

        // then
        expect(missingRenovations).toBeEmpty();
      });

      it('`createMissingRenovations` should create missing monthly renovations', async () => {
        const { getAllLastRenovations, getMissingRenovations } = PlanRenovationServiceSpy;
        const { bulkCreate } = PlanRenovationSpy;

        // when
        await PlanRenovationService.createMissingRenovations();

        // then
        expect(getAllLastRenovations).toBeCalledTimes(1);
        expect(getMissingRenovations).toBeCalledTimes(1);
        expect(getMissingRenovations).toBeCalledWith(lastRenovations);
        expect(bulkCreate).toBeCalledTimes(1);
      });
    });

    describe('should handle unused credits', () => {});
  });
});
