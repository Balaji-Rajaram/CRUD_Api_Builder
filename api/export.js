const router = require('express').Router();
const helper = require('../helper/export')

router.get('/:name/:workspace',  async (req,res) => {
    let dirData={
        userDir:'./data/'+req.params.name,
        workspace:req.params.workspace
    }
    await helper.exportFile(dirData)
    .then(data=>{
        res.status(200).json({'status':true,})
    })
    .catch(err=>{res.status(500).json({'status':false,'data':err.message})})
    
});

router.get('/download/:name/:workspace',  async (req,res) => {
    let result=await helper.convertRar('./data/'+req.params.name+'/'+'export/'+req.params.workspace,'./data/'+req.params.name+'/'+'export/'+req.params.workspace+'.zip')
    if(result){
        res.download('./data/'+req.params.name+'/export/'+req.params.workspace+'.zip') 
    }
    else{
        res.status(500).json({'status':false,'data':false})
    }
});

module.exports=router;