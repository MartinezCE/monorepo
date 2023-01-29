'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const id = await queryInterface.rawSelect('user_types', { where: { value: 'CLIENT' } }, ['id']);

    await queryInterface.bulkInsert('user_roles', [
      {
        value: 'ACCOUNT_MANAGER',
        user_type_id: id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        value: 'TEAM_MANAGER',
        user_type_id: id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        value: 'MEMBER',
        user_type_id: id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.bulkDelete('user_roles', {
        value: 'ACCOUNT_MANAGER',
      }),
      queryInterface.bulkDelete('user_roles', {
        value: 'TEAM_MANAGER',
      }),
      queryInterface.bulkDelete('user_roles', {
        value: 'MEMBER',
      }),
    ]);
  },
};
