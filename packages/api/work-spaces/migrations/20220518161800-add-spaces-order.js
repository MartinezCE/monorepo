'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('spaces', 'order', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'space_type_id',
    });
  },
};
