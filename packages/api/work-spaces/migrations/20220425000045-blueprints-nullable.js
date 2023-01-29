'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('blueprints', 'name', {
      allowNull: true,
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('blueprints', 'url', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('blueprints', 'name', {
      allowNull: false,
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('blueprints', 'url', {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },
};
