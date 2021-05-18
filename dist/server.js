"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const bodyParser = require("body-parser");
const logger_1 = require("./middleware/logger");
const express = require("express");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const home_route_1 = require("./routes/home/home.route");
const auth_route_1 = require("./routes/auth/auth.route");
const server = express();
const swaggerDocument = YAML.load('docs/swagger.yaml');
const app = new app_1.default({
    port: 5000,
    controllers: [
        new home_route_1.default(),
        new auth_route_1.default()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        logger_1.default,
    ],
});
app.dbConnection();
app.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//# sourceMappingURL=server.js.map