const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const boolParser = require("express-query-boolean");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const userRouter = require("./routes/users/user-routes");
const projectRouter = require("./routes/projects/project-routes");
const sprintRouter = require("./routes/sprints/sprint-router");

const { HttpCode } = require("./helpers/constants");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(boolParser());

app.use("", userRouter);
app.use("/projects", projectRouter);
app.use("/", sprintRouter);

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
