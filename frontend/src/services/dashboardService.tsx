const backend = 'http://localhost:3000';

export function getDashboardCache() {
  try {
    const cache = localStorage.getItem("dashboard_cache");

    if (!cache) return null;

    const parsed = JSON.parse(cache);

    return parsed.data;
  } catch {
    localStorage.removeItem("dashboard_cache");
    return null;
  }
}

export async function getDashboardData() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${backend}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  localStorage.setItem(
    "dashboard_cache",
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );

  return data;
}