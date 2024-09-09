import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css"
import './index.css'
import {Footer, TopNavbar} from './components/navigation'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Shop from './pages/shop'
import Contact from './pages/contact'
import Blog from './pages/blog'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <TopNavbar/>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home/>}/>
        <Route path="/shop" element={<Shop/>}/>  
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/contact_us" element={<Contact/>}/>    
        </Routes>
    </BrowserRouter>
    <Footer/>
  </StrictMode>,
)
