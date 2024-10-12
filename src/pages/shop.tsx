import { useEffect, useState } from "react"
import db from "../init/supabase"
import {toast} from "react-toastify"
import item_bg from "../components/item_bg"
import ClampLines from "react-clamp-lines"
import { Modal } from "react-bootstrap"
import { CategoriesResInterface } from "../schemas/categories_schema"
import { items_res_default, ItemsResInterface } from "../schemas/items_schema"
import checkout_bg from "../components/checkout_bg"
import { payment_data_default, PaymentDataInterface } from "../schemas/payment_schema"
export const Shop=()=>{
   

    const user_id = import.meta.env.VITE_USER_ID
    const [categories,set_categories] = useState<Array<CategoriesResInterface>>([])
    const [items,set_items] = useState<Array<ItemsResInterface>>([])
    const [show_checkout,set_show_checkout] = useState<boolean>(false)
    const [selected_item,set_selected_item] = useState<ItemsResInterface>(items_res_default)
    const [pay_data,set_pay_data] = useState<PaymentDataInterface>(payment_data_default)
    const [quanity_order,set_quanity_order] = useState<number>(1)
    const [total_charge,set_total_charge] = useState<number>(0)
    const [tax_charge,set_tax_charge] = useState<number>(0)
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

    const cleanup_checkout=()=>{
        set_selected_item(items_res_default)
        set_show_checkout(false)
    }

    const update_quantity_order=(quant_method:"-"|"+")=>{
        if(quant_method==="+"){
            if((quanity_order+1)<=selected_item.in_stock){
                const total = selected_item.price*(quanity_order+1)
                set_total_charge(total)
                set_tax_charge(((total/100)*15))
                set_quanity_order(prev=>prev+1)
            }else{
                toast("Can't order more")
            }
        }

        if(quant_method==="-"){
            if((quanity_order-1)>0){
                const total = selected_item.price*(quanity_order-1)
                set_total_charge(total)
                set_tax_charge(((total/100)*15))
                set_quanity_order(prev=>prev-1)
            }else{
                toast("⚠️ Minimum order of 1")
            }
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
            <div className="d-flex flex-row flex-nowrap gap-3 p-4 slider_container mb-3" >
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
                        let stock_message=<></>;
                        if(i.in_stock < 5 && i.in_stock !== 0){
                            stock_message = <span className="text-warning">Limited stock - {i.in_stock} Left</span>
                        }else if(i.in_stock>5){
                            stock_message = <span className="text-success">In Stock</span>
                        }else{
                            stock_message = <span className="text-danger">Out of stock - custom orders only</span>
                        }
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
                                   <div style={{height:"10vh"}}>
                                   <ClampLines
                                        text={i.description}
                                        id={`meunique${index}`}
                                        lines={3}
                                        ellipsis="..."
                                        buttons={false}
                                        innerElement="p"
                                        stopPropagation={true}
                                    /> 
                                   </div>
                                  
                                  
                                    
                                    </div>
                                    <div className="mb-2">
                                    {stock_message}
                                   </div>
                                    <div className="mb-2 d-flex gap-2">
                                        <button className="btn btn-success w-100"> <i className="bi bi-eye"></i> View</button>
                                        <button className="btn btn-success w-100 " onClick={()=>{
                                            set_total_charge(i.price)
                                            set_tax_charge(((i.price/100)*15))
                                            set_show_checkout(true)
                                            set_selected_item(i)
                                        }}><i className="bi bi-cart-check"></i> Checkout</button>
                                    </div>
                            </div>
                        )
                    })
                }
            </div>
            </div>
                <Modal fullscreen show={show_checkout}>
                    <Modal.Body>
                        <div className="d-flex justify-content-end mb-3">
                            <button 
                                className="btn  btn-none"
                                onClick={()=>cleanup_checkout()} 
                            >
                                    <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <h5>Order Summary</h5>
                                <div className="d-flex flex-row gap-3 ">
                                    <div className=" border rounded" style={checkout_bg(db.storage.from("images").getPublicUrl(selected_item.image_id).data.publicUrl)}>
                                        
                                    </div>
                                    <div className="col-sm w-100">
                                        <div className="mb-2">
                                            <span className="fw-bold mb-3">{selected_item.item_name}</span>
                                        </div > 
                                        <span>Quantity Order</span>
                                        <div className="bg-light mt-1 d-flex justify-content-between align-items-center">
                                            <button className="btn btn-outline-danger" onClick={()=>update_quantity_order("-")}><i className="bi bi-dash"></i></button>
                                            <span>{quanity_order}</span>
                                            <button className="btn btn-outline-success" onClick={()=>update_quantity_order("+")}><i className="bi bi-plus"></i></button>
                                        </div>

                                    </div>
                                   
                                </div>
                                <div>
                                    <div className="mt-3 bg-light rounded">
                                        <table className="table">
                                            <tr className="">
                                                <td>Sub Total</td>
                                                <td className="text-end">{total_charge.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Tax 15%</td>
                                                <td className="text-end">{tax_charge.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td className="fw-bold">Total Due</td>
                                                <td className="fw-bold text-end">${(total_charge+tax_charge).toFixed(2)}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div>
                                    <p><small> Note Delivery Fees are not included in the charge. A seperate email/ whatsapp message will be sent. Items are available for pickup or $0.50/km from Harare CBD</small></p>
                                </div>
                                <div>

                                </div>
                            </div>
                            <div className="col-sm">
                                <h5>Payment Details</h5>
                                <form >
                                        <div className="mb-2">
                                            <span>First Name</span>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                required
                                                onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, first_name:e.target.value}})}
                                            />
                                        </div>
                                        <div className="mb-2" >
                                            <span>Last Name</span>
                                            <input 
                                                type="text" 
                                                className="form-control"
                                                onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, last_name:e.target.value}})}    
                                            />
                                        </div>
                                        <div className="mb-2" >
                                            <span>Email</span>
                                            <input 
                                                type="email" 
                                                className="form-control"
                                                onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, email:e.target.value}})}    
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <span>Address</span>
                                            <textarea className="form-control" onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, address:e.target.value}})}/>
                                        </div>
                                        <div className="mb-2">
                                            <span>Payment Method</span>
                                            <div className="form-check">
                                            <input 
                                                required 
                                                type="radio" 
                                                value={"ecocash"}  
                                                className="form-check-input" 
                                                name="payment_method"
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                onChange={(e:any)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, payment_method:e.target.value}})}    
                                            />
                                            <span className="form-check-label">Ecocash</span>

                                            </div>
                                            <div className="form-check">
                                            <input 
                                                required 
                                                type="radio" 
                                                value={"onemoney"} 
                                                className="form-check-input" 
                                                name="payment_method"
                                                onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, first_name:e.target.value}})}
                                            />
                                            <span className="form-check-label">One Money</span>

                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <span>Payment Mobile Number</span>
                                            <input type="tel" minLength={10} maxLength={10} className="form-control" onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details,payment_number:e.target.value}})}/>
                                        </div>
                                        <div>
                                            <button type="submit" className="w-100 btn btn-success">Pay</button>
                                        </div>
                                    
                                </form>
                                
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
        </div>
    )
}

export default Shop