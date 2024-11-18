import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../database/database.js';

class StockHistory extends Model<InferAttributes<StockHistory>, InferCreationAttributes<StockHistory>> {
  declare id: number;
  declare action: string;
  declare date: Date;
  declare plu: string;
  declare shop_id: number;
  declare quantity_on_shelf: number;
  declare quantity_in_order: number;
}

StockHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    plu: { 
      type: DataTypes.STRING, 
      allowNull: false,
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
    modelName: 'StockHistory',
    timestamps: false,
  }
);

export default StockHistory;
