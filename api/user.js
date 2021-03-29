const router = require('express').Router();
const helper = require('../helper/folderAction')
const bcrypt = require('bcryptjs');
const path = require('path')
const fs = require('fs-extra');
const saltRound = 10

router.post('/', (req,res) => {
    let pass = bcrypt.hashSync(req.body.password,saltRound)
    
    let dir='./data/'+req.body.name
    let userDetails={
        name:req.body.name,
        email:req.body.email,
        password:pass
    }
    
    helper.createFolder(dir)
    .then(data=>{
        fs.writeFile(dir+'/user.json',JSON.stringify(userDetails))
        res.redirect('/login')
    })
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
});

router.put('/', (req,res) => {
    let param={
        oldDir:'./data/'+req.body.oldName,
        newDir:'./data/'+req.body.newName
    }
    helper.updateFolder(param)
    .then(data=>{res.status(200).json({'status':true,'data':'user updated successfully'})})
    .catch(err=>{
        if(err.code=='ENOENT'){
            res.status(404).json({'status':false,'data':'not exist'})
        }
        else{
            res.status(400).json({'status':false,'data':err})
        }
    })
});


router.delete('/', (req,res) => {
    let dir='./data/'+req.body.name
    helper.deleteFolder(dir)
    .then(data=>{res.status(200).json({'status':true,'data':'user deleted successfully'})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
})

router.get('/', (req,res) => {
    let dir='./data/'
    helper.getFolder(dir)
    .then(data=>{res.status(200).json({'status':true,'data':data})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
})

module.exports=router;