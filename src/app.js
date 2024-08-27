const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const { checkOverLoad } = require("./helper/check.connect.js");

const app = express();

// init middleware
// morgan -> in ra cac log
app.use(morgan("dev"));
// helmet -> che dau ca thong tin header
app.use(helmet());
// compression -> giam bang thong
app.use(compression());
// init db
require("./databases/init.mongodb.js");
checkOverLoad();
// init routes

// handling error

module.exports = app;
