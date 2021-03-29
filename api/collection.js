const router = require('express').Router();
const helper = require('../helper/fileAction')


router.post('/', (req,res) => {
    let dir='./data/'+req.body.name+'/'+req.body.workspaceName+'/'+req.body.collectionName+'.json'
    
    helper.createFile(dir)
    .then(data=>{res.status(200).json({'status':true,'data':'collecction created successfully'})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
});

router.put('/', (req,res) => {
    let param={
        dir:'./data/'+req.body.name+'/'+req.body.workspaceName+'/'+req.body.collection+'.json',
        content:req.body.content
    }
    helper.updateFile(param)
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
    let dir='./data/'+req.body.name+'/'+req.body.workspaceName+'/'+req.body.collectionName+'.json'
    helper.deleteFile(dir)
    .then(data=>{res.status(200).json({'status':true,'data':'collection deleted successfully'})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
})

router.get('/:name/:workspace', (req,res) => {
    let dir='./data/'+req.params.name+'/'+req.params.workspace
    helper.getFile(dir)
    .then(data=>{res.status(200).json({'status':true,'data':data})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
})

router.get('/:name/:workspace/:collection', (req,res) => {
    let dir='./data/'+req.params.name+'/'+req.params.workspace+'/'+req.params.collection+'.json'
    helper.readCollection(dir)
    .then(data=>{res.status(200).json({'status':true,'data':JSON.parse(data)})})
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
})

module.exports=router;