import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import bodyParser from "body-parser";
import schema from "../graphql/schemas";
import connect from "../db/mongo";
// import globalRouter from "./router/globalRouter";

const app = express();

app.set(`PORT`, process.env.PORT);
app.use(morgan(`dev`));
connect();

const loggingMiddleware = (req, res, next) => {
  // console.log(`ip: `, req);
  next();
};

const root = {
  ip: (args, request) => {
    return request.ip;
  },
};

// app.use("/rest", globalRouter);
app.use(loggingMiddleware);
app.use(
  "/graphql",
  cors(),
  bodyParser.json(),

  graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: root,
  })
);

app.listen(app.get(`PORT`), () => {
  console.log(
    `[USER SERVER START] :: ${process.env.PORT}, WITH GraphQL - MongoDB`
  );
});
