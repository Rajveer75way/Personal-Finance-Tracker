import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
const cors = require('cors');
import fs from "fs";

// Import rate limiter
import rateLimit from "express-rate-limit";

// Import other necessary modules
import { initDB } from "./app/common/services/database.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
const swaggerUi = require("swagger-ui-express");
const expenseSwagger = JSON.parse(fs.readFileSync("./app/swagger/expenses.swagger.json", "utf8"));
const budgetSwagger = JSON.parse(fs.readFileSync("./app/swagger/budget.swagger.json", "utf8"));
const financialReportSwager = JSON.parse(fs.readFileSync("./app/swagger/financialReport.swagger.json", "utf8"));

const combinedSwagger = {
  ...expenseSwagger,
  paths: {
    ...expenseSwagger.paths,
    ...budgetSwagger.paths,
    ...financialReportSwager.paths,
  }
};

loadConfig();

const port = Number(process.env.PORT) ?? 5000;
const app: Express = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

// Rate Limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  headers: true, // Optionally, set rate limit information in response headers
});

// Apply rate limiter to all requests
app.use(limiter);

const initApp = async (): Promise<void> => {
  // init mongod
  await initDB();
  app.use("/api", routes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(combinedSwagger));
  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("Server is running on port", port);
  });
};

void initApp();
