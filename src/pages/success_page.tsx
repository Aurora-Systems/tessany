import  {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Success=()=>{
    const nav = useNavigate()
    const [transaction_id,set_transaction_id]=useState<string|null>(null)

    useEffect(() => {
        const url = new URLSearchParams(window.location.search).get("transaction_id");
        set_transaction_id(url)
    }, []);
    return(
        <div className={"d-flex justify-content-center align-items-center"} style={{height:"80vh"}}>
            <div className={"text-center"}>
                <img src={"https://ngratesc.sirv.com/Tessany/success.png"}/>
                <h1>Purchase Success</h1>
                <p>We sent your receipt to your email with Transaction ID {transaction_id}</p>
                <button className={"btn s_btn"} onClick={()=>nav("/shop")}>Back To Shopping</button>
            </div>
            </div>
    )
}

export default Success;