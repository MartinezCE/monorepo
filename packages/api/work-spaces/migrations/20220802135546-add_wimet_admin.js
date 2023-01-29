'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'is_wimet_admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: 'email',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'is_wimet_admin');
  },
};
