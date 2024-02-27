function AdminError(){
    return(
        <div className='hat'>
            <div>You Need Admin Permissions To Access This Page.</div>
            <div>If you are an Admin Please <a href="Login-Admin">Log In here</a>.</div>
        </div>
    )
}

export default AdminError;