const backend = 'http://localhost:3000';

export async function getDashboardData() {
  const token = localStorage.getItem("token"); 

  const response = await fetch(`${backend}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}