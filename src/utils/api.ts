// Função auxiliar para fazer fetch com token automaticamente
export async function fetchComToken(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Se existem headers adicionais, merge com cuidado
  if (options.headers && typeof options.headers === 'object') {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

// Função para fazer GET com token
export async function getComToken(url: string) {
  const response = await fetchComToken(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// Função para fazer POST com token
export async function postComToken(url: string, data: any) {
  const response = await fetchComToken(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// Função para fazer PUT com token
export async function putComToken(url: string, data: any) {
  const response = await fetchComToken(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// Função para fazer DELETE com token
export async function deleteComToken(url: string) {
  const response = await fetchComToken(url, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

