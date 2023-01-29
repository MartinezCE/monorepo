'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('users_amenities', 'deleted_at');
  },

  async down(queryInterface, Sequelize) {},
};
