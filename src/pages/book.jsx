import {useState, useEffect, useRef} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import MenuBar from '../components/menu-bar'
import '../css/book.css'
import {comment, getBookComments, getBookInfo} from '../service/book'
import {addIntoCart} from '../service/cart'
import qs from 'query-string'
import {errorHandle} from '../service/util'

let id

export default function BookPage(props) {
    const [cover, setCover] = useState(),
        [title, setTitle] = useState(),
        [author, setAuthor] = useState(),
        [category, setCategory] = useState(),
        [price, setPrice] = useState(),
        [state, setState] = useState({flag: false}),
        [intro, setIntro] = useState(),
        [sales, setSales] = useState(),
        [tags, setTags] = useState([]),
        [scoreValue, setScoreValue] = useState('5.0'),
        [scoreCount, setScoreCount] = useState(0),
        [starRate5, setStartRate5] = useState(1),
        [starRate4, setStartRate4] = useState(1),
        [starRate3, setStartRate3] = useState(1),
        [starRate2, setStartRate2] = useState(1),
        [starRate1, setStartRate1] = useState(1),
        [writeStar1, setWriteStar1] = useState(false),
        [writeStar2, setWriteStar2] = useState(false),
        [writeStar3, setWriteStar3] = useState(false),
        [writeStar4, setWriteStar4] = useState(false),
        [writeStar5, setWriteStar5] = useState(false),
        writeStarHover1 = () => {
            setWriteStar1(true)
            setWriteStar2(false)
            setWriteStar3(false)
            setWriteStar4(false)
            setWriteStar5(false)
        },
        writeStarHover2 = () => {
            setWriteStar1(true)
            setWriteStar2(true)
            setWriteStar3(false)
            setWriteStar4(false)
            setWriteStar5(false)
        },
        writeStarHover3 = () => {
            setWriteStar1(true)
            setWriteStar2(true)
            setWriteStar3(true)
            setWriteStar4(false)
            setWriteStar5(false)
        },
        writeStarHover4 = () => {
            setWriteStar1(true)
            setWriteStar2(true)
            setWriteStar3(true)
            setWriteStar4(true)
            setWriteStar5(false)
        },
        writeStarHover5 = () => {
            setWriteStar1(true)
            setWriteStar2(true)
            setWriteStar3(true)
            setWriteStar4(true)
            setWriteStar5(true)
        },
        [commentTotalCount, setCommentTotalCount] = useState(1),
        [currPage, setCurrPage] = useState(1),
        [totalPage, setTotalPage] = useState(1),
        commentList = useRef(null),
        loaction = useLocation(),
        navigate = useNavigate(),
        [showModal, setShowModal] = useState(false),
        commentInput = useRef(null),
        setCommentList = (list = [{
            username: '-',
            star: 5,
            time: 'yyyy-MM-dd HH:mm:ss',
            text: '-',
            like: 0,
            liked: false
        }]) => {
            let lis = commentList.current.children
            for (let li of lis)
                li.style.visibility = 'hidden'
            list.forEach((item, index) => {
                if (index < lis.length) {
                    let li = lis[index]
                    li.style.visibility = 'visible'
                    li.children[0].children[0].innerHTML = '@' + item.username
                    li.children[0].children[1].innerHTML = '★★★★★'.slice(0, item.star) + '☆☆☆☆☆'.slice(0, 5 - item.star)
                    li.children[1].innerHTML = item.text
                    li.children[2].children[0].innerHTML = item.time
                    li.children[2].children[1].innerHTML = item.liked ? '❤' : '♡'
                    li.children[2].children[2].innerHTML = item.like
                }
            })
        },
        setBookInfo = ({
                           title,
                           author,
                           category,
                           price,
                           state,
                           sales,
                           cover,
                           intro,
                           score,
                           commentTotalCount,
                           totalPage,
                           tags
                       }) => {
            setCover(cover)
            setTitle(title)
            setAuthor(author)
            setCategory(category)
            setPrice(price)
            setState(state)
            setSales(sales)
            setIntro(intro)
            setTags(tags)
            setScoreValue(score.value)
            setScoreCount(score.count)
            setStartRate5(score.rate5)
            setStartRate4(score.rate4)
            setStartRate3(score.rate3)
            setStartRate2(score.rate2)
            setStartRate1(score.rate1)
            setCommentTotalCount(commentTotalCount)
            setCurrPage(1)
            setTotalPage(totalPage)
        },
        onAddIntoCart = () => {
            addIntoCart(id).then(() => {
                alert('已成功加入购物车！')
                navigate('/cart')
            }).catch(err => errorHandle(err, navigate))
        },
        onLastPage = () => {
            if (currPage <= 1) return
            setCurrPage(currPage - 1)
            getBookComments(id, currPage - 2, 10, 'createdTime')
                .then(res => {
                    setCommentTotalCount(res.totalNumber)
                    setTotalPage(res.totalPage)
                    setCurrPage(currPage - 1)
                    setCommentList(res.list)
                }).catch(err => errorHandle(err, navigate))
        },
        onNextPage = () => {
            if (currPage >= totalPage) return
            setCurrPage(currPage + 1)
            getBookComments(id, currPage, 10, 'createdTime')
                .then(res => {
                    setCommentTotalCount(res.totalNumber)
                    setTotalPage(res.totalPage)
                    setCurrPage(currPage + 1)
                    setCommentList(res.list)
                }).catch(err => errorHandle(err, navigate))
        },
        onCommentSubmit = () => {
            let connent = commentInput.current.value
            if (connent === '') {
                commentInput.current.focus()
                return
            }
            comment(id, connent).then(() => {
                alert('评论成功！')
                getBookComments(id, 0, 10, 'createdTime')
                    .then(res => {
                        setCommentTotalCount(res.totalNumber)
                        setTotalPage(res.totalPage)
                        setCurrPage(1)
                        setCommentList(res.list)
                    }).catch(err => errorHandle(err, navigate))
            }).catch(err => errorHandle(err, navigate))
            setShowModal(false)
        }

    useEffect(() => {
        id = qs.parse(loaction.search).id
        getBookInfo(id).then(res => {
            setBookInfo({
                ...res,
                category: '畅销书籍',
                state: {flag: true, count: res.repertory},
                score: {value: '5.0', count: res.sales, rate5: 1, rate4: 0, rate3: 0, rate2: 0, rate1: 0},
                commentTotalCount: 1000,
                totalPage: 100,
                tags: res.tags
            })
            getBookComments(id, 0, 10, 'createdTime')
                .then(res => {
                    setCommentTotalCount(res.totalNumber)
                    setTotalPage(res.totalPage)
                    setCurrPage(1)
                    setCommentList(res.list)
                }).catch(err => errorHandle(err, navigate))
        }).catch(err => errorHandle(err, navigate))
    }, [])

    return (
        <div>
            <MenuBar index={-1}/>
            <div id='BookInfo'>
                <img id='BookInfo-cover' src={cover} alt='book'/>
                <div id='BookInfo-flex'>
                    <h1 id='BookInfo-title'>{title}</h1>
                    <h2 id='BookInfo-author'>作者：{author}</h2>
                    <h3 id='BookInfo-category'>分类：{category}</h3>
                    <h3 id='BookInfo-price'>定价：<font color='#00ff4c'>¥{price}</font></h3>
                    <h3 id='BookInfo-state'>状态：
                        <font color={state.flag ? '#00ff4c' : 'red'}>
                            {state.flag ? '有货 库存' + state.count + '件' : '无货'}
                        </font>
                    </h3>
                    <div id='BookInfo-tag'>标签：
                        {tags.map((tag, index) => (
                            <span key={index} className='BookInfo-tag-word'>{tag}</span>
                        ))}
                    </div>
                    <h3 id='BookInfo-sales'>销量：{sales}</h3>
                    <p id='BookInfo-intro'>简介：{intro}</p>
                </div>
            </div>

            <div id='Book-operation-score'>
                <div id='BookOperation'>
                    <div className='BookOperation-flex'>
                        <button id='BookOperation-buy' className='BookOperation-button'
                                onClick={() => alert('暂仅支持加入购物车后购买')}>¥ 立即购买
                        </button>
                        <button id='BookOperation-cart' className='BookOperation-button' onClick={onAddIntoCart}>🛒
                            加入购物车
                        </button>
                        <button id='BookOperation-collect' className='BookOperation-button'
                                onClick={() => alert('暂不支持收藏功能')}>❤ 收藏
                        </button>
                    </div>
                    <div className='BookOperation-flex'>
                        <button id='BookOperation-writeComment' className='BookOperation-button'
                                onClick={() => setShowModal(true)}>
                            <span id='BookOperation-writeComment-label'>📝 写评论</span>
                            <div id='BookOperation-writeStar'>
                                <span className='BookOperation-writeStar'
                                      onMouseOver={writeStarHover1}>{writeStar1 ? '★' : '☆'}</span>
                                <span className='BookOperation-writeStar'
                                      onMouseOver={writeStarHover2}>{writeStar2 ? '★' : '☆'}</span>
                                <span className='BookOperation-writeStar'
                                      onMouseOver={writeStarHover3}>{writeStar3 ? '★' : '☆'}</span>
                                <span className='BookOperation-writeStar'
                                      onMouseOver={writeStarHover4}>{writeStar4 ? '★' : '☆'}</span>
                                <span className='BookOperation-writeStar'
                                      onMouseOver={writeStarHover5}>{writeStar5 ? '★' : '☆'}</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div id='BookScore'>
                    <div id='BookScore-flex'>
                        <div id='BookScore-value'>{scoreValue}</div>
                        <div id='BookScore-count'>{scoreCount}人评分</div>
                    </div>
                    <div id='BookScore-star'>
                        <div className='BookScore-star-flex'>
                            <span className='BookScore-star-label'>★★★★★</span>
                            <span className='BookScore-star-bar' style={{width: (starRate5 * 200) + 'px'}}/>
                        </div>
                        <div className='BookScore-star-flex'>
                            <span className='BookScore-star-label'>★★★★</span>
                            <span className='BookScore-star-bar' style={{width: (starRate4 * 200) + 'px'}}/>
                        </div>
                        <div className='BookScore-star-flex'>
                            <span className='BookScore-star-label'>★★★</span>
                            <span className='BookScore-star-bar' style={{width: (starRate3 * 200) + 'px'}}/>
                        </div>
                        <div className='BookScore-star-flex'>
                            <span className='BookScore-star-label'>★★</span>
                            <span className='BookScore-star-bar' style={{width: (starRate2 * 200) + 'px'}}/>
                        </div>
                        <div className='BookScore-star-flex'>
                            <span className='BookScore-star-label'>★</span>
                            <span className='BookScore-star-bar' style={{width: (starRate1 * 200) + 'px'}}/>
                        </div>
                    </div>
                </div>
            </div>

            <div id='BookComment'>
                <h1 id='BookComment-title'>商品评价，共{commentTotalCount}条</h1>
                <div className='BookComment-line'/>
                <ul ref={commentList} id='BookComment-ul'>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) =>
                            <li key={index} className='BookComment-li'>
                                <div className='BookComment-flex1'>
                                    <div className='BookComment-username'>@</div>
                                    <div className='BookComment-star'>★★★★★</div>
                                </div>
                                <p className='BookComment-text'>-</p>
                                <div className='BookComment-flex2'>
                                    <div className='BookComment-time'>yyyy-MM-dd HH:mm:ss</div>
                                    <div className='BookComment-like'>♡</div>
                                    <div className='BookComment-like-count'>-</div>
                                    <button className='BookComment-reply'>回复</button>
                                </div>
                                <div className='BookComment-line'/>
                            </li>
                        )
                    }
                </ul>

                <div id='BookComment-pageShift'>
                    <button className='BookComment-pageShift-button' onClick={onLastPage}>上一页</button>
                    <span id='BookComment-pageShift-text'>第 {currPage} 页 / 共 {totalPage} 页</span>
                    <button className='BookComment-pageShift-button' onClick={onNextPage}>下一页</button>
                </div>
            </div>

            {
                showModal &&
                <div id='BookComment-modal' onClick={() => setShowModal(false)}>
                    <div id='BookComment-modal-content' onClick={e => e.stopPropagation()}>
                        <textarea ref={commentInput} id='BookComment-modal-input' placeholder='发布一条评论'/>
                        <div id='BookComment-modal-operation'>
                            <button id='BookComment-modal-submit' onClick={onCommentSubmit}>发布</button>
                            <button id='BookComment-modal-cancle' onClick={() => setShowModal(false)}>取消</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}