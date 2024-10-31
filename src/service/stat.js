import {apiURL, get} from "./util";

export async function getBookStat(timeBegin, timeEnd) {
  let res = await get(`${apiURL}/stat/book?timeBegin=${timeBegin}&timeEnd=${timeEnd}`),
    bookStatList = []
  res.forEach(item => {
    bookStatList.push({
      id: item.id,
      title: item.title,
      author: item.author,
      cover: item.cover,
      price: (item.price / 100).toFixed(2),
      sales: item.sales
    })
  })
  return bookStatList
}

export async function getUserStat(timeBegin, timeEnd) {
  let res = await get(`${apiURL}/stat/user?timeBegin=${timeBegin}&timeEnd=${timeEnd}`),
    userStatList = []
  res.forEach(item => {
    userStatList.push({
      username: item.username,
      consumption: (item.consumption / 100).toFixed(2)
    })
  })
  return userStatList
}

export async function getMineStat(timeBegin, timeEnd) {
  let res = await get(`${apiURL}/stat/mine?timeBegin=${timeBegin}&timeEnd=${timeEnd}`),
    list = []
  res.list.forEach(item => {
    list.push({
      id: item.id,
      title: item.title,
      author: item.author,
      cover: item.cover,
      price: (item.price / 100).toFixed(2),
      sales: item.sales
    })
  })
  return {
    totalSales: res.totalSales,
    totalConsumption: (res.totalConsumption / 100).toFixed(2),
    list
  }
}