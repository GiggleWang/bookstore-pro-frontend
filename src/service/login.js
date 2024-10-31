import { apiURL, post } from './util';
import { setMode } from '../components/menu-bar';

export async function login(username, password) {
  let res = await post(`${apiURL}/login`, { username, password })
  if (res.ok) setMode(res.data.admin ? 'admin' : 'user')
  else throw res.message
}

export async function signup(username, email, password) {
  let res = await post(`${apiURL}/register`, { username, email, password })
  if (!res.ok) throw res.message
}

export async function logout() {
  let res = await post(`${apiURL}/logout`)
  if (!res.ok) throw res.message
  return res.data.time;
}