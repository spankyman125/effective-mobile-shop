import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../database/database.js";

class ProductHistory extends Model<
  InferAttributes<ProductHistory>,
  InferCreationAttributes<ProductHistory>
> {
  declare id: number;
  declare action: string;
  declare date: Date;
  declare plu: string;
  declare name: string;
}

ProductHistory.init(
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
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ProductHistory",
    timestamps: false,
  }
);

export default ProductHistory;
