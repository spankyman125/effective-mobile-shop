import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/database.js';

class Product extends Model {}

Product.init(
  {
    plu: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
  },
  {
    sequelize,
    modelName: 'Product',
    createdAt: false,
    updatedAt: 'date',
  }
);

export default Product;
