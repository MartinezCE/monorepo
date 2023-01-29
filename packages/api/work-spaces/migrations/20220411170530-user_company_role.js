'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'company_role', {
      type: Sequelize.STRING,
      after: "user_type_id"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'company_role');
  },
};
