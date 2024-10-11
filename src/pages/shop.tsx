import { useEffect, useState } from "react"
import db from "../init/supabase"
import {toast} from "react-toastify"
import item_bg from "../components/item_bg"
// import ClampLines from "react-clamp-lines"
import NanoClamp from "nanoclamp"

export const Shop=()=>{
   

    const user_id = import.meta.env.VITE_USER_ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ categories,set_categories] = useState<Array<any>>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [items,set_items] = useState<Array<any>>([])
    const get_categories=async()=>{
        const {data, error} = await db.from("categories").select("*").eq("user_id", user_id) 
        if(error){
            return toast("Unknown Error")
        }else{
             set_categories(data)
        }
    }
    const get_data=async()=>{
        const {data, error} = await db.from("items").select("*").eq("user_id", user_id) 
        if(error){
            return toast("Unknown Error")
        }else{
             set_items(data)
        }
    }
    useEffect(()=>{
        get_categories()
        get_data()
    },[])
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
            {
                categories.map((i,index)=>{
                    return(
                        <button className="btn slider_btn" key={index}>{i.category}</button>
                    )
                })
            }
               
            </div>
            <div className="container-fluid">

            <div className="row gap-3 justify-content-center">
                {
                    items.map((i,index)=>{
                        const {data} = db.storage.from("images").getPublicUrl(i.image_id)
                        return(
                            <div key={index} className=" text-start card col-md-3 mb-4" >
                                <div style={item_bg(data.publicUrl)}>

                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <div>
                                        <span className="fw-bold">{i.item_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-success">${i.price.toFixed(2)}</span>
                                    </div>
                                    
                                </div>
                                <div className="mb-3">
                                   
                                    <NanoClamp
                                        is="p"
                                        lines={3}
                                        text={i.desccription}
                                    />
                                    {/* <ClampLines
                                        text={i.description}
                                        id={`meunique${index}`}
                                        lines={3}
                                        ellipsis="..."
                                       
                                        innerElement="p"
                                        stopPropagation={true}
                                    /> */}
                                        <span>{i.description}</span>
                                    </div>
                                    <div className="mb-2">
                                        <button className="btn btn-success w-100 ">Add To Cart</button>
                                    </div>
                            </div>
                        )
                    })
                }
            </div>
            </div>

        </div>
    )
}

export default Shop