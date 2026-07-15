import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import boardRouter from "./routes/board.route";
import taskRouter from "./routes/task.route";

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL
].filter(Boolean);

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        // requests with no origin (curl, server-to-server, Postman) are allowed through
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

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