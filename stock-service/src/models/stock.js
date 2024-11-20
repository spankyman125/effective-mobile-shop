import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/database.js';

class Stock extends Model {}

Stock.init(
  {
    plu: { 
      primaryKey: true,
      type: DataTypes.STRING, 
      allowNull: false,
      references: {
        model: 'Products',
        key: 'plu'
      }
    },
    shop_id: {
      primaryKey: true, 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    quantity_on_shelf: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    quantity_in_order: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
  },
  {
    sequelize,
    modelName: 'Stock',
    createdAt: false,
    updatedAt: 'date',
  }
);

export default Stock;
