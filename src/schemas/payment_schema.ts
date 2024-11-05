interface ClientDetails{
    first_name:string,
    last_name:string,
    email:string,
    address:string,
    payment_method:"ecocash"|"netone"|"innbucks"
    payment_number:string
}

interface OrderDetails{
    item_id:number,
    quantity:number,
    item:string,
    unit_charge:number
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


export interface TransactionInterface{
    user_id: string,
    charged: number,
    item_id: number,
    address: string,
    phone_number: string,
    email: string,
    first_name:string,
    last_name:string
}