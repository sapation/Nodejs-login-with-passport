
const authenticated = (req, res, next) =>{
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resources');
    res.redirect('/users/login')
}

export default authenticated;