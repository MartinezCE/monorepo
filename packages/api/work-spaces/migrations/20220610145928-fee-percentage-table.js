'use strict';
const snakecaseKeys = require('snakecase-keys');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'fee_percentages',
      snakecaseKeys(
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
          },
          value: {
            allowNull: false,
            type: Sequelize.DECIMAL(3, 2),
          },
          companyId: {
            allowNull: false,
            type: Sequelize.INTEGER.UNSIGNED,
            references: {
              model: 'companies',
              key: 'id',
            },
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        {
          deep: false,
        }
      )
    );
    const companyIds = await queryInterface.sequelize.query(
      `
        SELECT id, fee_percentage
        FROM companies AS c
        WHERE c.fee_percentage IS NOT NULL
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (companyIds.length) {
      await queryInterface.bulkInsert(
        'fee_percentages',
        companyIds.map(({ id: company_id, fee_percentage: value }) => ({
          value,
          company_id,
          created_at: new Date(),
          updated_at: new Date(),
        }))
      );
    }

    await queryInterface.removeColumn('companies', 'fee_percentage');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'fee_percentage', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      `
        UPDATE 
          companies AS c,
          fee_percentages AS f
        SET c.fee_percentage = f.value
        WHERE c.id = f.company_id
      `,
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    await queryInterface.dropTable('fee_percentages');
  },
};
