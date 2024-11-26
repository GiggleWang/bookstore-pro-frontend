import {apiURL, post, get} from "./util"

export async function searchBooks(keyword, pageIndex, pageSize, tag = '') {
    const encodedTag = encodeURIComponent(tag); // 对标签进行 URL 编码
    // console.log("tag",tag);
    const requestURL = `${apiURL}/books?keyword=${keyword}&pageIndex=${pageIndex}&pageSize=${pageSize}&tag=${encodedTag}`;
    // 打印出发送的 URL
    // console.log('Sending request to:', requestURL);
    let res = await get(requestURL); // 发起请求
    let bookList = []
    res.items.forEach((item, index) => {
        bookList.push({
            id: item.id,
            title: item.title,
            author: item.author,
            price: (item.price / 100).toFixed(2),
            cover: item.cover,
            isbn: item.isbn,
            sales: item.sales,
            repertory: item.repertory,
            description: item.description,
            tags: item.tags || [],
            index: index
        })
    })
    return {
        totalNumber: res.totalNumber,
        totalPage: res.totalPage,
        list: bookList
    }
}

export async function getBooks(pageIndex, pageSize) {
    const books = await searchBooks('', pageIndex, pageSize);
    // console.log(books); // 输出获取到的书籍数据
    return books;
}

export async function getBookInfo(id) {
    let res = await get(`${apiURL}/book/${id}`)
    // console.log(res)
    return {
        id: res.id,
        title: res.title,
        author: res.author,
        price: (res.price / 100).toFixed(2),
        intro: res.description,
        cover: res.cover,
        isbn: res.isbn,
        sales: res.sales,
        repertory: res.repertory,
        tags: res.tags || [] // 提取 tags 数据
    }
}

export async function getBookComments(id, pageIndex, pageSize, sort) {
    let res = await get(`${apiURL}/book/${id}/comments?pageIndex=${pageIndex}&pageSize=${pageSize}&sort=${sort}`),
        commentList = []
    res.items.forEach(item => {
        let datetime = new Date(item.createdAt),
            y = datetime.getFullYear(),
            m = datetime.getMonth() + 1,
            d = datetime.getDate(),
            time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + datetime.toTimeString().substr(0, 8);
        commentList.push({
            id: item.id,
            username: item.username,
            text: item.content,
            time: time,
            like: item.like,
            liked: item.liked
        })
    })
    return {
        totalNumber: res.totalNumber,
        totalPage: res.totalPage,
        list: commentList
    }
}

export async function comment(id, content) {
    let res = await post(`${apiURL}/book/${id}/comments`, {content})
    if (!res.ok) throw res.message
}