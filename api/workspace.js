const router = require('express').Router();
const helper = require('../helper/folderAction')


router.post('/', (req,res) => {
    let dir='./data/'+req.body.name+'/'+req.body.workspaceName
    
    helper.createFolder(dir)
    .then(data=>{res.status(200).json({'status':true,'data':'workspace created successfully'})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
});

router.put('/', (req,res) => {
    let param={
        oldDir:'./data/'+req.body.name+'/'+req.body.oldWorkspaceName,
        newDir:'./data/'+req.body.name+'/'+req.body.newWorkspaceName
    }
    helper.updateFolder(param)
    .then(data=>{res.status(200).json({'status':true,'data':'workspace updated successfully'})})
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
    let dir='./data/'+req.body.name+'/'+req.body.workspaceName
    helper.deleteFolder(dir)
    .then(data=>{res.status(200).json({'status':true,'data':'workspace deleted successfully'})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
})

router.get('/:name', (req,res) => {
    let dir='./data/'+req.params.name+'/'
    helper.getFolder(dir)
    .then(data=>{res.status(200).json({'status':true,'data':data})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
})

module.exports=router;