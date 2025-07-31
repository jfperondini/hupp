import { fetchPost } from './service'

export async function getListImg (img) {
  const ids = Array.isArray(img) ? img : [img]
  return await fetchPost('image', { id: ids })
}

export default getListImg
