'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'avatar_url', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'address',
    });
    await queryInterface.addColumn('companies', 'avatar_key', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'avatar_url',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('companies', 'avatar_url');
    await queryInterface.removeColumn('companies', 'avatar_key');
  },
};
