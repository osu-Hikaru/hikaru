import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
const port = process.env.PORT || 3000;

import { router as oauthRouter } from "./routes/oauth.route.js";
import { router as usersRouter } from "./routes/users.route.js";
import { router as apiRouter } from "./routes/api.route.js";

export let clientID: Number;
export let clientSecret: String;

if (process.env.NODE_ENV !== "production") {
  clientID = 5;
  clientSecret = "3LP2mhUrV89xxzD1YKNndXHEhWWCRLPNKioZ9ymT";
} else {
  clientID = 5;
  clientSecret = "FGc9GAtyHzeQDshWP5Ah7dega8hJACAJpQtw6OXk";
}

const app: Express = express();
app.use(morgan("dev"));

app.use("/oauth", oauthRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(`Error: ${err.message}`, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
