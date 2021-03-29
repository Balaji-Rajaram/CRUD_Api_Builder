const router = require('express').Router();
const path = require("path"); 
const { userLogin } = require('../helper/auth')

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/crudApiBuilder', (req, res) => {
    let data={
        'name':req.body.name,
        'password':req.body.password
    }
    if(req.body.name || req.body.password){
        
        userLogin(data)
        .then(r=>{
            res.render('hero',{userName:r.name})
        })
        .catch(err=>{
            console.log(err)
            res.redirect('/login')
        })
    }
    else{
        res.redirect('/login')
    }
})


router.get('/hero', (req, res) => {
    res.sendFile(path.join(__dirname, "/../public/hero.html"));
});

module.exports=router;