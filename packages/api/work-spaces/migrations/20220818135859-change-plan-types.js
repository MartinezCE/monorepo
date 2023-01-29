'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('plan_types', 'initial_credits');
    await queryInterface.bulkDelete('plan_types', {
      name: {
        [Sequelize.Op.not]: 'ENTERPRISE',
      },
    });

    await queryInterface.changeColumn('plan_types', 'name', {
      type: Sequelize.ENUM('CUSTOM', 'ENTERPRISE'),
      allowNull: false,
    });

    await queryInterface.bulkInsert('plan_types', [
      {
        name: 'CUSTOM',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('plan_types', 'initial_credits', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    });
    await queryInterface.bulkDelete('plan_types', {
      name: 'CUSTOM',
    });
  },
};
