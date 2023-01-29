'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('spaces', 'status', {
      type: Sequelize.ENUM('IN_PROCESS', 'PUBLISHED'),
      defaultValue: 'IN_PROCESS',
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('spaces', 'status');
  }
};
