'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const [argCurrencyId, mexCurrencyId] = await Promise.all([
      queryInterface.rawSelect('currencies', { where: { value: 'ARS' } }, ['id']),
      queryInterface.rawSelect('currencies', { where: { value: 'MXN' } }, ['id']),
    ]);
    
    await queryInterface.bulkInsert('credits', 
      [
        {
          value: 50,
          currency_id: argCurrencyId,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          value: 500,
          currency_id: mexCurrencyId,
          created_at: new Date(),
          updated_at: new Date()
        },
      ]
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('credits', null, {});
  }
};
