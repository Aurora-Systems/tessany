import { FormEvent, useEffect, useState } from "react"
import db from "../init/supabase"
import {toast} from "react-toastify"
import item_bg from "../components/item_bg"
import ClampLines from "react-clamp-lines"
import { Modal, Spinner } from "react-bootstrap"
import { items_res_default, ItemsResInterface } from "../schemas/items_schema"
import { payment_data_default, PaymentDataInterface,  } from "../schemas/payment_schema"
import {  server_url, user_id } from "../db/keys"


export const Shop=()=>{
    
    // const [categories,set_categories] = useState<Array<CategoriesResInterface>>([])
    const [items,set_items] = useState<Array<ItemsResInterface>>([])
    const [show_checkout,set_show_checkout] = useState<boolean>(false)
    const [selected_item,set_selected_item] = useState<ItemsResInterface>(items_res_default)
    const [pay_data,set_pay_data] = useState<PaymentDataInterface>(payment_data_default)
    const [quanity_order,set_quanity_order] = useState<number>(1)
    const [total_charge,set_total_charge] = useState<number>(0)
    const [tax_charge,set_tax_charge] = useState<number>(0)
    const [show_transaction,set_show_transaction] = useState<boolean>(false)
    const [payment_loading,set_payment_loading] = useState<boolean>(false)
    const [cart,set_cart] = useState<Array<{id:number,items:ItemsResInterface[]}>>([])
    const get_categories=async()=>{
        const {error} = await db.from("categories").select("*").eq("user_id", user_id)
        if(error){
            return toast("Unknown Error")
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

    const update_quantity_order=(quant_method:"-"|"+", item_id:number)=>{
        if(quant_method==="+"){
            const without_item = cart.filter((i)=>i.id!==item_id)
            const with_item = cart.filter((i)=>i.id===item_id)
            with_item[0].items.push(with_item[0].items[0])
            set_cart([...with_item,...without_item])
        }else{
            const without_item = cart.filter((i)=>i.id!==item_id)
            const with_item = cart.filter((i)=>i.id===item_id)
            if(with_item[0].items.length===1){
                return toast("⚠️ Minimum order of 1")
            }else{
                const new_data = {id:item_id,items:with_item[0].items.slice(0,-1)}
                set_cart([...without_item,new_data])
            }
        }


    }
    const handle_payment= (e:FormEvent)=>{
        e.preventDefault()
        set_payment_loading(true)
        const checkout_data:PaymentDataInterface = {...pay_data, order_details:[{item_id:selected_item.id, item: selected_item.item_name, unit_charge:selected_item.price,quantity:quanity_order}]}
        const payment_data = {
            items:checkout_data.order_details,
            mobile_number:checkout_data.client_details.payment_number,
            payment_method:checkout_data.client_details.payment_method
        } 

        fetch(`${server_url}/payments/initiate_payment/mobile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment_data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            set_show_transaction(true)    

        })
        .catch(error => {
            console.error('Error initiating payment:', error);
        }).finally(()=>{
            set_payment_loading(false)
        })

        
        // axios.post(`${server_url}/payments/initiate_payment/mobile`,{...payment_data},{
        //     headers:{
        //         "Content-Type":"application/json"
        //     }
        // }).then(res=>{
        //     console.log(res)
        // }).catch(err=>{
        //     console.log(err)
        // })
    }

    const add_to_cart=(item:ItemsResInterface)=>{
        const exists = cart.filter(i=>i.id===item.id)
        const without = cart.filter(i=>i.id!==item.id)
        if(exists.length>0){
            return toast(`⚠️ ${item.item_name} already added to cart!`)
        }else{
            const data = {id:item.id,items:[item]}
            set_cart([...without,data])
            return toast(`✅ ${item.item_name} added to cart!`)
        }
    }

    const delete_from_cart=(item_id:number)=>{
        const remove_item = cart.filter((i)=>i.id!==item_id)
        set_cart([...remove_item])
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
            {/*<div className="d-flex flex-row flex-nowrap gap-3 p-4 slider_container mb-3" >*/}
            {/*{*/}
            {/*    categories.map((i,index)=>{*/}
            {/*        return(*/}
            {/*            <button className="btn slider_btn" key={index}>{i.category}</button>*/}
            {/*        )*/}
            {/*    })*/}
            {/*}*/}
            {/*   */}
            {/*</div>*/}
           


           
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
                                        <button className="btn btn-success w-100 " onClick={()=>add_to_cart(i)}>
                                            <i className="bi bi-cart-plus"></i>
                                            Add to Cart
                                        </button>
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
                                {cart?.sort((a,b)=>a.id-b.id).map((i)=>{
                                    const total_cost = i.items.reduce((total,item)=>total+item.price,0)
                                    return(
                                        <div>
                                <div className="d-flex flex-row gap-3 mb-2" key={i.id}>

                                    <div className=" " >
                                        <img
                                            width={"70px"}
                                            src={db.storage.from("images").getPublicUrl(i.items[0].image_id).data.publicUrl}
                                            className={"pt-1 rounded"}
                                            onError={(e)=>e.currentTarget.src="https://ngratesc.sirv.com/store_manager/img_placeholder.png"}
                                        />
                                    </div>
                                    <div className="col-sm w-100">
                                        <div className=" d-flex justify-content-between">
                                            <span className="fw-bold mb-1">{i.items[0].item_name}</span>
                                            <span>${total_cost.toFixed(2)}</span>
                                        </div > 
                                        <div className="bg-light mt-1 d-flex justify-content-between align-items-center">
                                            <button className="btn btn-outline-dark" onClick={()=>update_quantity_order("-", i.id)}><i className="bi bi-dash"></i></button>
                                            <span>{i.items.length}</span>
                                            <button className="btn btn-outline-dark" onClick={()=>update_quantity_order("+", i.id)}><i className="bi bi-plus"></i></button>
                                        </div>

                                    </div>
                                    <div>
                                        <button
                                            className={"btn   pb-1"}
                                            onClick={() => delete_from_cart(i.id)}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                   
                                </div>
                                            <hr/>
                                        </div>
                                    )
                                })
                                }
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
                                <form onSubmit={handle_payment}>
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
                                                required
                                                onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, last_name:e.target.value}})}    
                                            />
                                        </div>
                                        <div className="mb-2" >
                                            <span>Email</span>
                                            <input 
                                                type="email" 
                                                className="form-control"
                                                required
                                                onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, email:e.target.value}})}    
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <span>Address</span>
                                            <textarea 
                                                className="form-control" 
                                                onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, address:e.target.value}})}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <span>Mobile Number</span>
                                            <input type="tel" minLength={10} maxLength={10} className="form-control" onChange={(e)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details,payment_number:e.target.value}})}/>
                                        </div>
                                        <div>
                                            <button type="submit" className="w-100 btn btn-success" disabled={payment_loading}>{payment_loading?<Spinner variant="light" size="sm"/>:"Pay"}</button>
                                        </div>
                                    
                                </form>
                                
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={show_transaction} fullscreen>
                    <Modal.Body>
                        <div className="vh-100 d-flex align-items-center justify-content-center">
                            <div>

                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            <button className={"float_btn rounded-pill btn btn-success"} onClick={()=>set_show_checkout(true)}><i className="bi bi-cart"></i> View Cart</button>
        </div>
    )
}

export default Shop