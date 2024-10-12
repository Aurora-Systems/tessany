interface ClientDetails{
    first_name:string,
    last_name:string,
    email:string,
    address:string,
    payment_method:"ecocash"|"netone"|"innbucks"
    payment_number:string
}

interface OrderDetails{
    quantity:number,
    item:string,
    charge:number
}

export interface PaymentDataInterface{
    client_details:ClientDetails,
    order_details:OrderDetails[]
}

export const payment_data_default:PaymentDataInterface={
    client_details:{
        first_name:"",
        last_name:"",
        email:"",
        address:"",
        payment_method:"ecocash",
        payment_number:""
    },
    order_details:[]
}