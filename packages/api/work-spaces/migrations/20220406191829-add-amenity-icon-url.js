'use strict';

const amenities = [
  { name: 'Estacionamiento', file_name: 'Estacionamiento.svg' },
  { name: 'Cocina', file_name: 'Cocina.svg' },
  { name: 'Pet Friendly', file_name: 'Pet.svg' },
  { name: 'Restaurante & Café', file_name: 'Café.svg' },
  { name: 'Exteriores', file_name: 'Exterior.svg' },
  { name: 'Seguridad', file_name: 'Seguridad.svg' },
  { name: 'Espacios de recreación', file_name: 'Recreación.svg' },
  { name: 'Snacks', file_name: 'Snacks.svg' },
  { name: 'Phone Booth', file_name: 'Phone booth.svg' },
  { name: 'Acceso Discapacitados', file_name: 'Discapacitados.svg' },
  { name: 'Rack Bicicletas', file_name: 'Bici.svg' },
  { name: 'Catering', file_name: 'Catering.svg' },
  { name: 'Baby Room', file_name: 'Baby.svg' },
  { name: 'Vestuario', file_name: 'Vestuario.svg' },
  { name: 'Lockers', file_name: 'Lockers.svg' },
  { name: 'Gimnasio', file_name: 'Gim.svg' },
  { name: 'Centro de copias', file_name: 'Printer.svg' },
  { name: 'Comedor / Sala de uso común', file_name: 'Comedor.svg' },
  { name: 'Sanitización de espacios', file_name: 'Sanitización 2.svg' },
  { name: 'Protocolo Covid', file_name: 'Covid.svg' },
  { name: 'Control de accceso', file_name: 'Control de acceso.svg' },
  { name: 'Calefacción / Aire Acondicionado', file_name: 'Aire.svg' },
  { name: 'Cocina / Heladera', file_name: 'Cocina.svg' },
  { name: 'TV', file_name: 'TV.svg' },
  { name: 'Pizarra', file_name: 'Pizarra.svg' },
  { name: 'Proyector', file_name: 'Proyector.svg' },
  { name: 'Monitores', file_name: 'Monitor.svg' },
  { name: 'Audio', file_name: 'Audio.svg' },
  { name: 'Apple TV / Chromecast', file_name: 'apple tv.svg' },
];

module.exports = {
  async up(queryInterface) {
    await Promise.all(
      amenities.map(a => queryInterface.bulkUpdate('amenities', { file_name: a.file_name }, { name: a.name }))
    );
  },

  async down(queryInterface) {
    await Promise.all(
      amenities.map(a => queryInterface.bulkUpdate('amenities', { file_name: 'Star.svg' }, { name: a.name }))
    );
  },
};
