import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuBar from '../components/menu-bar'
import SearchBar from '../components/search-bar'
import '../css/home.css'
import { getBooks, searchBooks } from '../service/book'
import { errorHandle } from '../service/util'
import AuthorModal from "../components/author_modal"
import { Button } from 'antd'

export default function HomePage() {
    const categoryList = [
        { text: '推荐' }, { text: '热门' }, { text: '文学' }, { text: '娱乐' }, { text: '专业' }, { text: '教育' }, { text: '科普' }
    ]

    const category = useRef(null),
        [isModalOpen, setIsModalOpen] = useState(false),
        [currPage, setCurrPage] = useState(1),
        [totalPage, setTotalPage] = useState(1),
        [keyword, setKeyword] = useState(''),
        navigate = useNavigate(),
        bookList = useRef(null),
        setBookList = (list = [{ title: '-', author: '-', price: '-', cover: '', index: '' }]) => {
            let lines = bookList.current.children,
                lineCount = lines.length,
                inlineBookCount = lineCount > 0 ? lines[0].children.length : 0
            for (let line of lines)
                for (let book of line.children)
                    book.style.visibility = 'hidden'
            list.forEach((item, index) => {
                if (index < lineCount * inlineBookCount) {
                    let book = lines[Math.floor(index / inlineBookCount)].children[index % inlineBookCount],
                        info = book.children
                    book.style.visibility = 'visible'
                    info[0].src = item.cover
                    info[1].innerHTML = item.title
                    info[2].children[0].innerHTML = item.author
                    info[2].children[1].innerHTML = '¥' + item.price
                    book.onclick = () => {
                        navigate(`/book?id=${item.id}`)
                    }
                }
            })
        },
        categoryOnclick = (index) => {
            let list = category.current.children
            for (let i = 0; i < list.length; ++i)
                list[i].className = index === i ? 'BookDisplay-categoryList BookDisplay-categoryList-active' : 'BookDisplay-categoryList'
        },
        onLastPage = () => {
            if (currPage <= 1) return
            setCurrPage(currPage - 1)
            searchBooks(keyword, currPage - 2, 30).then(res => {
                setTotalPage(res.totalPage)
                setBookList(res.list)
            }).catch(err => errorHandle(err, navigate))
        },
        onNextPage = () => {
            if (currPage >= totalPage) return
            setCurrPage(currPage + 1)
            searchBooks(keyword, currPage, 30).then(res => {
                setTotalPage(res.totalPage)
                setBookList(res.list)
            }).catch(err => errorHandle(err, navigate))
        },
        onSearch = e => {
            setKeyword(e.target.value)
            searchBooks(e.target.value, 0, 30).then(res => {
                setTotalPage(res.totalPage)
                setCurrPage(1)
                setBookList(res.list)
            }).catch(err => errorHandle(err, navigate))
        }

    // 初始化页面书籍列表
    useEffect(() => {
        getBooks(0, 30).then(res => {
            setTotalPage(res.totalPage)
            setCurrPage(1)
            setBookList(res.list)
        }).catch(err => errorHandle(err, navigate))
    }, [])

    // 控制页面滚动
    document.body.style.overflow = 'auto'

    return (
        <div>
            <MenuBar index={0} />

            {/* 搜索栏和按钮容器 */}
            <div className="search-container">
                <SearchBar placeholder='请输入书籍名、作者名等关键词搜索相关书籍' keyword={keyword} onChange={onSearch} />
                <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginLeft: '8px' }}>
                    查询书籍作者
                </Button>
            </div>

            <div id='BookDisplay'>
                <ul ref={category} id='BookDisplay-category'>
                    {categoryList.map((item, index) =>
                        <li
                            key={index}
                            id={index === 0 ? 'BookDisplay-categoryList-first' : ''}
                            className={index === 0 ? 'BookDisplay-categoryList BookDisplay-categoryList-active' : 'BookDisplay-categoryList'}
                            onClick={() => categoryOnclick(index)}
                        >{item.text}</li>
                    )}
                </ul>

                <div id='BookDisplay-bookPage'>
                    <div ref={bookList} id='BookDisplay-bookList'>
                        {[1, 2, 3, 4, 5, 6].map((index) =>
                            <ul key={index} className='BookDisplay-bookLine'>
                                {[1, 2, 3, 4, 5].map((index) =>
                                    <li key={index} className='BookDisplay-book'>
                                        <img className='BookDisplay-book-cover' alt='book'></img>
                                        <div className='BookDisplay-book-title'>-</div>
                                        <div className='BookDisplay-book-author-price'>
                                            <div className='BookDisplay-book-author'>-</div>
                                            <div className='BookDisplay-book-price'>¥</div>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div id='BookDisplay-pageShift'>
                        <button className='BookDisplay-pageShift-button' onClick={onLastPage}>上一页</button>
                        <span id='BookDisplay-pageShift-text'>第 {currPage} 页 / 共 {totalPage} 页</span>
                        <button className='BookDisplay-pageShift-button' onClick={onNextPage}>下一页</button>
                    </div>
                </div>
            </div>

            {/* 作者查询弹窗 */}
            <AuthorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
