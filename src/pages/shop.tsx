export const Shop=()=>{
    return(
        <div className="min-vh-100 text-center">
            <div className="mb-3">
                <h1 className="display-3">Our <span className="s_text">Products</span></h1>
            </div>
            <div className="input-group container mb-3">
                <input type="text" className="form-control"/>
                <button className="btn s_bg text-white">Search</button>
            </div>
            <div className="d-flex flex-row gap-3">
                <button className="btn s_bg text-white">Handbags</button>
                <button className="btn s_bg text-white">Watches </button>

            </div>
        </div>
    )
}

export default Shop