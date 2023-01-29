'use strict';

module.exports = {
  async up(queryInterface) {
    const exitsCoWork = await queryInterface.rawSelect('company_types', { where: { value: 'Co-Work' } }, ['id']);

    if (exitsCoWork) {
      await queryInterface.bulkUpdate('company_types', { value: 'Coworking' }, { id: exitsCoWork });
    }

    await queryInterface.bulkInsert(
      'company_types',
      [
        {
          value: 'Business Center',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: 'Empresa',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: 'Hotel',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: 'Office Building',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: 'Único',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('company_types', null, {});
  },
};
