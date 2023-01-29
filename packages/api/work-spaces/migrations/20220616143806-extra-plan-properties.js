'use strict';

const planTypes = [
  { name: 'STARTER', initial_credits: 20 },
  { name: 'TEAM', initial_credits: 100 },
  { name: 'TEAM', initial_credits: 250 },
  { name: 'TEAM', initial_credits: 500 },
  { name: 'TEAM', initial_credits: 1000 },
  { name: 'ENTERPRISE', initial_credits: null },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plan_types', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.ENUM('STARTER', 'TEAM', 'ENTERPRISE'),
        allowNull: false,
      },
      initial_credits: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert(
      'plan_types',
      planTypes.map(p => ({ ...p, created_at: new Date(), updated_at: new Date() }))
    );

    await queryInterface.addColumn('plans', 'plan_type_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'name',
      references: {
        model: 'plan_types',
        key: 'id',
      },
    });

    await queryInterface.addColumn('plans', 'available_credits', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'plan_type_id',
    });

    await queryInterface.addColumn('plans', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'PENDING', 'PAUSED'),
      allowNull: false,
      defaultValue: 'PENDING',
      after: 'start_date',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plan_types');
    await queryInterface.removeColumn('plans', 'plan_type_id');
    await queryInterface.removeColumn('plans', 'available_credits');
    await queryInterface.removeColumn('plans', 'status');
  },
};
