'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('blueprints', 'status', {
      type: Sequelize.ENUM('DRAFT', 'PENDING', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('blueprints', 'status', {
      type: Sequelize.ENUM('DRAFT', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    });
  },
};
