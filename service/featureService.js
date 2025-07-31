import { fetchGet } from './service'

export async function getListFeature () {
  return await fetchGet(`feature`)
}

export default getListFeature
