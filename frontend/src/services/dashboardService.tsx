 // Adjust the import path as needed

 const backend = import.meta.env.VITE_BACKEND_URL;

export async function getDashboardData() {
  const response = await fetch(`${backend}/dashboard`) // GET, sem body

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  return response.json()
}
