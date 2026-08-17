const API_BASE_URL = "http://localhost:5110/api";

export type NewUserDto = {
  Username: string;
  Email: string;
  Token: string;
};

export type CommentDto = {
  Id: number;
  Title: string;
  Content: string;
  CreatedAt: string;
  CreatedBy: string;
  StockId: number | null;
};

export type StockDto = {
  Id: number;
  Symbol: string;
  CompanyName: string;
  PurchasePrice: number;
  LastDiv: number;
  Industry: string;
  MarketCap: number;
  Comments: CommentDto[] | null;
};

export type CreateStockRequest = {
  Symbol: string;
  CompanyName: string;
  PurchasePrice: number;
  LastDiv: number;
  Industry: string;
  MarketCap: number;
};

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();

    if (typeof body === "string") return body;

    if (Array.isArray(body)) {
      return body.map((e) => e.description ?? e.Description ?? JSON.stringify(e)).join(", ");
    }

    if (body?.errors) {
      return Object.values(body.errors as Record<string, string[]>).flat().join(", ");
    }

    return JSON.stringify(body);
  } catch {
    return res.statusText || `Request failed with status ${res.status}`;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export function registerUser(username: string, email: string, password: string) {
  return request<NewUserDto>("/account/register", {
    method: "POST",
    body: JSON.stringify({ Username: username, Email: email, Password: password }),
  });
}

export function loginUser(username: string, password: string) {
  return request<NewUserDto>("/account/login", {
    method: "POST",
    body: JSON.stringify({ Username: username, Password: password }),
  });
}

export function getStocks(token: string) {
  return request<StockDto[]>("/stock", { method: "GET" }, token);
}

export function createStock(token: string, stock: CreateStockRequest) {
  return request<StockDto>("/stock", { method: "POST", body: JSON.stringify(stock) }, token);
}

export function getPortfolio(token: string) {
  return request<StockDto[]>("/portfolio", { method: "GET" }, token);
}

export function addToPortfolio(token: string, symbol: string) {
  return request<void>(`/portfolio?symbol=${encodeURIComponent(symbol)}`, { method: "POST" }, token);
}

export function removeFromPortfolio(token: string, symbol: string) {
  return request<void>(`/portfolio?symbol=${encodeURIComponent(symbol)}`, { method: "DELETE" }, token);
}
