import {useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {Checkbox} from 'antd'
import '../css/login.css'
import {login, signup} from '../service/login'

export default function LoginPage() {
  document.body.style.overflow = 'hidden'
  const navigate = useNavigate(), loginRef = useRef(null), signupRef = useRef(null),
    loginId = useRef(null), loginPwd = useRef(null), signupId = useRef(null),
    signupEmail = useRef(null), signupPwd1 = useRef(null), signupPwd2 = useRef(null),
    shiftToSignup = () => {
      let loginClass = loginRef.current.classList, signupClass = signupRef.current.classList
      loginClass.remove('login-in')
      loginClass.add('login-out')
      signupClass.remove('signup-out')
      signupClass.add('signup-in')
    }, shiftToLogin = () => {
      let loginClass = loginRef.current.classList, signupClass = signupRef.current.classList
      loginClass.remove('login-out')
      loginClass.add('login-in')
      signupClass.remove('signup-in')
      signupClass.add('signup-out')
    }, onLoginIdKeyUp = (e) => {
      if (e.key === 'Enter' && loginId.current.value !== '') loginPwd.current.focus()
    }, onLoginPwdKeyUp = (e) => {
      if (e.key === 'Enter' && loginPwd.current.value !== '') onLogin()
    }, onSignupIdKeyUp = (e) => {
      if (e.key === 'Enter' && signupId.current.value !== '') signupEmail.current.focus()
    }, onSignupEmailKeyUp = (e) => {
      if (e.key === 'Enter' && signupEmail.current.value !== '') signupPwd1.current.focus()
    }, onSignupPwd1KeyUp = (e) => {
      if (e.key === 'Enter' && signupPwd1.current.value !== '') signupPwd2.current.focus()
    }, onSignupPwd2KeyUp = (e) => {
      if (e.key === 'Enter' && signupPwd2.current.value !== '') onSignup()
    }, onLogin = () => {
      if (loginId.current.value === '') {
        loginId.current.focus()
        return
      } else if (loginPwd.current.value === '') {
        loginPwd.current.focus()
        return
      }
      login(loginId.current.value, loginPwd.current.value)
        .then(() => navigate('/home'))
        .catch(err => alert(err))
    }, onSignup = () => {
      if (signupId.current.value === '') {
        signupId.current.focus()
        return
      } else if (signupEmail.current.value === '' || signupEmail.current.value.indexOf('@') === -1 || signupEmail.current.value.indexOf('.') === -1) {
        signupEmail.current.focus()
        return
      } else if (signupPwd1.current.value === '') {
        signupPwd1.current.focus()
        return
      } else if (signupPwd2.current.value === '' || signupPwd2.current.value !== signupPwd1.current.value) {
        alert('两次密码输入不一致！')
        signupPwd2.current.focus()
        return
      }
      signup(signupId.current.value, signupEmail.current.value, signupPwd1.current.value)
        .then(() => {
          alert('注册成功！你可以使用新账号登录了')
          shiftToLogin()
        }).catch(err => alert(err))
    }

  return (<div>
    <h1 id='title'>星空<br/>&ensp;书店</h1>
    <h2 id='intro'>以最实惠的价格，<br/>&nbsp;畅享书籍的浩瀚星空。</h2>

    <div ref={loginRef} className='entry login-enter'>
      <h1 className='entry-title'>登 录</h1>
      <input ref={loginId} className='entry-input' type='id' placeholder='账号'
             onKeyUp={onLoginIdKeyUp}/>
      <input ref={loginPwd} className='entry-input' type='password' placeholder='密码'
             onKeyUp={onLoginPwdKeyUp}/>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        margin: '20px auto 10px'
      }}>
        <Checkbox><span style={{color: 'white', fontSize: '12px'}}>记住我</span></Checkbox>
        <button id='forget'>忘记密码？</button>
      </div>
      <button className='entry-submit' onClick={onLogin}>登 录</button>
      <button className='entry-shift' onClick={shiftToSignup}>没有账号？点我注册</button>
    </div>

    <div ref={signupRef} className='entry signup-enter'>
      <h1 className='entry-title'>注 册</h1>
      <input ref={signupId} className='entry-input' type='id' placeholder='用户名'
             onKeyUp={onSignupIdKeyUp}/>
      <input ref={signupEmail} className='entry-input' type='id' placeholder='邮箱'
             onKeyUp={onSignupEmailKeyUp}/>
      <input ref={signupPwd1} className='entry-input' type='password' placeholder='密码'
             onKeyUp={onSignupPwd1KeyUp}/>
      <input ref={signupPwd2} className='entry-input' type='password' placeholder='确认密码'
             onKeyUp={onSignupPwd2KeyUp}/>
      <button className='entry-submit' onClick={onSignup}>注 册</button>
      <button className='entry-shift' onClick={shiftToLogin}>已有账号？点我登录</button>
    </div>
  </div>)
}