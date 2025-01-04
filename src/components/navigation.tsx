import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';

export const TopNavbar=()=> {
  return (
    <Navbar sticky='top' className='p_bg p-1'>
        <Navbar.Brand href="#home">
            <div className='d-flex flex-row align-items-center'>
            <img src="https://ngratesc.sirv.com/Tessany/tess_logo.png" width={60}/>
            </div>
           
            
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="/" >Home</Nav.Link>
            <Nav.Link href="/shop">Shop</Nav.Link>
            <Nav.Link href="/blog">Blog</Nav.Link>
            <Nav.Link href="/contact_us">Contact Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export const Footer=()=>{
    return(
        <div className='s_bg container-fluid text-white text-center'>
            <div className='row'>
                <div className="col-sm d-flex flex-column">
                    <a href={"https://www.facebook.com/profile.php?id=61566433627611"}>Facebook</a>
                    <span>www.tessah.co.zw</span>
                    <span>info@tessah.co.zw</span>
                    <span>+263 77 169 2396</span>
                </div>
                <div className='col-sm d-flex flex-column'>
                    <span>Number 8 Baines Avenue</span>
                    <span>Corner Baines & Harare Street</span>
                    <span>Harare</span>
                    <span>Zimbabwe</span>
                </div>
                <div className='col-sm'>
                    <h3 className='p_font display-2'>Secrets</h3>
                </div>
            </div>
        </div>
    )
}

