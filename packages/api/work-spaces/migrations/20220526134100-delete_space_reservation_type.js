'use strict';

const config = {
  HOURLY: 'HOURLY',
  MONTHLY: 'MONTHLY',
  SHARED: 'SHARED',
  MEETING_ROOM: 'MEETING_ROOM',
  PRIVATE_OFFICE: 'PRIVATE_OFFICE',
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const hourlyId = await queryInterface.rawSelect(
      'space_reservation_types',
      {
        where: {
          value: config.HOURLY,
        },
      },
      ['id']
    );
    const monthlyId = await queryInterface.rawSelect(
      'space_reservation_types',
      {
        where: {
          value: config.MONTHLY,
        },
      },
      ['id']
    );
    const sharedId = await queryInterface.rawSelect(
      'space_types',
      {
        where: {
          value: config.SHARED,
        },
      },
      ['id']
    );
    const meetingId = await queryInterface.rawSelect(
      'space_types',
      {
        where: {
          value: config.MEETING_ROOM,
        },
      },
      ['id']
    );
    const privatedId = await queryInterface.rawSelect(
      'space_types',
      {
        where: {
          value: config.PRIVATE_OFFICE,
        },
      },
      ['id']
    );
    await queryInterface.bulkDelete('space_reservation_types_space_types', {
      space_reservation_type_id: hourlyId,
      space_type_id: privatedId,
    });
    await queryInterface.bulkDelete('space_reservation_types_space_types', {
      space_reservation_type_id: monthlyId,
      space_type_id: sharedId,
    });
    await queryInterface.bulkInsert('space_reservation_types_space_types', [
      {
        space_reservation_type_id: monthlyId,
        space_type_id: meetingId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const hourlyId = await queryInterface.rawSelect(
      'space_reservation_types',
      {
        where: {
          value: config.HOURLY,
        },
      },
      ['id']
    );
    const monthlyId = await queryInterface.rawSelect(
      'space_reservation_types',
      {
        where: {
          value: config.MONTHLY,
        },
      },
      ['id']
    );
    const sharedId = await queryInterface.rawSelect(
      'space_types',
      {
        where: {
          value: config.SHARED,
        },
      },
      ['id']
    );
    const meetingId = await queryInterface.rawSelect(
      'space_types',
      {
        where: {
          value: config.MEETING_ROOM,
        },
      },
      ['id']
    );
    const privatedId = await queryInterface.rawSelect(
      'space_types',
      {
        where: {
          value: config.PRIVATE_OFFICE,
        },
      },
      ['id']
    );
    await queryInterface.bulkDelete('space_reservation_types_space_types', {
      space_reservation_type_id: monthlyId,
      space_type_id: meetingId,
    });
    await queryInterface.bulkInsert('space_reservation_types_space_types', [
      {
        space_reservation_type_id: hourlyId,
        space_type_id: privatedId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('space_reservation_types_space_types', [
      {
        space_reservation_type_id: monthlyId,
        space_type_id: sharedId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
};
