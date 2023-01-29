'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('client-invitations', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'to_email',
    });

    await queryInterface.addColumn('client-invitations', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'first_name',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('client-invitations', 'first_name');
    await queryInterface.removeColumn('client-invitations', 'last_name');
  },
};
