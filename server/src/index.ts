import { config } from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import AllTypeDefs from "./graphql/typeDefs/index.typeDefs.js";
import AllResolvers from "./graphql/resolvers/index.resolvers.js";
import { expressMiddleware } from "@apollo/server/express4";
import { connectDB } from "./config/database.js";;
import { ApolloServerErrorCode } from "@apollo/server/errors";
const port = process.env.PORT || 4000;
config();

const app = express();
const httpServer = http.createServer(app);

try {
  try {
    await connectDB();
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }

  const server = new ApolloServer({
    typeDefs: AllTypeDefs,
    resolvers: AllResolvers,
    formatError: (formattedError) => {      if (
        formattedError.extensions.code ===
        ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
      ) {
        return {
          ...formattedError,
          message:
            "Your query doesn't match the schema. Try double-checking it!",
        };
      }

      return formattedError;
    },
  });

  await server.start();

  app.use(
    cors({
      // origin: process.env.FRONTEND_URL,
      // credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(server)
  );

  await new Promise((resolve: any) => httpServer.listen({ port }, resolve));
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
