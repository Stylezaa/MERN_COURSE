const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");
const api = process.env.API_URL;

// for allow use api for all user
app.use(cors());
app.options("*", cors());

const categoriesRouter = require("./routers/categories");
const productsRouter = require("./routers/products");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");

//Middleware
app.use(express.json()); // For transfrom input data from frontend to backend (pasing json to object)
app.use(morgan("tiny")); // HTTP request logger middleware for node.js
app.use(authJwt());
app.use(errorHandler); //Eror Handler Authentication

//Routers
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //     useCreateIndex: true,
    //     useFindAndModify: false, //for delete warning from console
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});

module.exports = app;
