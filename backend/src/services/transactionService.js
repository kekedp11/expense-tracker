import Transaction from "../models/Transaction.js";

export const createTransaction = async (
  data,
  userId
) => {
  const transaction =
    await Transaction.create({
      ...data,
      userId,
    });

  return transaction;
};

export const getTransactions = async (
  userId
) => {
  return await Transaction.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

export const updateTransaction = async (
  id,
  data,
  userId
) => {
  const transaction =
    await Transaction.findById(id);

  if (!transaction) {
    throw new Error(
      "Transaction not found"
    );
  }

  if (
    transaction.userId.toString() !==
    userId
  ) {
    throw new Error("Unauthorized");
  }

  return await Transaction.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteTransaction = async (
  id,
  userId
) => {
  const transaction =
    await Transaction.findById(id);

  if (!transaction) {
    throw new Error(
      "Transaction not found"
    );
  }

  if (
    transaction.userId.toString() !==
    userId
  ) {
    throw new Error("Unauthorized");
  }

  await Transaction.findByIdAndDelete(id);

  return {
    message: "Transaction deleted",
  };
};

export const getSummary = async (
  userId
) => {
  const transactions =
    await Transaction.find({ userId });

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce(
      (sum, t) => sum + t.amount,
      0
    );

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (sum, t) => sum + t.amount,
      0
    );

  return {
    income,
    expense,
    balance: income - expense,
  };
};