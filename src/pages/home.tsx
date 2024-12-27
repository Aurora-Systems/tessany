import Marquee from "react-fast-marquee"
export const Home=()=>{
    return(
        <div className="container-fluid">
            <div className=" d-flex flex-column justify-content-center align-items-center mb-5">
                <div className="">
                    <img src="https://ngratesc.sirv.com/Tessany/tess_logo.png" width={200} className="img-fluid"/>
                </div>
                <div className="mb-3">
                <a href="/shop"><button className="mt-3 btn s_btn">Shop Now</button></a>

                </div>
                <Marquee speed={20}>
                    <div className="col-sm me-3">
                        <img src="https://ngratesc.sirv.com/Tessany/2150916722.png" className="img-fluid rounded"/>
                    </div>
                    <div className="col-sm me-2">
                        <img src="https://ngratesc.sirv.com/Tessany/2151073506.png" className="img-fluid rounded"/>

                    </div>
                    <div className="col-sm me-2">
                        <img src="https://ngratesc.sirv.com/Tessany/2150916680.png" className="img-fluid rounded"/>
                    </div>
                    <div className="col-sm me-2">
                        <img src="https://ngratesc.sirv.com/Tessany/2150916722.png" className="img-fluid rounded"/>
                    </div>
                    <div className="col-sm me-2">
                        <img src="https://ngratesc.sirv.com/Tessany/2151073506.png" className="img-fluid rounded"/>

                    </div>
                    <div className="col-sm me-2">
                        <img src="https://ngratesc.sirv.com/Tessany/2150916680.png" className="img-fluid rounded"/>
                    </div>
                </Marquee>
            </div>
            <div className=" row gap-3 align-items-center">
            <div className="col-sm text-center" >
                    <h1 className="display-1 text-center s_text">
                        Luxury
                        <br/>
                        <span className="p_font">Meets</span>
                        <br/>
                        EXCLUSIVITY
                    </h1>
                    <p>Indulge in a world where style and sophistication converge. At Secrets By Tess, we curate a selection of the finest accessories that embody elegance, exclusivity, and timeless appeal. Each piece in our collection is handpicked for those who appreciate the art of craftsmanship and the allure of rarity.</p>
                    <button className="s_btn btn ">Shop Now</button>
                </div>
                <div className="col-sm">
                    <img src="https://ngratesc.sirv.com/Tessany/2151693759%201.png" className="img-fluid  rounded"/>
                </div>
                
            </div>
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="text-center">
                <div className="mb-3">
                <h1 className="display-3  ">
                    Discover Our <span className="s_text"> Collection</span>
                </h1>
                <p>Explore our curated range of accessories, designed to elevate your everyday moments and special occasions alike. From exquisitely crafted jewelry to luxurious leather goods, each item is a testament to impeccable taste and unmatched quality.</p>
                </div>
               
                    <div className="row">   
                        <div className="col-sm">
                            <img src="https://ngratesc.sirv.com/Tessany/43014.png" className="img-fluid" />
                            <p>Jewellery</p>
                        </div>
                        <div className="col-sm">
                            <img src="https://ngratesc.sirv.com/Tessany/2150709519.png" className="img-fluid" />
                            <p>Handbags</p>
                        </div>
                        <div className="col-sm">
                            <img src="https://ngratesc.sirv.com/Tessany/2149241141.png" className="img-fluid" />
                            <p>Watches</p>
                        </div>
                        <div className="col-sm">
                            <img src="https://ngratesc.sirv.com/Tessany/14161.png" className="img-fluid" />
                            <p>Sunglasses</p>
                        </div>
                    </div>
                    <div>
                        <button className="btn s_btn">View More</button>
                    </div>
                </div>
               
            </div>
            <div className="mt-5 text-center">
                <h3 className="display-3 text-black">Join Our <span className="s_text">Elite</span> Circle</h3>
                <p>
                Become a part of our exclusive community and gain access to special previews, limited edition releases, and personalized recommendations.  We celebrate those who appreciate the finer things in life and offer them an experience that is both extraordinary and exclusive.
                </p>
                <iframe src="https://secretsbytessa.substack.com/embed"  style={{ background:"white"}} scrolling="no"></iframe>
            </div>
        </div>
    )
}

export default Home