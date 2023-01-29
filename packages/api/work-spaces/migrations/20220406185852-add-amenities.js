'use strict';

const config = {
  LOCATION: 'LOCATION',
  SAFETY: 'SAFETY',
  SPACE: 'SPACE',
};

const amenities = [
  { name: 'Restaurante & Café', type: config.LOCATION },
  { name: 'Exteriores', type: config.LOCATION },
  { name: 'Seguridad', type: config.LOCATION },
  { name: 'Espacios de recreación', type: config.LOCATION },
  { name: 'Snacks', type: config.LOCATION },
  { name: 'Phone Booth', type: config.LOCATION },
  { name: 'Acceso Discapacitados', type: config.LOCATION },
  { name: 'Rack Bicicletas', type: config.LOCATION },
  { name: 'Catering', type: config.LOCATION },
  { name: 'Baby Room', type: config.LOCATION },
  { name: 'Vestuario', type: config.LOCATION },
  { name: 'Lockers', type: config.LOCATION },
  { name: 'Gimnasio', type: config.LOCATION },
  { name: 'Centro de copias', type: config.LOCATION },
  { name: 'Comedor / Sala de uso común', type: config.LOCATION },
  { name: 'Sanitización de espacios', type: config.SAFETY },
  { name: 'Protocolo Covid', type: config.SAFETY },
  { name: 'Control de accceso', type: config.SAFETY },
  { name: 'Calefacción / Aire Acondicionado', type: config.SPACE },
  { name: 'Cocina / Heladera', type: config.SPACE },
  { name: 'TV', type: config.SPACE },
  { name: 'Pizarra', type: config.SPACE },
  { name: 'Proyector', type: config.SPACE },
  { name: 'Monitores', type: config.SPACE },
  { name: 'Audio', type: config.SPACE },
  { name: 'Apple TV / Chromecast', type: config.SPACE },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'amenities',
      amenities.map(amenity => ({
        ...amenity,
        created_at: new Date(),
        updated_at: new Date(),
        is_default: true,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('amenities', {
      [Sequelize.Op.and]: {
        name: { [Sequelize.Op.in]: amenities.map(a => a.name) },
        type: { [Sequelize.Op.in]: amenities.map(a => a.type) },
      },
    });
  },
};
