export const Contact=()=>{
    return(
        <div className="container-fluid mb-3">
            <div className="text-center">
                <h1 className="display-1 text-black">Contact <span className="s_text">Us</span></h1>
            </div>
            <div className="row">
                <div className="col-sm">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.3784202305665!2d31.036482474018978!3d-17.820886783142036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a50162d13f77%3A0x7396e7431c66f8a0!2s8%20Baines%20Ave%2C%20Harare!5e0!3m2!1sen!2szw!4v1725898112930!5m2!1sen!2szw"  className="w-100 h-100"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="col-sm">
                    <form>
                        <div className="mb-3">
                            <span>Name</span>
                            <input className="form-control" />
                        </div>
                        <div className="mb-3">
                            <span>Email</span>
                            <input className="form-control" />
                        </div>
                        <div className="mb-3">
                            <span>Contact Number</span>
                            <input className="form-control" />
                        </div>
                        <div className="mb-3">
                            <span>Your Message</span>
                            <textarea className="form-control" />
                        </div>
                        <div className="mb-3">
                            <button className="btn s_btn">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact