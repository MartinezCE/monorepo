'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'user_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user_types',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('users', 'user_role_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'user_roles',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
