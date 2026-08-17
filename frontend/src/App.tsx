import { useEffect, useState } from "react";
import "./App.css";
import {
  addToPortfolio,
  createStock,
  getPortfolio,
  getStocks,
  loginUser,
  registerUser,
  removeFromPortfolio,
  StockDto,
} from "./api";

type Auth = {
  username: string;
  email: string;
  token: string;
};

const emptyNewStock = {
  Symbol: "",
  CompanyName: "",
  PurchasePrice: "",
  LastDiv: "",
  Industry: "",
  MarketCap: "",
};

function App() {
  const [auth, setAuth] = useState<Auth | null>(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);

  const [stocks, setStocks] = useState<StockDto[]>([]);
  const [portfolio, setPortfolio] = useState<StockDto[]>([]);
  const [newStock, setNewStock] = useState(emptyNewStock);
  const [portfolioSymbol, setPortfolioSymbol] = useState("");
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
      refreshData(auth.token);
    } else {
      localStorage.removeItem("auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  async function refreshData(token: string) {
    setDataError(null);
    try {
      const [stocksResult, portfolioResult] = await Promise.all([
        getStocks(token),
        getPortfolio(token),
      ]);
      setStocks(stocksResult);
      setPortfolio(portfolioResult);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Nie udało się pobrać danych");
    }
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    try {
      const result =
        authMode === "login"
          ? await loginUser(authForm.username, authForm.password)
          : await registerUser(authForm.username, authForm.email, authForm.password);

      setAuth({ username: result.Username, email: result.Email, token: result.Token });
      setAuthForm({ username: "", email: "", password: "" });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Coś poszło nie tak");
    }
  }

  function handleLogout() {
    setAuth(null);
    setStocks([]);
    setPortfolio([]);
  }

  async function handleCreateStock(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setDataError(null);
    try {
      await createStock(auth.token, {
        Symbol: newStock.Symbol,
        CompanyName: newStock.CompanyName,
        PurchasePrice: Number(newStock.PurchasePrice),
        LastDiv: Number(newStock.LastDiv),
        Industry: newStock.Industry,
        MarketCap: Number(newStock.MarketCap),
      });
      setNewStock(emptyNewStock);
      await refreshData(auth.token);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Nie udało się dodać spółki");
    }
  }

  async function handleAddToPortfolio(symbol: string) {
    if (!auth) return;
    setDataError(null);
    try {
      await addToPortfolio(auth.token, symbol);
      await refreshData(auth.token);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Nie udało się dodać do portfolio");
    }
  }

  async function handleAddPortfolioBySymbol(e: React.FormEvent) {
    e.preventDefault();
    if (!portfolioSymbol.trim()) return;
    await handleAddToPortfolio(portfolioSymbol.trim());
    setPortfolioSymbol("");
  }

  async function handleRemoveFromPortfolio(symbol: string) {
    if (!auth) return;
    setDataError(null);
    try {
      await removeFromPortfolio(auth.token, symbol);
      await refreshData(auth.token);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Nie udało się usunąć z portfolio");
    }
  }

  if (!auth) {
    return (
      <div className="App">
        <div className="auth-box">
          <h1>Finance Tracker</h1>
          <div className="auth-tabs">
            <button
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Logowanie
            </button>
            <button
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Rejestracja
            </button>
          </div>

          <form onSubmit={handleAuthSubmit}>
            <label>
              Username
              <input
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                required
              />
            </label>

            {authMode === "register" && (
              <label>
                Email
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                />
              </label>
            )}

            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />
            </label>

            <button type="submit">{authMode === "login" ? "Zaloguj" : "Zarejestruj"}</button>
          </form>

          {authMode === "register" && (
            <p className="hint">
              Hasło musi mieć min. 8 znaków, dużą i małą literę, cyfrę i znak specjalny.
            </p>
          )}

          {authError && <p className="error">{authError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="topbar">
        <h1>Finance Tracker</h1>
        <div>
          Zalogowano jako <strong>{auth.username}</strong>{" "}
          <button onClick={handleLogout}>Wyloguj</button>
        </div>
      </header>

      {dataError && <p className="error">{dataError}</p>}

      <div className="columns">
        <section>
          <h2>Spółki</h2>

          <form className="inline-form" onSubmit={handleCreateStock}>
            <input
              placeholder="Symbol"
              maxLength={10}
              value={newStock.Symbol}
              onChange={(e) => setNewStock({ ...newStock, Symbol: e.target.value })}
              required
            />
            <input
              placeholder="Nazwa (max 10 znaków)"
              maxLength={10}
              value={newStock.CompanyName}
              onChange={(e) => setNewStock({ ...newStock, CompanyName: e.target.value })}
              required
            />
            <input
              placeholder="Cena zakupu"
              type="number"
              step="0.01"
              value={newStock.PurchasePrice}
              onChange={(e) => setNewStock({ ...newStock, PurchasePrice: e.target.value })}
              required
            />
            <input
              placeholder="Dywidenda"
              type="number"
              step="0.01"
              value={newStock.LastDiv}
              onChange={(e) => setNewStock({ ...newStock, LastDiv: e.target.value })}
              required
            />
            <input
              placeholder="Branża (max 10 znaków)"
              maxLength={10}
              value={newStock.Industry}
              onChange={(e) => setNewStock({ ...newStock, Industry: e.target.value })}
              required
            />
            <input
              placeholder="Market Cap"
              type="number"
              value={newStock.MarketCap}
              onChange={(e) => setNewStock({ ...newStock, MarketCap: e.target.value })}
              required
            />
            <button type="submit">Dodaj spółkę</button>
          </form>

          <ul className="list">
            {stocks.map((s) => (
              <li key={s.Id}>
                <span>
                  <strong>{s.Symbol}</strong> — {s.CompanyName} — ${s.PurchasePrice}
                </span>
                <button onClick={() => handleAddToPortfolio(s.Symbol)}>+ Portfolio</button>
              </li>
            ))}
            {stocks.length === 0 && <p className="hint">Brak spółek — dodaj pierwszą powyżej.</p>}
          </ul>
        </section>

        <section>
          <h2>Moje portfolio</h2>

          <form className="inline-form" onSubmit={handleAddPortfolioBySymbol}>
            <input
              placeholder="Symbol (np. AAPL)"
              value={portfolioSymbol}
              onChange={(e) => setPortfolioSymbol(e.target.value)}
            />
            <button type="submit">Dodaj po symbolu</button>
          </form>

          <ul className="list">
            {portfolio.map((s) => (
              <li key={s.Id}>
                <span>
                  <strong>{s.Symbol}</strong> — {s.CompanyName}
                </span>
                <button onClick={() => handleRemoveFromPortfolio(s.Symbol)}>Usuń</button>
              </li>
            ))}
            {portfolio.length === 0 && <p className="hint">Portfolio jest puste.</p>}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
