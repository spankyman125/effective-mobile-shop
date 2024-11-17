import express from "express";
import bodyParser from "body-parser";
import { connectDB, sequelize } from "./database/database";
import ActionHistory from "./models/history";
import { WhereOptions } from "sequelize";
import MessageBroker from "./rabbitmq/rabbitmq"

const app = express();

app.use(bodyParser.json());

void connectDB();
void sequelize.sync();

void MessageBroker.receive("history")

app.get("/action-history", async (req, res) => {
  const {
    shop_id,
    plu,
    date_start,
    date_end,
    action,
    page = 1,
    size = 10,
  } = req.query;
  const filters: WhereOptions = {};

  if (shop_id) filters.shop_id = shop_id;
  if (plu) filters.plu = plu;
  if (action) filters.action = action;
  if (date_start || date_end) {
    filters.date = {
      $gte: date_start ? new Date(date_start as string) : undefined,
      $lte: date_end ? new Date(date_end as string) : undefined,
    };
  }

  try {
    const actions = await ActionHistory.findAndCountAll({
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
