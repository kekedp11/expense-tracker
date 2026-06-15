import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTransaction,
  getTransactions,
  getSummary,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createTransaction
);

router.get(
  "/",
  authMiddleware,
  getTransactions
);

router.get(
  "/summary",
  authMiddleware,
  getSummary
);

router.put(
  "/:id",
  authMiddleware,
  updateTransaction
);

router.delete(
  "/:id",
  authMiddleware,
  deleteTransaction
);

export default router;