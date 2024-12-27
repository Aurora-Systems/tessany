import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import {Footer, TopNavbar} from './components/navigation'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Shop from './pages/shop'
import Contact from './pages/contact'
import Blog from './pages/blog'
import { ToastContainer } from 'react-toastify'
import Success from "./pages/success_page.tsx";

createRoot(document.getElementById('root')!).render(
  <>

    <TopNavbar/>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home/>}/>
        <Route path="/shop" element={<Shop/>}/>  
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/contact_us" element={<Contact/>}/>
          <Route path="/success" element={<Success/>}/>
        </Routes>
    </BrowserRouter>
    <Footer/>
    <ToastContainer/>
    </>,
)
