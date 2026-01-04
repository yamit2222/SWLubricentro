'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar constraint de itemId si existe
    try {
      await queryInterface.removeConstraint('Pedidos', 'Pedidos_itemId_fkey');
    } catch (error) {
      // El constraint puede no existir
    }

    // Agregar nuevas columnas
    await queryInterface.addColumn('Pedidos', 'productoId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Productos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addColumn('Pedidos', 'subproductoId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'SubProductos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    // Migrar datos existentes basándose en itemType
    await queryInterface.sequelize.query(`
      UPDATE "Pedidos" 
      SET "productoId" = "itemId" 
      WHERE "itemType" = 'producto';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Pedidos" 
      SET "subproductoId" = "itemId" 
      WHERE "itemType" = 'subproducto';
    `);

    // Cambiar tipos de datos de fecha y hora
    await queryInterface.changeColumn('Pedidos', 'fecha', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });

    await queryInterface.changeColumn('Pedidos', 'hora', {
      type: Sequelize.TIME,
      allowNull: false
    });

    // Eliminar columnas antiguas
    await queryInterface.removeColumn('Pedidos', 'itemId');
    await queryInterface.removeColumn('Pedidos', 'itemType');
  },

  async down(queryInterface, Sequelize) {
    // Agregar columnas antiguas
    await queryInterface.addColumn('Pedidos', 'itemId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Pedidos', 'itemType', {
      type: Sequelize.ENUM('producto', 'subproducto'),
      allowNull: false,
      defaultValue: 'producto'
    });

    // Migrar datos de vuelta
    await queryInterface.sequelize.query(`
      UPDATE "Pedidos" 
      SET "itemId" = "productoId", "itemType" = 'producto'
      WHERE "productoId" IS NOT NULL;
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Pedidos" 
      SET "itemId" = "subproductoId", "itemType" = 'subproducto'
      WHERE "subproductoId" IS NOT NULL;
    `);

    // Cambiar tipos de datos de vuelta
    await queryInterface.changeColumn('Pedidos', 'fecha', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('Pedidos', 'hora', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Eliminar nuevas columnas
    await queryInterface.removeColumn('Pedidos', 'productoId');
    await queryInterface.removeColumn('Pedidos', 'subproductoId');
  }
};