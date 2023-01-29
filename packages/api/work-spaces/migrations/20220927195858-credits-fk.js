'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('credits', 'currency_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'currencies',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
