export const apiURL = 'http://localhost:8001/api'

export async function get(url) {
  let res = await fetch(url, {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) throw res.status
  return res.json();
}

export async function post(url, data) {
  let res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  })
  return res.json();
}

export async function put(url, data) {
  let res = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  })
  return res.json();
}

export async function del(url, data) {
  let res = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  })
  return res.json();
}

export function errorHandle(err, navigate) {
  if (err === 400 || err === 401) {
    alert('登录已失效，请重新登录！')
    navigate('/login')
  } else alert(err)
}