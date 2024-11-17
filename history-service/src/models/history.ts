import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database";

class ActionHistory extends Model {}

ActionHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "action_history",
  }
);

export default ActionHistory;
