export const Shop=()=>{
    return(
        <div className="min-vh-100 text-center container-fluid">
            <div className="mb-3">
                <h1 className="display-3">Our <span className="s_text">Products</span></h1>
            </div>
            <div className="input-group container mb-3">
                <input type="text" className="form-control"/>
                <button className="btn s_bg text-white">Search</button>
            </div>
            <div className="d-flex flex-row flex-nowrap gap-3 p-4 slider_container">
                <button className="btn slider_btn">Handbags</button>
                <button className="btn slider_btn">Watches</button>
                <button className="btn slider_btn">Jewllery</button>
                <button className="btn slider_btn">Books</button>
                <button className="btn slider_btn">Stanley Cups</button>
                <button className="btn slider_btn">Clothes</button>
                <button className="btn slider_btn">Boxers</button>
            </div>
        </div>
    )
}

export default Shop