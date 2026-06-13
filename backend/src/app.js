import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API",
  });
});

app.get(
  "/api/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Protected route",
      user: req.user,
    });
  }
);


export default app;