import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const data = (request) => request.then(response => response.data)

const getAll = () => {
  const request = axios.get(baseUrl)
  return data(request)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return data(request)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return data(request)
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return data(request)
}

export default { getAll, create, update, remove }