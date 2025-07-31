import { fetchPost } from './service'

export async function getListNeighborhood (id) {
  return await fetchPost(`city/neighborhood`, {
    id: id,
    fileds: ['bikeStation']
  })
}

export default getListNeighborhood
