import Transaction from "../models/Transaction.js";

export const getDashboard = async (
    userId
) => {
    const transactions =
        await Transaction.find({
            userId,
        });

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    return {
        income,
        expense,
        balance: income - expense,
    };
};