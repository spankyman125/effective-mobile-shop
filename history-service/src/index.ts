import bodyParser from "body-parser";
import express from "express";
import { Op, WhereOptions } from "sequelize";
import { connectDB, sequelize } from "./database/database";
import MessageBroker from "./rabbitmq/rabbitmq";
import ProductHistory from "./models/productHistory";
import StockHistory from "./models/stockHistory";

const app = express();

app.use(bodyParser.json());

void connectDB();
void sequelize.sync({ force: true });

void MessageBroker.receive("history");

interface HistoryRequest {
  action?: string;
  plu?: string;
  date_start?: Date;
  date_end?: Date;
  page?: number;
  size?: number;
}

interface StockHistoryRequest extends HistoryRequest {
  shop_id?: number;
}

interface ProductHistoryRequest extends HistoryRequest {
  name?: string;
}

app.get("/history/stock", async (req, res) => {
  const {
    action,
    plu,
    shop_id,
    date_start,
    date_end,
    page = 1,
    size = 10,
  } = req.body as StockHistoryRequest;

  const filters: WhereOptions<StockHistory> = {
    ...(shop_id && { shop_id: shop_id }),
    ...(action && { action: action }),
    ...(plu && { plu: plu }),
    ...(date_start && { [Op.gte]: date_start }),
    ...(date_end && { [Op.lte]: date_end }),
  };

  try {
    const actions = await StockHistory.findAndCountAll({
      where: filters,
      limit: Number(size),
      offset: (Number(page) - 1) * Number(size),
    });

    res.send({
      total: actions.count,
      pages: Math.ceil(actions.count / Number(size)),
      data: actions.rows,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/history/product", async (req, res) => {
  const {
    action,
    plu,
    name,
    date_start,
    date_end,
    page = 1,
    size = 10,
  } = req.body as ProductHistoryRequest;

  const filters: WhereOptions<ProductHistory> = {
    ...(action && { action: action }),
    ...(name && { action: name }),
    ...(plu && { plu: plu }),
    ...(date_start && { [Op.gte]: date_start }),
    ...(date_end && { [Op.lte]: date_end }),
  };

  try {
    const actions = await ProductHistory.findAndCountAll({
      where: filters,
      limit: Number(size),
      offset: (Number(page) - 1) * Number(size),
    });

    res.send({
      total: actions.count,
      pages: Math.ceil(actions.count / Number(size)),
      data: actions.rows,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT.toString()}`);
});
