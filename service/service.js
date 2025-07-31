const URL = 'http://localhost:3000/api' // Corrigido o URL

export async function fetchGet (path) {
  try {
    const response = await fetch(`${URL}/${path}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error
  }
}

export async function fetchPost (path, data) {
  try {
    const response = await fetch(`${URL}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error
  }
}