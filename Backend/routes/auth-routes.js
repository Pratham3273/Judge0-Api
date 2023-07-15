const passport = require('passport');
const router = require('express').Router();

//auth check
router.get("/login/success", (req, res) => {
    // console.log(req);
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

//auth logout
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
})

//auth with google
router.get('/google',passport.authenticate('google',{
    scope : ['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google'),function(req,res){
    // res.send('hello');
    // console.log(req.body);
    res.redirect('http://localhost:3000/main');
    // res.send(req.user);
});

module.exports = router;