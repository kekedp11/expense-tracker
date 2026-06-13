import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./DashboardPage.css";

function DashboardPage() {
  const [dashboard, setDashboard] =
    useState(null);

  const [transactions, setTransactions] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [type, setType] =
    useState("expense");

  const [category, setCategory] =
    useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response =
          await api.get("/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setDashboard(response.data);

        const transactionResponse =
          await api.get("/transactions", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setTransactions(
          transactionResponse.data
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAddTransaction =
    async (e) => {
      e.preventDefault();

      try {
        const token =
          localStorage.getItem("token");

        await api.post(
          "/transactions",
          {
            title,
            amount: Number(amount),
            type,
            category,
            date: new Date()
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };

    const handleDeleteTransaction =
      async (id) => {

        if (
          !window.confirm(
            "Yakin ingin menghapus transaksi ini?"
          )
        ) {
          return;
        }

        try {
          const token =
            localStorage.getItem("token");

          await api.delete(
            `/transactions/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      };

  const handleEditTransaction =
  async (transaction) => {
    const newTitle =
      prompt(
        "Edit title",
        transaction.title
      );

    const newAmount =
      prompt(
        "Edit amount",
        transaction.amount
      );

    if (
      !newTitle ||
      !newAmount
    ) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      await api.put(
        `/transactions/${transaction._id}`,
        {
          title: newTitle,
          amount:
            Number(newAmount),
          type:
            transaction.type,
          category:
            transaction.category,
          date:
            transaction.date,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat(
      "id-ID"
    ).format(number);
  };

  if (!dashboard) {
    return <h1>Loading...</h1>;
  }

  return (
  <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="summary">
        <div className="card income-card">
          <h3>Income</h3>
          <p>
            Rp {formatRupiah(
              dashboard.income
            )}
          </p>
        </div>

        <div className="card expense-card">
          <h3>Expense</h3>
          <p>
            Rp {formatRupiah(
              dashboard.expense
            )}
          </p>
        </div>

        <div className="card balance-card">
          <h3>Balance</h3>
          <p>
            Rp {formatRupiah(
              dashboard.balance
            )}
          </p>
        </div>
      </div>

      <h2>Transactions</h2>

      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="transaction-card"
        >
          <h3>{transaction.title}</h3>

          <p>
            Rp{" "}
            {formatRupiah(
              transaction.amount
            )}
          </p>

          <button
            onClick={() =>
              handleEditTransaction(
                transaction
              )
            }
          >
            Edit
          </button>

          <button
            onClick={() =>
              handleDeleteTransaction(
                transaction._id
              )
            }
          >
            Delete
          </button>
        </div>
      ))}

      <h2>Add Transaction</h2>

      <form onSubmit={handleAddTransaction}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <br />
        <br />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>

        <br />
        <br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Add Transaction
        </button>
      </form>

      <hr />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;