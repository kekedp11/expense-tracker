import { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./DashboardPage.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, txRes] = await Promise.all([
          api.get("/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDashboard(dashRes.data);
        setTransactions(txRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/transactions",
        {
          title,
          amount: Number(amount),
          type,
          category,
          date: new Date(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTransactions((prev) => [...prev, res.data]);

      setTitle("");
      setAmount("");
      setCategory("");
      setType("expense");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete transaction?")) return;

    await api.delete(`/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  const handleEdit = async (t) => {
    const newTitle = prompt("Edit title", t.title);
    const newAmount = prompt("Edit amount", t.amount);

    if (!newTitle || !newAmount) return;

    await api.put(
      `/transactions/${t._id}`,
      { ...t, title: newTitle, amount: Number(newAmount) },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTransactions((prev) =>
      prev.map((item) =>
        item._id === t._id
          ? { ...item, title: newTitle, amount: Number(newAmount) }
          : item
      )
    );
  };

  const formatRupiah = (n) =>
    new Intl.NumberFormat("id-ID").format(n);

  if (!dashboard) return <h2 className="loading">Loading...</h2>;

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [dashboard.income, dashboard.expense],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [5000, 4500, 6000, 5500, 7000, 6500],
        borderColor: "#22c55e",
      },
      {
        label: "Expense",
        data: [2000, 3000, 2500, 1800, 3500, 2700],
        borderColor: "#ef4444",
      },
    ],
  };

  const categories = [
    "all",
    ...new Set(transactions.map((t) => t.category)),
  ];

  const filtered = transactions.filter((t) => {
    const matchCat =
      selectedCategory === "all" || t.category === selectedCategory;

    const matchSearch = t.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchCat && matchSearch;
  });

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>FinTrack</h2>

        <nav>
          <p
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </p>

          <p
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </p>

          <p
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </p>
        </nav>

        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOP BAR */}
        <header className="topbar">
          <h3>{activeTab.toUpperCase()}</h3>
        </header>

        {/* CONTENT */}
        <section className="content">

          {activeTab === "dashboard" && (
            <>
              <div className="cards">
                <div className="card income">
                  Income
                  <p>Rp {formatRupiah(dashboard.income)}</p>
                </div>

                <div className="card expense">
                  Expense
                  <p>Rp {formatRupiah(dashboard.expense)}</p>
                </div>

                <div className="card balance">
                  Balance
                  <p>Rp {formatRupiah(dashboard.balance)}</p>
                </div>
              </div>

              <div className="chart">
                <h3>Income vs Expense</h3>
                <div className="chart-box">
                  <Pie data={pieData} />
                </div>
              </div>
            </>
          )}

          {activeTab === "analytics" && (
            <div className="chart">
              <h3>Monthly Analytics</h3>
              <div className="chart-box">
                <Line data={monthlyData} />
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <>
              <div className="filter">
                <input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="list">
                {filtered.map((t) => (
                  <div key={t._id} className={`item ${t.type}`}>
                    <div>
                      <h4>{t.title}</h4>
                      <small>{t.category}</small>
                    </div>

                    <div className="right">
                      <p>
                        {t.type === "income" ? "+" : "-"} Rp{" "}
                        {formatRupiah(t.amount)}
                      </p>

                      <button onClick={() => handleEdit(t)}>Edit</button>
                      <button onClick={() => handleDelete(t._id)}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* FORM ALWAYS */}
          <form onSubmit={handleAddTransaction} className="form">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <button type="submit">Add</button>
          </form>

        </section>
      </main>
    </div>
  );
}

export default DashboardPage;