import { apiURL, post, get, put, del } from "./util"

export async function searchUsers(keyword, pageIndex, pageSize) {
  let res = await get(`${apiURL}/manage/users?keyword=${keyword}&pageIndex=${pageIndex}&pageSize=${pageSize}`),
    userList = []
  res.items.forEach(item => {
    userList.push({
      id: item.id,
      username: item.username,
      nickname: item.nickname,
      email: item.email,
      silence: item.silence
    })
  })
  return {
    totalNumber: res.totalNumber,
    totalPage: res.totalPage,
    list: userList
  }
}

export async function getUsers(pageIndex, pageSize) {
  return await searchUsers('', pageIndex, pageSize)
}

export async function searchOrders(keyword, pageIndex, pageSize) {
  let res = await get(`${apiURL}/manage/orders?keyword=${keyword}&pageIndex=${pageIndex}&pageSize=${pageSize}`),
    orderList = []
  res.items.forEach(item => {
    let datetime = new Date(item.createdAt),
      y = datetime.getFullYear(),
      m = datetime.getMonth() + 1,
      d = datetime.getDate(),
      time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + datetime.toTimeString().substr(0, 8);
    orderList.push({
      id: item.book.id,
      cover: item.book.cover,
      title: item.book.title,
      author: item.book.author,
      price: (item.book.price / 100).toFixed(2),
      username: item.username,
      receiver: item.receiver,
      tel: item.tel,
      address: item.address,
      time: time,
      number: item.number
    })
  })
  return {
    totalNumber: res.totalNumber,
    totalPage: res.totalPage,
    list: orderList
  }
}

export async function getOrders(pageIndex, pageSize) {
  return await searchOrders('', pageIndex, pageSize)
}

export async function setBook(id, title, author, isbn, cover, price, sales, repertory, description) {
  let res = await post(`${apiURL}/manage/book/${id}`, { title, author, isbn, cover, price, sales, repertory, description })
  if (!res.ok) throw res.message
}

export async function setUser(id, username, email) {
  let res = await post(`${apiURL}/manage/user/${id}`, { username, email })
  console.log(res)
  if (!res.ok) throw res.message
}

export async function addBook(title, author, isbn, cover, price, sales, repertory, description) {
  let res = await put(`${apiURL}/manage/book`, { title, author, isbn, cover, price, sales, repertory, description })
  if (!res.ok) throw res.message
}

export async function delBook(id) {
  let res = await del(`${apiURL}/manage/book/${id}`)
  if (!res.ok) throw res.message
}

export async function silenceUser(id) {
  let res = await post(`${apiURL}/manage/user/${id}/silence`)
  if (!res.ok) throw res.message
}

export async function unsilenceUser(id) {
  let res = await post(`${apiURL}/manage/user/${id}/unsilence`)
  if (!res.ok) throw res.message
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  let res = await fetch(`${apiURL}/upload/image`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  if (!res.ok) throw res.message
  let json = await res.json()
  if (!json.ok) throw res.message
  return json.data.url
}