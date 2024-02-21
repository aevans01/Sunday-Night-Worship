function AdminError(){
    return(
        <>
            <div>You Need Admin Permissions To Access This Page.</div>
            <div>If you are an Admin Please <a href="Login-Admin">Log In here</a>.</div>
        </>
    )
}

export default AdminError;