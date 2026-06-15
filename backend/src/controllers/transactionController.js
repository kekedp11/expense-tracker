import * as transactionService from "../services/transactionService.js";

export const createTransaction = async (
  req,
  res
) => {
  try {
    const transaction =
      await transactionService.createTransaction(
        req.body,
        req.user.userId
      );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getTransactions = async (
  req,
  res
) => {
  try {
    const transactions =
      await transactionService.getTransactions(
        req.user.userId
      );

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTransaction = async (
  req,
  res
) => {
  try {
    const transaction =
      await transactionService.updateTransaction(
        req.params.id,
        req.body,
        req.user.userId
      );

    res.json(transaction);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteTransaction = async (
  req,
  res
) => {
  try {
    const result =
      await transactionService.deleteTransaction(
        req.params.id,
        req.user.userId
      );

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getSummary = async (
  req,
  res
) => {
  try {
    const summary =
      await transactionService.getSummary(
        req.user.userId
      );

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};