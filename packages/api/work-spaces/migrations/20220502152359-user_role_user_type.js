'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_roles', 'user_type_id', {
      after: 'value',
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'user_types',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_roles', 'user_type_id');
  },
};
