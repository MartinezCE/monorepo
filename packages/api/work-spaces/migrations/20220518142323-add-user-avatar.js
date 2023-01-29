'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatar_url', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'is_wpm_enabled',
    });
    await queryInterface.addColumn('users', 'avatar_key', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'avatar_url',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'avatar_url');
    await queryInterface.removeColumn('users', 'avatar_key');
  },
};
