import { fetchPost } from './service'

export async function getBrand () {
  return await fetchPost(`brand`, [
    'name',
    'logo',
    'tagline',
    'description',
    'img',
    'redline',
    'copyright'
  ])
}

export default getBrand
