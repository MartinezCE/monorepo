'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('companies_users', 'user_id', {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
      }),
      queryInterface.changeColumn('companies_users', 'company_id', {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'companies',
          key: 'id',
        },
      }),
    ]);
  },

  async down(queryInterface) {
    queryInterface.changeColumn('companies_users', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
    });

    queryInterface.changeColumn('companies_users', 'company_id', {
      type: Sequelize.INTEGER.UNSIGNED,
    });
  },
};
