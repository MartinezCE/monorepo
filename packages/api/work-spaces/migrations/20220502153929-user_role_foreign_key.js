'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'user_role_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'user_roles',
        key: 'id',
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'user_role_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
