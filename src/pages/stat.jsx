import MenuBar from '../components/menu-bar'
import '../css/stat.css'
import {DatePicker, List, Tabs} from "antd";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getBookStat, getMineStat, getUserStat} from "../service/stat";
import {errorHandle} from "../service/util";

export default function StatPage() {
  const {RangePicker} = DatePicker,
    [bookStatList, setBookStatList] = useState([]),
    [userStatList, setUserStatList] = useState([]),
    [mineStatList, setMineStatList] = useState([]),
    [totalSales, setTotalSales] = useState(0),
    [totalConsumption, setTotalConsumption] = useState(0),
    [mode, setMode] = useState('book'),
    navigate = useNavigate(),
    [beginTime, setBeginTime] = useState('2020-01-01 00:00:00'),
    [endTime, setEndTime] = useState('2030-01-01 00:00:00');

  useEffect(() => {
    getBookStat('2020-01-01 00:00:00', '2030-01-01 00:00:00').then(res => {
      setBookStatList(res)
    }).catch(err => errorHandle(err, navigate))
  }, []);

  return (<div>
    <MenuBar index={2}/>
    <div id='Stat'>
      <div
        style={{
          margin: '40px',
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Tabs
          size='large'
          items={[{
            key: 'book', label: '书籍畅销榜',
          }, {
            key: 'user', label: '用户消费榜'
          }, {
            key: 'mine', label: '我的消费榜'
          }]}
          onChange={key => {
            setMode(key)
            if (key === 'book') {
              getBookStat(beginTime, endTime).then(res => {
                setBookStatList(res)
              }).catch(err => errorHandle(err, navigate))
            } else if (key === 'user') {
              getUserStat(beginTime, endTime).then(res => {
                setUserStatList(res)
              }).catch(err => errorHandle(err, navigate))
            } else if (key === 'mine') {
              getMineStat(beginTime, endTime).then(res => {
                setTotalSales(res.totalSales)
                setTotalConsumption(res.totalConsumption)
                setMineStatList(res.list)
              }).catch(err => errorHandle(err, navigate))
            }
          }
          }
        />
        <RangePicker
          placeholder={['开始时间', '结束时间']}
          showTime={{format: 'HH:mm:ss'}}
          format="YYYY-MM-DD HH:mm:ss"
          style={{margin: '0 10% 0 10%'}}
          onChange={(value, dateString) => {
            if (dateString[0] === '') dateString[0] = '2020-01-01 00:00:00'
            if (dateString[1] === '') dateString[1] = '2030-01-01 00:00:00'
            setBeginTime(dateString[0])
            setEndTime(dateString[1])
            if (mode === 'book') {
              getBookStat(dateString[0], dateString[1]).then(res => {
                setBookStatList(res)
              }).catch(err => errorHandle(err, navigate))
            } else if (mode === 'user') {
              getUserStat(dateString[0], dateString[1]).then(res => {
                setUserStatList(res)
              }).catch(err => errorHandle(err, navigate))
            } else if (mode === 'mine') {
              getMineStat(dateString[0], dateString[1]).then(res => {
                setTotalSales(res.totalSales)
                setTotalConsumption(res.totalConsumption)
                setMineStatList(res.list)
              }).catch(err => errorHandle(err, navigate))
            }
          }}
        />

      </div>
      {mode === 'book' && <ul id='Stat-ul'>
        {bookStatList.map((item, index) => <li key={index} className='Stat-li' onClick={() => {
          navigate(`/book?id=${item.id}`)
        }}>
          <div className='Stat-line'/>
          <div className='Stat-info'>
            <div style={{
              fontSize: '3rem',
              color: '#01fff7',
              marginRight: '36px',
              textShadow: '5px 5px 4px black'
            }}>{index + 1}</div>
            <img className='Stat-cover' src={item.cover} alt='book-image'/>
            <div className='Stat-li-flex1'>
              <span className='Stat-title'>{item.title}</span>
              <span className='Stat-author'>{item.author}</span>
              <div className='Stat-price'>¥{item.price}</div>
            </div>
            <div
              style={{
                width: '160px', fontSize: '24px', color: 'white'
              }}
            >销量{item.sales}件
            </div>
            <div
              style={{
                width: '160px', fontSize: '24px', color: 'white'
              }}
            >销额{item.sales * item.price}元
            </div>
          </div>
        </li>)}
      </ul>}
      {mode === 'user' && <List
        style={{width: '100%'}}
        dataSource={userStatList}
        renderItem={(item, index) => <List.Item
          key={index}
          style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}}
        >
          <div style={{
            fontSize: '3rem',
            color: '#01fff7',
            marginRight: '36px',
            textShadow: '5px 5px 4px black',
            width: '20%'
          }}>{index + 1}</div>
          <div style={{
            width: '20%', color: 'black', fontSize: '2rem'
          }}>{item.username}</div>
          <div style={{
            width: '20%', color: 'white', fontSize: '2rem'
          }}> 消费额: {item.consumption}</div>
        </List.Item>}
      />}
      {mode === 'mine' &&
        <div style={{width: '100%'}}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div
              style={{
                fontSize: '1.5rem',
                marginRight: '40px'
              }}
            >{`总计购书${totalSales}本`}
            </div>
            <div style={{
              fontSize: '1.5rem',
              marginLeft: '40px'
            }}>{`总计消费${totalConsumption}元`}
            </div>
          </div>
          <ul id='Stat-ul'>
            {mineStatList.map((item, index) => <li key={index} className='Stat-li' onClick={() => {
              navigate(`/book?id=${item.id}`)
            }}>
              <div className='Stat-line'/>
              <div className='Stat-info'>
                <div style={{
                  fontSize: '3rem',
                  color: '#01fff7',
                  marginRight: '36px',
                  textShadow: '5px 5px 4px black'
                }}>{index + 1}</div>
                <img className='Stat-cover' src={item.cover} alt='book-image'/>
                <div className='Stat-li-flex1'>
                  <span className='Stat-title'>{item.title}</span>
                  <span className='Stat-author'>{item.author}</span>
                  <div className='Stat-price'>¥{item.price}</div>
                </div>
                <div
                  style={{
                    width: '160px', fontSize: '24px', color: 'white'
                  }}
                >买过{item.sales}件
                </div>
                <div
                  style={{
                    width: '160px', fontSize: '24px', color: 'white'
                  }}
                >共计{item.sales * item.price}元
                </div>
              </div>
            </li>)}
          </ul>
        </div>}
    </div>
  </div>)
}