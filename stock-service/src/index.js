import bodyParser from 'body-parser';
import express from 'express';
import Product from './models/product.js';
import Stock from './models/stock.js';
import { connectDB, sequelize } from './database/database.js';
import MessageBroker from './rabbitmq/rabbitmq.js'
import { Op } from 'sequelize';

const app = express();
app.use(bodyParser.json());

connectDB();
await sequelize.sync({ force: true });

// Эндпоинт для создания товара
app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    MessageBroker.send("history", { type: "product", action: "product-create", ...product.dataValues })
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Эндпоинт для создания остатка
app.post('/stock', async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    MessageBroker.send("history", { type: "stock", action: "stock-create", ...stock.dataValues })
    res.status(201).send(stock);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Эндпоинт для увеличения остатка
app.patch('/stock/increase/:plu/:shop_id', async (req, res) => {
  try {
    const stock = await Stock.findOne({ where: { plu: req.params.plu, shop_id: req.params.shop_id } });
    if (!stock) {
      return res.status(404).send();
    }
    stock.quantity_on_shelf += req.body.inc_on_shelf;
    stock.quantity_in_order += req.body.inc_in_order;
    await stock.save();
    res.send(stock);
    MessageBroker.send("history", { type: "stock", action: "stock-increase", ...stock.dataValues })
  } catch (e) {
    res.status(400).send(e);
  }
});

// Эндпоинт для уменьшения остатка
app.patch('/stock/decrease/:plu/:shop_id', async (req, res) => {
  try {
    const stock = await Stock.findOne({ where: { plu: req.params.plu, shop_id: req.params.shop_id } });
    if (!stock) {
      return res.status(404).send();
    }
    stock.quantity_on_shelf -= req.body.dec_on_shelf;
    stock.quantity_in_order -= req.body.dec_in_order;
    await stock.save();
    MessageBroker.send("history", { type: "stock", action: "stock-decrease", ...stock.dataValues })
    res.send(stock);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Эндпоинт для получения остатков по фильтрам
app.get('/stock', async (req, res) => {
  const { plu, shop_id, quantity_on_shelf_min, quantity_on_shelf_max, quantity_in_order_min, quantity_in_order_max } = req.query;
  const filters = {
    ...(plu) && { plu: plu },
    ...(shop_id) && { shop_id: shop_id },
    ...(quantity_on_shelf_min || quantity_on_shelf_max) && {
      quantity_on_shelf: {
        ...(quantity_on_shelf_min) && { [Op.gte]: quantity_on_shelf_min },
        ...(quantity_on_shelf_max) && { [Op.lte]: quantity_on_shelf_max }
      }
    },
    ...(quantity_in_order_min || quantity_in_order_min) && {
      quantity_in_order: {
        ...(quantity_in_order_min) && { [Op.gte]: quantity_in_order_min },
        ...(quantity_in_order_max) && { [Op.lte]: quantity_in_order_max }
      }
    }
  };

  try {
    const stock = await Stock.findAll({ where: filters });
    res.send(stock);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Эндпоинт для получения товаров по фильтрам
app.get('/products', async (req, res) => {
  const { name, plu } = req.query;
  const filters = {
    ...(name) && { name: name },
    ...(plu) && { plu: plu }
  };

  try {
    const products = await Product.findAll({ where: filters });
    res.send(products);
  } catch (e) {
    res.status(400).send(e);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
