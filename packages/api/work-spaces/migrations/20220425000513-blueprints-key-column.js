'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('blueprints', 'key', {
      type: Sequelize.STRING,
      after: "url"
     });

     await queryInterface.addColumn('blueprints', 'mimetype', {
      type: Sequelize.STRING,
      after: "url"
     });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('blueprints', 'key');
    await queryInterface.removeColumn('blueprints', 'mimetype');
  },
};
