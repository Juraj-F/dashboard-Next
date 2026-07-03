
const BASE_HEADERS = {
  "Content-Type": "application/json",
};

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      ...BASE_HEADERS,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export const get = (url) =>
  request(url);

export const post = (url, data) =>
  request(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const patch = (url, data) =>
  request(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const del = (url) =>
  request(url, {
    method: "DELETE",
  });