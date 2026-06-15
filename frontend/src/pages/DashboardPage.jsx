import {
  useEffect,
  useState
} from "react";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

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

  const categories = [
    "all",
    ...new Set(
      transactions.map(
        (transaction) =>
          transaction.category
      )
    ),
  ];

  const filteredTransactions =
  transactions.filter(
    (transaction) => {
      const matchesCategory =
        selectedCategory === "all" ||
        transaction.category ===
          selectedCategory;

      const matchesSearch =
        transaction.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );

  if (!dashboard) {
    return <h1>Loading...</h1>;
  }

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [dashboard.income, dashboard.expense],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  const chartData = [
        {
          type: "Income",
          value: dashboard.income,
        },
        {
          type: "Expense",
          value: dashboard.expense,
        },
      ];

  return (
  <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="summary">
      <div style={{
        maxWidth: "350px",
        margin: "30px auto",
        padding: "20px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        <h2>Income vs Expense</h2>

        <Pie
          data={pieData}
          options={{
            cutout: "65%",
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />
      </div>
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

      <input
        type="text"
        placeholder="Search transaction..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <select
        value={selectedCategory}
        onChange={(e) =>
          setSelectedCategory(
            e.target.value
          )
        }
      >
        {categories.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category}
          </option>
        ))}
      </select>

      <br />
      <br />

      {filteredTransactions.length === 0 ? (
        <p>
          No transactions found.
        </p>
      ) : (
        filteredTransactions.map(
          (transaction) => (         
        <div
          key={transaction._id}
          className={`transaction-card ${
            transaction.type
          }`}
        >
          <h3>{transaction.title}</h3>

          <p className="category">
            {transaction.category}
          </p>

          <p className="date">
            {new Date(
              transaction.date
            ).toLocaleDateString("id-ID")}
          </p>

          <p className="amount">
            {transaction.type === "income"
              ? "+ "
              : "- "}
            Rp{" "}
            {formatRupiah(
              transaction.amount
            )}
          </p>

          <button
            onClick={() =>
              handleEditTransaction(transaction)
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
      ))
      )}

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