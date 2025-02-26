import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Categories from './components/Categories'
import Products from './components/Products'
import Cart from './components/Cart'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import ProductDetails from './components/ProductDetails'
import CategoryProducts from './components/CategoryProducts'
import GroupProducts from './components/GroupProducts'
import Footer from './components/Footer'
import MetaTags from './components/MetaTags'
import ScrollToTopButton from './components/ScrollToTopButton'
import ResetPassword from './components/ResetPassword'
import ResetPasswordToken from './components/ResetPasswordToken'
import ConfirmEmail from './components/ConfirmEmail'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <MetaTags />
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              {/* Обновляем маршрут для авторизации */}
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/category/allproductsofsubcategories/:categoryId" element={<CategoryProducts />} />
              <Route path="/group/:groupId/products" element={<GroupProducts />} />
              <Route path="/reset-password" element={<ResetPassword />} /> {/* Добавляем маршрут для сброса пароля */}
              <Route path="/reset-password/:token" element={<ResetPasswordToken />} />
            </Routes>
          </div>
          <Footer />
          <ScrollToTopButton />
        </Router>
      </CartProvider>
    </LanguageProvider>
  )
}

export default App
