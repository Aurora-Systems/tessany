const checkout_bg =(img_url:string)=>{
    return(
        {
            backgroundImage:`url(${img_url})`,
            backgroundRepeat:"no-repeat",
            backgroundSize:"contain",
            backgroundPosition:"center",
            width:"40%"
        }
    )
}

export default checkout_bg