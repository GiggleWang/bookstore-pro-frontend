import {useState, useRef, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Checkbox} from "antd"
import MenuBar from '../components/menu-bar'
import {getCart, removeFromCart, setCartItemNumber} from '../service/cart'
import {placeOrder} from '../service/order'
import '../css/cart.css'
import {errorHandle} from '../service/util'

let cart = [], itemIds = [], isSingleBuy, itemId = []

export default function CartPage(props) {
    const [currPage, setCurrPage] = useState(1),
        [totalPage, setTotalPage] = useState(1),
        [cartTotalCount, setCartTotalCount] = useState(1),
        [showModal, setShowModal] = useState(false),
        [checked, setChecked] = useState([false, false, false, false, false, false, false, false, false, false]),
        cartList = useRef(null),
        receiverInput = useRef(null),
        telInput = useRef(null),
        addressInput = useRef(null),
        navigate = useNavigate(),
        {ws, setWs} = props,
        setCartList = (list = [{cover: '', title: '-', author: '-', price: '', number: 1}]) => {
            let lis = cartList.current.children
            for (let li of lis) li.style.visibility = 'hidden'
            list.forEach((item, index) => {
                if (index < lis.length) {
                    let li = lis[index],
                        info = li.children[0].children,
                        info1 = info[1].children
                    li.style.visibility = 'visible'
                    info[0].src = item.cover
                    info1[0].innerHTML = item.title
                    info1[1].innerHTML = item.author
                    info1[2].innerHTML = '¥' + item.price
                    info[2].children[1].innerHTML = item.number
                }
            })
        },
        onNumberAdd = idx => {
            let book = cart[(currPage - 1) * 10 + idx],
                number = cartList.current.children[idx].children[0].children[2].children[1],
                numberVal = parseInt(number.innerHTML)
            setCartItemNumber(book.itemId, numberVal + 1).then(() => {
                number.innerHTML = numberVal + 1
            }).catch(err => errorHandle(err, navigate))
        },
        onNumberDec = idx => {
            let book = cart[(currPage - 1) * 10 + idx],
                number = cartList.current.children[idx].children[0].children[2].children[1],
                numberVal = parseInt(number.innerHTML)
            if (numberVal === 1) return
            setCartItemNumber(book.itemId, numberVal - 1).then(() => {
                number.innerHTML = numberVal - 1
            }).catch(err => errorHandle(err, navigate))
        },
        onLastPage = () => {
            if (currPage <= 1) return
            setCurrPage(currPage - 1)
            setCartList(cart.slice((currPage - 2) * 10, (currPage - 1) * 10))
        },
        onNextPage = () => {
            if (currPage >= totalPage) return
            setCurrPage(currPage + 1)
            setCartList(cart.slice(currPage * 10, (currPage + 1) * 10))
        },
        onSingleBuy = idx => {
            let book = cart[(currPage - 1) * 10 + idx]
            isSingleBuy = true
            itemId = [book.itemId]
            setShowModal(true)
        },
        onSingleRemove = idx => {
            let book = cart[(currPage - 1) * 10 + idx]
            removeFromCart(book.itemId).then(() => {
                getCart().then(list => {
                    cart = list
                    setCartTotalCount(cart.length)
                    setTotalPage(Math.ceil(cart.length / 10))
                    setCartList(cart.slice(0, 10))
                })
            }).catch(err => errorHandle(err, navigate))
        },
        onBuy = () => {
            isSingleBuy = false
            setShowModal(true)
        },
        onRemove = () => {
            alert('暂仅支持点击购物车右侧按钮移出购物车')
        },
        onReceiverInputKeyUp = e => {
            if (e.key === 'Enter' && receiverInput.current.value !== '')
                telInput.current.focus()
        },
        onTelInputKeyUp = e => {
            if (e.key === 'Enter' && telInput.current.value !== '')
                addressInput.current.focus()
        },
        onAddressInputKeyUp = e => {
            if (e.key === 'Enter' && addressInput.current.value !== '')
                onPlaceOrder()
        },
        onPlaceOrder = () => {
            let receiver = receiverInput.current.value,
                tel = telInput.current.value,
                address = addressInput.current.value
            if (receiver === '') {
                receiverInput.current.focus()
                return
            } else if (tel === '') {
                telInput.current.focus()
                return
            } else if (address === '') {
                addressInput.current.focus()
                return
            }
            placeOrder(receiver, tel, address, isSingleBuy ? itemId : itemIds)
                .then(res => {
                    setShowModal(false)
                    itemIds = []

                    if (!res.ws) {
                        alert('下单成功')
                        navigate('/order')
                        return
                    }

                    let socket = new WebSocket(`ws://localhost:8000/placeOrder/${res.id}`)
                    socket.onopen = () => {
                        console.log('websocket open')
                    }
                    socket.onclose = () => {
                        console.log('websocket close')
                    }
                    socket.onmessage = e => {
                        console.log('websocket receive message: ', e.data)
                        let res = JSON.parse(e.data)
                        socket.close()
                        if (res.ok) {
                            alert('下单成功')
                            navigate('/order')
                        } else alert('下单失败')
                    }
                    setWs(socket)
                    alert('订单处理中')
                }).catch(err => errorHandle(err, navigate))
        },
        onBookInfo = idx => {
            let book = cart[(currPage - 1) * 10 + idx]
            navigate(`/book?id=${book.id}`)
        },
        onCheck = (flag, idx) => {
            if (flag) itemIds.push(cart[(currPage - 1) * 10 + idx].itemId)
            else itemIds = itemIds.filter(id => id !== cart[(currPage - 1) * 10 + idx].itemId)
            let newChecked = checked
            newChecked[idx] = flag
            setChecked(newChecked)
        }

    useEffect(() => {
        itemIds = []
        getCart().then(list => {
            cart = list
            setCartTotalCount(cart.length)
            setTotalPage(Math.ceil(cart.length / 10))
            setCartList(cart.slice(0, 10))
        }).catch(err => errorHandle(err, navigate))
    }, [])

    return (
        <div>
            <MenuBar index={5}/>
            <div id='Cart'>
                <h1 id='Cart-title'>购物车，共{cartTotalCount}条</h1>
                <div className='Cart-line'/>
                <ul ref={cartList} id='Cart-ul'>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) =>
                            <li key={index} className='Cart-li' onClick={() => onBookInfo(index)}>
                                <div className='Cart-bookInfo'>
                                    <img className='Cart-cover' src='' alt='book-image'/>
                                    <div className='Cart-li-flex'>
                                        <span className='Cart-title'>-</span>
                                        <span className='Cart-author'>-</span>
                                        <div className='Cart-price'>¥</div>
                                    </div>
                                    <div className='Cart-count'>
                                        <button
                                            className='Cart-count-button'
                                            onClick={
                                                e => {
                                                    e.stopPropagation()
                                                    onNumberDec(index)
                                                }
                                            }
                                        >-
                                        </button>
                                        <div className='Cart-count-value'>1</div>
                                        <button
                                            className='Cart-count-button'
                                            onClick={
                                                e => {
                                                    e.stopPropagation()
                                                    onNumberAdd(index)
                                                }
                                            }
                                        >+
                                        </button>
                                    </div>
                                    <button
                                        className='Cart-buynow'
                                        onClick={
                                            e => {
                                                e.stopPropagation()
                                                onSingleBuy(index)
                                            }
                                        }
                                    >购买
                                    </button>
                                    <button
                                        className='Cart-remove'
                                        onClick={
                                            e => {
                                                e.stopPropagation()
                                                onSingleRemove(index)
                                            }
                                        }
                                    >移除
                                    </button>
                                    <Checkbox defaultChecked={checked[index]}
                                              onClick={
                                                  e => {
                                                      e.stopPropagation()
                                                      onCheck(e.target.checked, index)
                                                  }
                                              }
                                    />
                                </div>
                                <div className='Cart-line'/>
                            </li>
                        )
                    }
                </ul>

                <div id='Cart-pageShift-select'>
                    <Checkbox onClick={e => {
                        alert("暂仅支持通过购物车右侧选择框选择")
                        e.target.checked = false
                    }}> <font color='white' fontSize='15px'>全部全选</font></Checkbox>
                    <div id='Cart-pageShift'>
                        <button className='Cart-pageShift-button' onClick={onLastPage}>上一页</button>
                        <span id='Cart-pageShift-text'>第 {currPage} 页 / 共 {totalPage} 页</span>
                        <button className='Cart-pageShift-button' onClick={onNextPage}>下一页</button>
                    </div>
                    <Checkbox onClick={e => {
                        alert("暂仅支持通过购物车右侧选择框选择")
                        e.target.checked = false
                    }}> <font color='white' fontSize='15px'>本页全选</font></Checkbox>
                </div>
            </div>

            <div id='Cart-operation'>
                <button id='Cart-remove' onClick={onRemove}>移除</button>
                <button id='Cart-buy' onClick={onBuy}>购买</button>
            </div>
            {
                showModal &&
                <div id='Cart-modal' onClick={() => setShowModal(false)}>
                    <div id='Cart-modal-content' onClick={e => e.stopPropagation()}>
                        <div className='Cart-modal-label'>收货人姓名</div>
                        <input ref={receiverInput} className='Cart-modal-input' onKeyUp={onReceiverInputKeyUp}/>
                        <div className='Cart-modal-label'>收货人电话</div>
                        <input ref={telInput} className='Cart-modal-input' onKeyUp={onTelInputKeyUp}/>
                        <div className='Cart-modal-label'>收货地址</div>
                        <input ref={addressInput} className='Cart-modal-input' onKeyUp={onAddressInputKeyUp}/>
                        <div id='Cart-modal-operation'>
                            <button id='Cart-modal-submit' onClick={onPlaceOrder}>下单</button>
                            <button id='Cart-modal-cancle' onClick={() => setShowModal(false)}>取消</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}