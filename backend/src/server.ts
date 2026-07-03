import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import boardRouter from "./routes/board.route";
import taskRouter from "./routes/task.route";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Setting PORT
const PORT = process.env.PORT || 3000;

// API Routes
const API_ROUTE = process.env.API_ROUTE!;

app.use(`${API_ROUTE}/auth`, authRouter);
app.use(`${API_ROUTE}/boards`, boardRouter);
app.use(`${API_ROUTE}/tasks`, taskRouter);

// Start Server
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});