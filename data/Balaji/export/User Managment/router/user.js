const router = require('express').Router();
    const helper = require('../helper/user')
    
    router.post('/', (req,res) =>{
        const data={
            email:req.body.email,
password:req.body.password,
name:req.body.name,

        }
        helper.create(data)
        .then(r => res.status(201).json({"status":true,"data":"Inserted Successfully"}))
        .catch(err => {
            if(err.code==11000){
                res.status(409).json({"status":false,"message":"Exist"})
            }
            else{
                res.status(500).json({"status":false,"message":err.message})
            }
        })
    })
    
    
    router.put('/', (req,res) =>{
        const data={
            id:req.body.id,
            email:req.body.email,
password:req.body.password,
name:req.body.name,

        }
        helper.update(data)
        .then(r =>{
            if(r.nModified){
                res.status(200).json({"status":true})
            }else{
                if(r.n){
                    res.status(304).json({"status":false,"message":'not Modified'})
                }
                else{
                    res.status(404).json({"status":false,"message":'not found'})
                }
            } 
        })        
        .catch(err => {  
                res.status(500).json({"status":false,"message":err.message})
        })
    })
    
    router.delete('/',(req,res)=>{
        helper.deleteObj(req.body.id)
        .then(r =>{
            if(r.deletedCount){
                res.status(200).json({"status":true})
            }else{
                if(r.n){
                    res.status(204).json({"status":false,"message":'not match'})
                }
                else{
                    res.status(404).json({"status":false,"message":'not found'})
                }
            } 
        })             
        .catch(err => {
                res.status(500).json({"status":false,"message":err})
        })
    })
    
    
    router.get("/",(req,res)=>{
        helper.view()
        .then(r=>res.status(200).json({"status":true,"data":r}))
        .catch(err=>res.status(500).json({"status":false,"data":err.message}))
    })
    
    module.exports=router