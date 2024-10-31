import {useRef, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Checkbox} from "antd"
import MenuBar from '../components/menu-bar'
import '../css/manage.css'
import {getBooks, searchBooks} from '../service/book'
import {errorHandle} from '../service/util'
import {
  addBook,
  delBook,
  getOrders,
  getUsers,
  searchOrders,
  searchUsers,
  setBook,
  setUser,
  silenceUser,
  unsilenceUser,
  uploadImage
} from '../service/manage'

let type = 'book', list = [], id

export default function ManagePage() {
  const bookManage = useRef(null),
    userManage = useRef(null),
    orderManage = useRef(null),
    [placeholder, setPlaceholder] = useState('请输入书籍名、作者名等关键词搜索相关书籍'),
    [keyword, setKeyword] = useState(''),
    [currPage, setCurrPage] = useState(1),
    [totalPage, setTotalPage] = useState(0),
    [totalCount, setTotalCount] = useState(0),
    [listName, setListName] = useState('站内书籍'),
    [showBookModal, setShowBookModal] = useState(false),
    [showUserModal, setShowUserModal] = useState(false),
    bookList = useRef(null),
    userList = useRef(null),
    orderList = useRef(null),
    [cover, setCover] = useState(),
    [title, setTitle] = useState(),
    [author, setAuthor] = useState(),
    [isbn, setIsbn] = useState(),
    [price, setPrice] = useState(),
    [sales, setSales] = useState(),
    [repertory, setRepertory] = useState(),
    [intro, setIntro] = useState(),
    [username, setUsername] = useState(),
    [email, setEmail] = useState(),
    [bookSubmit, setBookSubmit] = useState('修改'),
    titleInput = useRef(null),
    authorInput = useRef(null),
    isbnInput = useRef(null),
    priceInput = useRef(null),
    salesInput = useRef(null),
    repertoryInput = useRef(null),
    introInput = useRef(null),
    usernameInput = useRef(null),
    emailInput = useRef(null),
    coverInput = useRef(null),
    onTitleInputKeyUp = e => {
      if (e.key === 'Enter' && titleInput.current.value !== '')
        authorInput.current.focus()
    },
    onAuthorInputKeyUp = e => {
      if (e.key === 'Enter' && authorInput.current.value !== '')
        isbnInput.current.focus()
    },
    onIsbnInputKeyUp = e => {
      if (e.key === 'Enter' && isbnInput.current.value !== '')
        priceInput.current.focus()
    },
    onPriceInputKeyUp = e => {
      if (e.key === 'Enter' && priceInput.current.value !== '')
        salesInput.current.focus()
    },
    onSalesInputKeyUp = e => {
      if (e.key === 'Enter' && salesInput.current.value !== '')
        repertoryInput.current.focus()
    },
    onRepertoryInputKeyUp = e => {
      if (e.key === 'Enter' && repertoryInput.current.value !== '')
        introInput.current.focus()
    },
    onUsernameInputKeyUp = e => {
      if (e.key === 'Enter' && usernameInput.current.value !== '')
        emailInput.current.focus()
    },
    onEmailInputKeyUp = e => {
      if (e.key === 'Enter' && emailInput.current.value !== '')
        onSetUserSubmit()
    },
    navigate = useNavigate(),
    onManageBook = () => {
      bookManage.current.className = 'ManageType-button ManageType-button-select'
      userManage.current.className = 'ManageType-button'
      orderManage.current.className = 'ManageType-button'
      setPlaceholder('请输入书籍名、作者名等关键词搜索相关书籍')
      setKeyword('')
      type = 'book'
      setListName('站内书籍')
      getBooks(0, 10).then(res => {
        list = res.list
        setTotalCount(res.totalNumber)
        setTotalPage(res.totalPage)
        setCurrPage(1)
        setBookList(res.list)
      }).catch(err => errorHandle(err, navigate))
    },
    onManageUser = () => {
      bookManage.current.className = 'ManageType-button'
      userManage.current.className = 'ManageType-button ManageType-button-select'
      orderManage.current.className = 'ManageType-button'
      setPlaceholder('请输入用户名关键词搜索相关用户')
      setKeyword('')
      type = 'user'
      setListName('站内用户')
      getUsers(0, 20).then(res => {
        list = res.list
        setTotalCount(res.totalNumber)
        setTotalPage(res.totalPage)
        setCurrPage(1)
        setUserList(res.list)
      }).catch(err => errorHandle(err, navigate))
    },
    onManageOrder = () => {
      bookManage.current.className = 'ManageType-button'
      userManage.current.className = 'ManageType-button'
      orderManage.current.className = 'ManageType-button ManageType-button-select'
      setPlaceholder('请输入用户名、订单信息、下单时间、书籍信息等关键词搜索相关订单')
      setKeyword('')
      type = 'order'
      setListName('站内订单')
      getOrders(0, 10).then(res => {
        list = res.list
        setTotalCount(res.totalNumber)
        setTotalPage(res.totalPage)
        setCurrPage(1)
        setOrderList(res.list)
      }).catch(err => errorHandle(err, navigate))
    },
    setBookList = (list = [{
      cover: '',
      title: '-',
      author: '-',
      price: '',
      isbn: '',
      sales: 0,
      repertory: 0
    }]) => {
      bookList.current.style.display = 'flex'
      userList.current.style.display = 'none'
      orderList.current.style.display = 'none'
      let lis = bookList.current.children
      for (let li of lis) li.style.visibility = 'hidden'
      list.forEach((item, index) => {
        if (index < lis.length) {
          let li = lis[index],
            info = li.children[0].children,
            info1 = info[1].children,
            info2 = info[2].children
          li.style.visibility = 'visible'
          info[0].src = item.cover
          info1[0].innerHTML = item.title
          info1[1].innerHTML = item.author
          info1[2].innerHTML = '¥' + item.price
          info2[0].innerHTML = 'ISBN ' + item.isbn
          info2[1].innerHTML = '销量' + item.sales + '件'
          info2[2].innerHTML = '库存' + item.repertory + '件'
        }
      })
    },
    setUserList = (list = [{username: '-', email: '-', silence: false}]) => {
      bookList.current.style.display = 'none'
      userList.current.style.display = 'flex'
      orderList.current.style.display = 'none'
      let lis = userList.current.children
      for (let li of lis) li.style.visibility = 'hidden'
      list.forEach((item, index) => {
        if (index < lis.length) {
          let li = lis[index],
            info = li.children[0].children
          li.style.visibility = 'visible'
          info[0].innerHTML = item.username
          info[1].innerHTML = item.email
          info[3].innerHTML = item.silence ? '解禁' : '禁用'
          info[3].style.color = item.silence ? 'white' : 'black'
        }
      })
    },
    setOrderList = (list = [{
      cover: '-',
      title: '-',
      author: '-',
      price: '',
      receiver: '-',
      tel: '',
      address: '-',
      username: '',
      time: '-',
      number: '-'
    }]) => {
      bookList.current.style.display = 'none'
      userList.current.style.display = 'none'
      orderList.current.style.display = 'flex'
      let lis = orderList.current.children
      for (let li of lis) li.style.visibility = 'hidden'
      list.forEach((item, index) => {
        if (index < lis.length) {
          let li = lis[index],
            info = li.children[0].children,
            info1 = info[1].children,
            info2 = info[2].children,
            info3 = info[3].children
          li.style.visibility = 'visible'
          info[0].src = item.cover
          info1[0].innerHTML = item.title
          info1[1].innerHTML = item.author
          info1[2].innerHTML = '¥' + item.price
          info2[0].innerHTML = item.receiver
          info2[1].innerHTML = '☏' + item.tel
          info2[2].innerHTML = item.address
          info3[0].innerHTML = '@' + item.username
          info3[1].innerHTML = item.time
          info3[2].innerHTML = '共' + item.number + '件'
          info3[3].innerHTML = '¥' + item.price * item.number
        }
      })
    },
    onSearch = keyword => {
      if (type === 'book') {
        searchBooks(keyword, 0, 10).then(res => {
          list = res.list
          setTotalCount(res.totalNumber)
          setTotalPage(res.totalPage)
          setCurrPage(1)
          setBookList(res.list)
        }).catch(err => errorHandle(err, navigate))
      } else if (type === 'user') {
        searchUsers(keyword, 0, 20).then(res => {
          list = res.list
          setTotalCount(res.totalNumber)
          setTotalPage(res.totalPage)
          setCurrPage(1)
          setUserList(res.list)
        }).catch(err => errorHandle(err, navigate))
      } else if (type === 'order') {
        searchOrders(keyword, 0, 10).then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setCurrPage(1)
            setOrderList(res.list)
          }
        ).catch(err => errorHandle(err, navigate))
      }
    },
    onLastPage = () => {
      if (currPage <= 1) return
      setCurrPage(currPage - 1)
      let res = {}
      if (type === 'book')
        searchBooks(keyword, currPage - 2, 10)
          .then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setCurrPage(currPage - 1)
            setBookList(res.list)
          }).catch(err => errorHandle(err, navigate))
      else if (type === 'user')
        searchUsers(keyword, currPage - 2, 20)
          .then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setCurrPage(currPage - 1)
            setUserList(res.list)
          }).catch(err => errorHandle(err, navigate))
      else if (type === 'order')
        searchOrders(keyword, currPage - 2, 10)
          .then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setCurrPage(currPage - 1)
            setOrderList(res.list)
          }).catch(err => errorHandle(err, navigate))
    },
    onNextPage = () => {
      if (currPage >= totalPage) return
      setCurrPage(currPage + 1)
      if (type === 'book')
        searchBooks(keyword, currPage, 10)
          .then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setCurrPage(currPage + 1)
            setBookList(res.list)
          }).catch(err => errorHandle(err, navigate))
      else if (type === 'user')
        searchUsers(keyword, currPage, 20)
          .then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setCurrPage(currPage + 1)
            setUserList(res.list)
          }).catch(err => errorHandle(err, navigate))
      else if (type === 'order')
        searchOrders(keyword, currPage, 10)
          .then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setCurrPage(currPage + 1)
            setOrderList(res.list)
          }).catch(err => errorHandle(err, navigate))
    },
    onSetBook = index => {
      id = list[index].id
      setCover(list[index].cover)
      setTitle(list[index].title)
      setAuthor(list[index].author)
      setIsbn(list[index].isbn)
      setPrice(list[index].price)
      setSales(list[index].sales)
      setRepertory(list[index].repertory)
      setIntro(list[index].description)
      setBookSubmit('修改')
      setShowBookModal(true)
    },
    onAddBook = () => {
      setCover('')
      setTitle('')
      setAuthor('')
      setIsbn('')
      setPrice('')
      setSales('0')
      setRepertory('')
      setIntro('')
      setBookSubmit('上传')
      setShowBookModal(true)
    },
    onSetUser = index => {
      id = list[index].id
      setUsername(list[index].username)
      setEmail(list[index].email)
      setShowUserModal(true)
    },
    onSetBookSubmit = () => {
      if (title === '') {
        titleInput.current.focus()
        return
      } else if (author === '') {
        authorInput.current.focus()
        return
      } else if (isbn === '') {
        isbnInput.current.focus()
        return
      } else if (price === '') {
        priceInput.current.focus()
        return
      } else if (sales === '') {
        salesInput.current.focus()
        return
      } else if (repertory === '') {
        repertoryInput.current.focus()
        return
      } else if (intro === '') {
        introInput.current.focus()
        return
      }
      if (bookSubmit === '修改') {
        setBook(id, title, author, isbn, cover, parseInt(price * 100), sales, repertory, intro)
          .then(() => {
            alert('修改成功')
            setShowBookModal(false)
            getBooks(currPage - 1, 10).then(res => {
              list = res.list
              setTotalCount(res.totalNumber)
              setTotalPage(res.totalPage)
              setBookList(res.list)
            }).catch(err => errorHandle(err, navigate))
          }).catch(err => errorHandle(err, navigate))
      } else if (bookSubmit === '上传') {
        addBook(title, author, isbn, cover, parseInt(price * 100), sales, repertory, intro)
          .then(() => {
            alert('上传成功')
            setShowBookModal(false)
            getBooks(0, 10).then(res => {
              list = res.list
              setTotalCount(res.totalNumber)
              setTotalPage(res.totalPage)
              setCurrPage(1)
              setBookList(res.list)
            }).catch(err => errorHandle(err, navigate))
          }).catch(err => errorHandle(err, navigate))
      }
    },
    onSetUserSubmit = () => {
      if (username === '') {
        usernameInput.current.focus()
        return
      } else if (email === '') {
        emailInput.current.focus()
        return
      }
      setUser(id, username, email)
        .then(() => {
          alert('修改成功')
          setShowUserModal(false)
          getUsers(currPage - 1, 20).then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setUserList(res.list)
          }).catch(err => errorHandle(err, navigate))
        }).catch(err => errorHandle(err, navigate))
    },
    onRemoveBook = index => {
      delBook(list[index].id).then(() => {
        alert('删除书籍成功')
        setShowUserModal(false)
        getBooks(0, 10).then(res => {
          list = res.list
          setTotalCount(res.totalNumber)
          setTotalPage(res.totalPage)
          setCurrPage(1)
          setBookList(res.list)
        }).catch(err => errorHandle(err, navigate))
      }).catch(err => errorHandle(err, navigate))
    },
    onSilenceUser = index => {
      if (!list[index].silence)
        silenceUser(list[index].id).then(() => {
          alert('禁用用户成功')
          getUsers(currPage - 1, 20).then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setUserList(res.list)
          }).catch(err => errorHandle(err, navigate))
        }).catch(err => errorHandle(err, navigate))
      else
        unsilenceUser(list[index].id).then(() => {
          alert('解禁用户成功')
          getUsers(currPage - 1, 20).then(res => {
            list = res.list
            setTotalCount(res.totalNumber)
            setTotalPage(res.totalPage)
            setUserList(res.list)
          }).catch(err => errorHandle(err, navigate))
        }).catch(err => errorHandle(err, navigate))
    },
    onUploadCover = () => {
      uploadImage(coverInput.current.files[0])
        .then(res => setCover(res))
        .catch(err => errorHandle(err, navigate))
    }

  useEffect(() => {
    getBooks(0, 10).then(res => {
      list = res.list
      setTotalCount(res.totalNumber)
      setTotalPage(res.totalPage)
      setCurrPage(1)
      setBookList(res.list)
    }).catch(err => errorHandle(err, navigate))
  }, [])

  return (
    <div>
      <MenuBar index={4}/>
      <div id='Manage'>
        <div id='ManageType'>
          <button
            ref={bookManage}
            className='ManageType-button ManageType-button-select'
            onClick={onManageBook}>书籍管理
          </button>
          <button ref={userManage} className='ManageType-button' onClick={onManageUser}>用户管理
          </button>
          <button ref={orderManage} className='ManageType-button' onClick={onManageOrder}>订单管理
          </button>
        </div>
        <div id='ManageDisplay'>
          <div id='Manage-SearchBar'>
            <input
              id='Manage-SearchBar-input'
              type="text"
              placeholder={placeholder}
              value={keyword}
              onChange={
                event => {
                  setKeyword(event.target.value)
                  onSearch(event.target.value)
                }
              }
            />
            <button id='Manage-SearchBar-submit'></button>
          </div>
          <h1 id='ManageList-title'>{listName}，共{totalCount}条</h1>
          <div className='Manage-line'/>
          {
            type === 'book' &&
            <div id='Manage-addBook'>
              <button id='Manage-addBook-button' onClick={onAddBook}>+ 上传书籍</button>
              <div className='Manage-line'/>
            </div>
          }
          <ul ref={bookList} id='Manage-ul'>
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) =>
                <li key={index} className='Manage-li'
                    onClick={() => navigate(`/book?id=${list[index].id}`)}>
                  <div className='ManageBook-bookInfo'>
                    <img className='ManageBook-cover' src='' alt=''/>
                    <div className='ManageBook-li-flex1'>
                      <span className='ManageBook-title'>-</span>
                      <span className='ManageBook-author'>-</span>
                      <div className='ManageBook-price'>¥</div>
                    </div>
                    <div className='ManageBook-li-flex2'>
                      <span className='ManageBook-isbn'>ISBN </span>
                      <span className='ManageBook-sale'>销量 件</span>
                      <div className='ManageBook-repertory'>库存 件</div>
                    </div>
                    <button
                      className='ManageBook-setting'
                      onClick={
                        e => {
                          e.stopPropagation()
                          onSetBook(index)
                        }
                      }
                    >修改信息
                    </button>
                    <button
                      className='ManageBook-remove'
                      onClick={
                        e => {
                          e.stopPropagation()
                          onRemoveBook(index)
                        }
                      }
                    >删除书籍
                    </button>
                    <Checkbox onClick={e => e.stopPropagation()}/>
                  </div>
                  <div className='Manage-line'/>
                </li>
              )
            }
          </ul>
          <ul ref={userList} id='Manage-ul'>
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 18, 19, 20].map((item, index) =>
                <li key={index} className='Manage-li'>
                  <div className='ManageUser-userInfo'>
                    <span className='ManageUser-username'>-</span>
                    <span className='ManageUser-email'>-</span>
                    <button className='ManageUser-setting'
                            onClick={() => onSetUser(index)}>修改信息
                    </button>
                    <button className='ManageUser-silence'
                            onClick={() => onSilenceUser(index)}>禁用
                    </button>
                    <button className='ManageUser-remove'
                            onClick={() => alert('暂不支持注销用户！')}>注销
                    </button>
                    <Checkbox/>
                  </div>
                  <div className='Manage-line'/>
                </li>
              )
            }
          </ul>
          <ul ref={orderList} id='Manage-ul'>
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) =>
                <li key={index} className='Manage-li'
                    onClick={() => navigate(`/book?id=${list[index].id}`)}>
                  <div className='ManageOrder-info'>
                    <img className='ManageOrder-cover' src='' alt='book-image'/>
                    <div className='ManageOrder-li-flex1'>
                      <span className='ManageOrder-title'>-</span>
                      <span className='ManageOrder-author'>-</span>
                      <div className='ManageOrder-price'>¥</div>
                    </div>
                    <div className='ManageOrder-li-flex2'>
                      <div className='ManageOrder-receiver'>-</div>
                      <div className='ManageOrder-tel'>☏</div>
                      <div className='ManageOrder-address'>-</div>
                    </div>
                    <div className='ManageOrder-li-flex3'>
                      <div className='ManageOrder-user'>@</div>
                      <div className='ManageOrder-datetime'>yyyy-MM-dd HH:mm:ss</div>
                      <div className='ManageOrder-number'>共 件</div>
                      <div className='ManageOrder-total-price'>¥</div>
                    </div>
                    <button
                      className='ManageOrder-remove'
                      onClick={
                        e => {
                          e.stopPropagation()
                          alert('暂不支持删除订单！')
                        }
                      }
                    >删除记录
                    </button>
                    <Checkbox onClick={e => e.stopPropagation()}/>
                  </div>
                  <div className='Order-line'/>
                </li>
              )
            }
          </ul>
          <div id='Manage-pageShift-select'>
            <Checkbox> <font color='white' fontSize='15px'>全部全选</font></Checkbox>
            <div id='Manage-pageShift'>
              <button className='Manage-pageShift-button' onClick={onLastPage}>上一页</button>
              <span id='Manage-pageShift-text'>第 {currPage} 页 / 共 {totalPage} 页</span>
              <button className='Manage-pageShift-button' onClick={onNextPage}>下一页</button>
            </div>
            <Checkbox> <font color='white' fontSize='15px'>本页全选</font></Checkbox>
          </div>
        </div>
      </div>
      {
        showBookModal &&
        <div className='Manage-modal' onClick={() => setShowBookModal(false)}>
          <div id='ManageBook-modal-content' onClick={e => e.stopPropagation()}>
            <div id='ManageBook-modal-flex1'>
              <input ref={coverInput} type="file" name="multipartfile" accept="image/*"
                     onChange={onUploadCover} style={{display: 'none'}}/>
              <img id='ManageBook-modal-cover' src={cover} alt='点击上传封面图片' onClick={() => {
                coverInput.current.click()
              }}/>
              <div id='ManageBook-modal-flex2'>
                <div className='Manage-modal-label-input'>
                  <div className='Manage-modal-label'>书名</div>
                  <input
                    ref={titleInput}
                    className='Manage-modal-input'
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    onKeyUp={onTitleInputKeyUp}
                  />
                </div>
                <div className='Manage-modal-label-input'>
                  <div className='Manage-modal-label'>作者</div>
                  <input
                    ref={authorInput}
                    className='Manage-modal-input'
                    value={author}
                    onChange={event => setAuthor(event.target.value)}
                    onKeyUp={onAuthorInputKeyUp}
                  />
                </div>
                <div className='Manage-modal-label-input'>
                  <div className='Manage-modal-label'>ISBN</div>
                  <input
                    ref={isbnInput}
                    className='Manage-modal-input'
                    value={isbn}
                    onChange={event => setIsbn(event.target.value)}
                    onKeyUp={onIsbnInputKeyUp}
                  />
                </div>
                <div className='Manage-modal-label-input'>
                  <div className='Manage-modal-label'>价格</div>
                  <input
                    ref={priceInput}
                    className='Manage-modal-input'
                    value={price}
                    onChange={event => setPrice(event.target.value)}
                    onKeyUp={onPriceInputKeyUp}
                  />
                </div>
                <div className='Manage-modal-label-input'>
                  <div className='Manage-modal-label'>销量</div>
                  <input
                    ref={salesInput}
                    className='Manage-modal-input'
                    value={sales}
                    onChange={event => setSales(event.target.value)}
                    onKeyUp={onSalesInputKeyUp}
                  />
                </div>
                <div className='Manage-modal-label-input'>
                  <div className='Manage-modal-label'>库存</div>
                  <input
                    ref={repertoryInput}
                    className='Manage-modal-input'
                    value={repertory}
                    onChange={event => setRepertory(event.target.value)}
                    onKeyUp={onRepertoryInputKeyUp}
                  />
                </div>
              </div>
            </div>
            <textarea
              ref={introInput}
              id='ManageBook-modal-intro'
              value={intro}
              onChange={event => setIntro(event.target.value)}
              placeholder='书籍简介'
            />
            <div className='Manage-modal-operation'>
              <button className='Manage-modal-submit'
                      onClick={onSetBookSubmit}>{bookSubmit}</button>
              <button className='Manage-modal-cancle' onClick={() => setShowBookModal(false)}>取消
              </button>
            </div>
          </div>
        </div>
      }
      {
        showUserModal &&
        <div className='Manage-modal' onClick={() => setShowUserModal(false)}>
          <div id='ManageUser-modal-content' onClick={e => e.stopPropagation()}>
            <div id='ManageUser-modal-flex'>
              <div className='Manage-modal-label-input'>
                <div className='Manage-modal-label'>用户名</div>
                <input
                  ref={usernameInput}
                  className='Manage-modal-input'
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  onKeyUp={onUsernameInputKeyUp}
                />
              </div>
              <div className='Manage-modal-label-input'>
                <div className='Manage-modal-label'>邮箱</div>
                <input
                  ref={emailInput}
                  className='Manage-modal-input'
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  onKeyUp={onEmailInputKeyUp}
                />
              </div>
            </div>
            <div className='Manage-modal-operation'>
              <button className='Manage-modal-submit' onClick={onSetUserSubmit}>修改</button>
              <button className='Manage-modal-cancle' onClick={() => setShowUserModal(false)}>取消
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}