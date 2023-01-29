'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('companies', {
      fields: ['name'],
      type: 'UNIQUE',
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('companies');
  },
};
