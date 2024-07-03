import axios from "axios";
import { contact } from "../util";

const API_URL = 'http://localhost:8080/contacts'

export async function saveContact(contact: contact) {
    return await axios.post(API_URL, contact)
}

// request parameter
export async function getContacts(page = 0 , size = 10) {
    return await axios.get(`${API_URL}?page=${page}&size=${size}`)
}

// path parameter
export async function getContact(id: string) {
    return await axios.get(`${API_URL}/${id}`)
}

export async function updateContact(contact: contact) {
    return await axios.post(API_URL, contact)
}

export async function updatePhoto(formData: FormData) {
    return await axios.put(`${API_URL}/photo`, formData)
}
export async function deleteContact(id: string) {
    return await axios.delete(`${API_URL}/${id}`)
}


