const backend = import.meta.env.VITE_BACKEND_URL;

export async function uploadLogo(file: File) {
  const formData = new FormData()
  formData.append("logo", file)

  const response = await fetch(`${backend}/upload-logo`, {
    method: "POST",
    body: formData
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }


  return response.json()
}
