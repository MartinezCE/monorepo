'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('blueprints', 'key', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('blueprints', 'mimetype', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('blueprints', 'key', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('blueprints', 'mimetype', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
