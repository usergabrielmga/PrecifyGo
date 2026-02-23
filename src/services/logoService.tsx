export async function uploadLogo(file: File) {
  const formData = new FormData()
  formData.append("logo", file)

  const response = await fetch("http://localhost:3000/upload-logo", {
    method: "POST",
    body: formData
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }


  return response.json()
}
