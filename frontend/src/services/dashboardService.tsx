 // Adjust the import path as needed

export async function getDashboardData() {
  const response = await fetch("http://localhost:3000/dashboard") // GET, sem body

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  return response.json()
}
