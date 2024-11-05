import { FormEvent, useEffect, useState } from "react"
import db from "../init/supabase"
import {toast} from "react-toastify"
import item_bg from "../components/item_bg"
import ClampLines from "react-clamp-lines"
import { Modal, Spinner } from "react-bootstrap"
import { CategoriesResInterface } from "../schemas/categories_schema"
import { items_res_default, ItemsResInterface } from "../schemas/items_schema"
import checkout_bg from "../components/checkout_bg"
import { payment_data_default, PaymentDataInterface, TransactionInterface } from "../schemas/payment_schema"
import { public_key, server_url, service_id, template_id, user_id } from "../db/keys"
import axios from "axios"
import Countdown from "react-countdown"
import emailjs from "@emailjs/browser"

export const Shop=()=>{
    
    const [categories,set_categories] = useState<Array<CategoriesResInterface>>([])
    const [items,set_items] = useState<Array<ItemsResInterface>>([])
    const [show_checkout,set_show_checkout] = useState<boolean>(false)
    const [selected_item,set_selected_item] = useState<ItemsResInterface>(items_res_default)
    const [pay_data,set_pay_data] = useState<PaymentDataInterface>(payment_data_default)
    const [quanity_order,set_quanity_order] = useState<number>(1)
    const [total_charge,set_total_charge] = useState<number>(0)
    const [tax_charge,set_tax_charge] = useState<number>(0)
    const [show_transaction,set_show_transaction] = useState<boolean>(false)
    const [payment_loading,set_payment_loading] = useState<boolean>(false)
    const [poll,set_poll] = useState<string>("")
    const [restart_countdown,set_restart_countdown] = useState<number>(0)
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
    const handle_payment= (e:FormEvent)=>{
        e.preventDefault()
        set_payment_loading(true)
        const checkout_data:PaymentDataInterface = {...pay_data, order_details:[{item_id:selected_item.id, item: selected_item.item_name, unit_charge:selected_item.price,quantity:quanity_order},{item:"Tax 15%", unit_charge:tax_charge,quantity:1}]}
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
        .then(data => {
            set_show_transaction(true)    
            set_poll(data.data.pollUrl as string)        
                
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

    const check_paid=({seconds, completed})=>{
        if(completed){
            axios.post(`${server_url}/payments/check_status`,{poll_url:poll}).then(res=>{
                if(res.status==200){
                    console.log(res.data)
                    if(res.data.status==="paid"||res.data.status==="awaiting delivery"||res.data.status==="Delivered"){
                        const transaction_data:TransactionInterface = {
                            first_name: pay_data.client_details.first_name,
                            last_name: pay_data.client_details.last_name,
                            charged: total_charge,
                            email: pay_data.client_details.email,
                            phone_number: pay_data.client_details.payment_number,
                            user_id: user_id,
                            address: pay_data.client_details.address,
                            item_id: selected_item.id
                        }
                        db.from("transactions").insert({
                            ...transaction_data
                        }).then(res=>{
                            emailjs.send(service_id, template_id, {...transaction_data}, {
                                publicKey:public_key
                            }).then(eres=>{
                                console.log(eres)
                            }).catch(eerr=>{
                                console.log(eerr)
                            }).finally(()=>{
                                toast("Transaction successfull!")
                            })
                        })
                    }else if(res.data.status==="sent"||res.data.status==="created"){
                        set_restart_countdown((prev)=>prev+1)
                    }
                }else{
                   throw new Error("Failed to get payment status")
                }
            }).catch(err=>{
                console.log(err)
                toast("Failed to get payment status")
                set_show_transaction(false)
            })
            return(
                "Checking..."
            )
          
        }else{
            return(
                <div className="text-center">
                <p>Waiting for transaction to go through</p>
                <p>Checking in</p>
                <h1 className="mb-2">{seconds} s </h1>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-success gen_btn">Check Now</button>
                    <button className="btn btn-outline-danger gen_btn" onClick={()=>set_show_transaction(false)}>Cancel</button>
                </div>
                </div>
            )
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
                                        {/* <button className="btn btn-success w-100"> <i className="bi bi-eye"></i> View</button> */}
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
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                onChange={(e:any)=>set_pay_data({...pay_data, client_details:{...pay_data.client_details, payment_method:e.target.value}})}
                                            />
                                            <span className="form-check-label">One Money</span>

                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <span>Payment Mobile Number</span>
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
                                <Countdown 
                                    key={restart_countdown}
                                    date={Date.now()+10000}
                                    renderer={check_paid}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                
        </div>
    )
}

export default Shop