import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { router as oauthRouter } from "./routes/oauth.route.js";
import { router as usersRouter } from "./routes/users.route.js";
import { router as apiRouter } from "./routes/api.route.js";

const app: Express = express();
app.use(morgan("dev"));
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.WEB_URL ?? "");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,POST,PUT,DELETE,PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/oauth", oauthRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  if (err.handled) {
    console.error(`Handled Error: ${err.message}`);
    res.status(statusCode).json({ message: err.message });
    return;
  } else {
    console.error(`Error: ${err.message}`, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
