'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('users_blueprints', 'deleted_at');
  },

  async down(queryInterface, Sequelize) {},
};
