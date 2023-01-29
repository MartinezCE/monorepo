'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');

    await queryInterface.renameTable('partner_bills', 'wimet_bills');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable('wimet_bills', 'partner_bills');
  },
};
