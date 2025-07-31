import { fetchPost } from './service'

export async function getListCity () {
  return await fetchPost(`city`, {"name": "vancouver"})
}

export default getListCity
