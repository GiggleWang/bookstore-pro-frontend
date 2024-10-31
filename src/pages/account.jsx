import {useState, useEffect, useRef} from 'react'
import MenuBar from '../components/menu-bar'
import '../css/account.css'

export default function AccountPage() {
  const [username, setUsername] = useState(), [phone, setPhone] = useState(), [email, setEmail] = useState(), [address, setAddress] = useState(), [intro, setIntro] = useState(),
    setUserInfo = (info = {username, phone, email, address, intro}) => {
      setUsername(info.username)
      setPhone(info.phone)
      setEmail(info.email)
      setAddress(info.address)
      setIntro(info.intro)
    }

  useEffect(() => {
    setUserInfo({
      username: 'user_00001',
      phone: '12345678901',
      email: '@sjtu.deu.en',
      address: '上海闵行',
      intro: '这个人很懒，什么都没有留下。'
    })
  }, [])

  return (<div>
    <MenuBar index={6}/>
    <div id='Account'>
      <div id='Account-info'>
        <div id='Account-flex'>
          <img id='Account-photo' alt='头像'/>
          <div id='Account-username'>
            <div style={{fontSize: '15px'}}>用户名</div>
            <input className='Account-input' value={username}
                   onChange={(event) => setUsername(event.target.value)}/>
          </div>
        </div>
        <div id='Account-phone'>
          <div style={{fontSize: '15px'}}>电话</div>
          <input className='Account-input' value={phone}
                 onChange={(event) => setPhone(event.target.value)}/>
        </div>
        <div id='Account-email'>
          <div style={{fontSize: '15px'}}>邮箱</div>
          <input className='Account-input' value={email}
                 onChange={(event) => setEmail(event.target.value)}/>
        </div>
        <div id='Account-address'>
          <div style={{fontSize: '15px'}}>收货地址</div>
          <input className='Account-input' value={address}
                 onChange={(event) => setAddress(event.target.value)}/>
        </div>
        <div id='Account-intro'>
          <div style={{fontSize: '15px'}}>用户简介</div>
          <input className='Account-input' value={intro}
                 onChange={(event) => setIntro(event.target.value)}/>
        </div>
      </div>
      <div id='Account-operation'>
        <button className='Account-operation-button'>保存</button>
        <button className='Account-operation-button'>修改</button>
        <button className='Account-operation-button'>取消</button>
      </div>
    </div>
  </div>)
}