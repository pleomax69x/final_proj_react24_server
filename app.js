const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const boolParser = require("express-query-boolean");

const userRouter = require("./routes/users/user-routes");
const { HttpCode } = require("./helpers/constans");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(boolParser());

app.use("/api", userRouter);

app.use((err, _req, res, _next) => {
  console.log(err);
  const code = err.code || HttpCode.NOT_FOUND;
  const status = err.status || "error";
  const message = err || "error";
  res.status(code).json({ status, code, message: message });
});

app.use((err, _req, res, _next) => {
  const code = err.code || HttpCode.INTERNAL_SERVER_ERROR;
  const status = err.status || "fail";
  const message = err || "error";
  res.status(code).json({ status, code, message: message });
});

module.exports = app;
