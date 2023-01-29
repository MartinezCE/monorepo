'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('client-invitations', 'company_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('client-invitations', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('client-invitations', 'role_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'user_roles',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('client-invitations', 'plan_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'plans',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
