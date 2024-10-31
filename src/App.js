import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Background from './components/background'
import LoginPage from './pages/login'
import HomePage from './pages/home'
import OrderPage from './pages/order'
import StatPage from './pages/stat'
import CartPage from './pages/cart'
import AccountPage from './pages/account'
import BookPage from './pages/book'
import MenuBar from './components/menu-bar'
import ManagePage from './pages/manage'
import {useState} from "react";

export default function App() {
  let [ws, setWs] = useState(null)

  return (
    <div>
      <Background />
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to='/login' />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path='/order' element={<OrderPage />} />
          <Route path='/stat' element={<StatPage />} />
          <Route path='/cart' element={<CartPage ws={ws} setWs={setWs} />} />
          <Route path='/sky' element={<MenuBar index={3} />} />
          <Route path='/manage' element={<ManagePage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/book' element={<BookPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
