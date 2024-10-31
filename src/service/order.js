import { apiURL, post, get } from './util';

export async function getOrder(keyword) {
  let res = await get(`${apiURL}/order?keyword=${keyword}`),
    orderList = []
  res.forEach(item => {
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
      receiver: item.receiver,
      tel: item.tel,
      address: item.address,
      time: time,
      number: item.number
    })
  })
  return orderList
}

export async function placeOrder(receiver, tel, address, itemIds) {
  let res = await post(`${apiURL}/order`, { receiver, tel, address, itemIds })
  if (res.ok) return res
  else throw res.message
}