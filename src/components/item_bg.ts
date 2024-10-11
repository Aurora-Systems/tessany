const item_bg =(img_url:string)=>{
    return(
        {
            backgroundImage:`url(${img_url})`,
            backgroundRepeat:"no-repeat",
            backgroundSize:"contain",
            backgroundPosition:"center",
            height:"30vh"
        }
    )
}

export default item_bg