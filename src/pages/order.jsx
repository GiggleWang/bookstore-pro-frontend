import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuBar from '../components/menu-bar'
import '../css/order.css'
import { getOrder } from '../service/order'
import { errorHandle } from '../service/util'
import SearchBar from '../components/search-bar'

let order = []

// 新增的计算总价的 API 调用
const calculateTotalPrice = async (price, quantity) => {
    try {
        const response = await fetch(`http://localhost:8003/calculate/order?price=${price}&quantity=${quantity}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('网络响应错误');
        }

        const data = await response.json();
        return data; // 返回计算后的总价
    } catch (error) {
        console.error('计算总价时发生错误:', error);
        return 0; // 返回0或其他合适的默认值
    }
}
export default function OrderPage() {
    const [currPage, setCurrPage] = useState(1),
        [totalPage, setTotalPage] = useState(1),
        [orderTotalCount, setOrderTotalCount] = useState(1),
        [keyword, setKeyword] = useState(''),
        orderList = useRef(null),
        navigate = useNavigate(),
        setOrderList = async (list = [{
            cover: '-',
            title: '-',
            author: '-',
            price: '',
            receiver: '-',
            tel: '-',
            address: '-',
            time: '-',
            number: '-',
            totalPrice: '¥0', // 初始化总价
        }]) => {
            let lis = orderList.current.children
            for (let li of lis) li.style.visibility = 'hidden'
            for (const item of list) {
                const index = list.indexOf(item);
                if (index < lis.length) {
                    let li = lis[index],
                        info = li.children[0].children,
                        info1 = info[1].children,
                        info2 = info[2].children,
                        info3 = info[3].children;

                    li.style.visibility = 'visible';
                    info[0].src = item.cover;
                    info1[0].innerHTML = item.title;
                    info1[1].innerHTML = item.author;
                    info1[2].innerHTML = '¥' + item.price;
                    info2[0].innerHTML = item.receiver;
                    info2[1].innerHTML = '☏' + item.tel;
                    info2[2].innerHTML = item.address;
                    info3[0].innerHTML = item.time;
                    info3[1].innerHTML = '共' + item.number + '件';

                    // 调用计算总价的函数
                    const totalPrice = await calculateTotalPrice(item.price, item.number);
                    info3[2].innerHTML = '¥' + totalPrice;
                }
            }
        },
        onLastPage = () => {
            if (currPage <= 1) return
            setCurrPage(currPage - 1)
            setOrderList(order.slice((currPage - 2) * 10, (currPage - 1) * 10))
        },
        onNextPage = () => {
            if (currPage >= totalPage) return
            setCurrPage(currPage + 1)
            setOrderList(order.slice(currPage * 10, (currPage + 1) * 10))
        },
        onBookInfo = index => {
            let item = order[(currPage - 1) * 10 + index]
            navigate(`/book?id=${item.id}`)
        },
        onSearch = e => {
            setKeyword(e.target.value)
            getOrder(e.target.value).then(list => {
                order = list
                setOrderTotalCount(list.length)
                setTotalPage(Math.ceil(list.length / 10))
                setOrderList(list.slice(0, 10))
            }).catch(err => errorHandle(err, navigate))
        }

    useEffect(() => {
        getOrder('').then(list => {
            order = list
            setOrderTotalCount(list.length)
            setTotalPage(Math.ceil(list.length / 10))
            setOrderList(list.slice(0, 10))
        }).catch(err => errorHandle(err, navigate))
    }, [])

    return (
        <div>
            <MenuBar index={1}/>
            <SearchBar placeholder='请输入订单信息、下单时间、书籍信息等关键词搜索相关订单' keyword={keyword}
                       onChange={onSearch}/>
            <div id='Order'>
                <h1 id='Order-title'>全部订单，共{orderTotalCount}条</h1>
                <div className='Order-line'/>
                <ul ref={orderList} id='Order-ul'>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) =>
                            <li key={index} className='Order-li' onClick={() => onBookInfo(index)}>
                                <div className='Order-info'>
                                    <img className='Order-cover' src='' alt='book-image'/>
                                    <div className='Order-li-flex1'>
                                        <span className='Order-title'>-</span>
                                        <span className='Order-author'>-</span>
                                        <div className='Order-price'>¥</div>
                                    </div>
                                    <div className='Order-li-flex2'>
                                        <div className='Order-receiver'>-</div>
                                        <div className='Order-tel'>☏1</div>
                                        <div className='Order-address'>-</div>
                                    </div>
                                    <div className='Order-li-flex3'>
                                        <div className='Order-datetime'>yyyy-MM-dd HH:mm:ss</div>
                                        <div className='Order-number'>共 件</div>
                                        <div className='Order-total-price'>¥</div>
                                    </div>
                                    <button
                                        className='Order-remove'
                                        onClick={
                                            e => {
                                                e.stopPropagation()
                                                alert("暂不支持删除订单记录!")
                                            }
                                        }
                                    >删除记录
                                    </button>
                                </div>
                                <div className='Order-line'/>
                            </li>
                        )
                    }
                </ul>

                <div id='Order-pageShift-select'>
                    <div id='Order-pageShift'>
                        <button className='Order-pageShift-button' onClick={onLastPage}>上一页</button>
                        <span id='Order-pageShift-text'>第 {currPage} 页 / 共 {totalPage} 页</span>
                        <button className='Order-pageShift-button' onClick={onNextPage}>下一页</button>
                    </div>
                </div>
            </div>
        </div>
    )
}