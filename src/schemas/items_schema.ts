export interface ItemsResInterface{
    created_at:string,
    item_name:string,
    in_stock:number,
    price:number,
    category_id:number,
    user_id:string,
    image_id:string,
    description:string
}

export const items_res_default:ItemsResInterface = {
    created_at:"",
    item_name:"",
    in_stock:0,
    price:0,
    category_id:0,
    user_id:"",
    image_id:"",
    description:""
}