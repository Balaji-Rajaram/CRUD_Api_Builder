const userModel = require("../model/user")

    let create=(data)=>{
        return new Promise((resolve,reject)=>{
            userModel.findOne({"name":data.name})
            .then(res=>{
                if(res){
                    reject({"message":"Already exist"})
                }
                else{
                    const newObj = new userModel({
                        email:data.email,
password:data.password,
name:data.name,

                    })
                    newObj.save(err =>{
                        if(err){
                            reject(err)
                        }
                        else{
                            resolve(newObj)
                        }
                    })
                }
            })
            .catch(err=>{reject(err)})
        })
    }
    
    let update=(data)=>{
        return new Promise((resolve,reject)=>{
            userModel.findOne({"_id":data.id})
            .then(res=>{
                if(!res){
                    reject({"message":"Not found"})
                }
                else{
                    let updateQuery={}
    
                    if(data.email){
                        updateQuery={...updateQuery,email:data.email}
                    }
if(data.password){
                        updateQuery={...updateQuery,password:data.password}
                    }
if(data.name){
                        updateQuery={...updateQuery,name:data.name}
                    }

                    userModel.updateOne({"_id":data.id},updateQuery)
                    .then(res=>{resolve(res)})
                    .catch(err=>{reject(err)})
                }
            })
            .catch(err=>{reject(err)})
        })
    }
    
    
    let deleteObj =(id)=>{
        return new Promise((resolve,reject)=>{
            userModel.findOne({"_id":id})
            .then(res=>{
                if(res){
                    userModel.deleteOne({"_id":id})
                    .then(res=>{resolve(res)})
                    .catch(err=>{reject(err)})
                }
                else{
                    reject({"message":"Not found"})
                }
            })
            .catch(err=>{reject(err)})
        })
    }
    
    let view=()=>{
        return new Promise((resolve,reject)=>{
            userModel.find()
            .then(res=>{resolve(res)})
            .catch(err=>{reject(err)})
        })
    }
    module.exports = {
        create,
        view,
        update,
        deleteObj
    }