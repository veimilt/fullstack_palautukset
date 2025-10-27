import axios from 'axios'

const baseURL = 'http://localhost:3001/api/persons';

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseURL, newObject)
    return request.then(response => response.data)
}

const deletePerson = id => {
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(response => response.data)
}

const update = (currentObject, updatedObject) => {
    const request = axios.put(`${baseURL}/${currentObject.id}`, updatedObject)
    return request.then(response => response.data)
}

export default { getAll, create, deletePerson, update }