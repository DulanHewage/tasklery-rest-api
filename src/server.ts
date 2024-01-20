import express from "express";
import morgan from "morgan";
import connectToDb from "./lib/dbConnection.js";
import { Request, Response, NextFunction } from "express";
import routes from "./routes/index.js";
const app = express();

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => console.log(message.trim()),
    },
  }
);

app.use(morganMiddleware);
app.use(express.json());
app.use("/", routes);
interface CustomError extends Error {
  status?: number;
}

// Error handling middleware
app.use(
  (err: CustomError, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    // You can also log the error to a file or console
    console.error(err);

    res.status(status).json({
      error: {
        message,
        status,
      },
    });
    next();
  }
);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await connectToDb();
  console.log(`server started on port: ${port}`);
});
