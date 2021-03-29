const fs = require('fs-extra')
const zipFolder = require('zip-folder')

let exportFile=async (params)=>{
        let dir = params.userDir+'/'+params.workspace
        await fs.pathExists(dir)
        .then(exists => {
            if(exists){
                fs.readdir(dir)
                .then(async(data) => {
                    await writeNodeJsCode(params,data)
                    .then((data) => {
                        return true
                    })
                    .catch(err => {
                        throw err
                    })
                })
                .catch(err => {
                    throw err
                })
            }
            else{
                throw ({'message':'not exist'})
            }
        })

}

async function writeNodeJsCode(params,data){
    console.log(data);
        await fs.mkdirs(params.userDir+'/'+'export/'+params.workspace+'/model')
        .then(()=>{
            data.forEach(element => {
                let fileName=element.split('.json')[0]
                fs.readFile(params.userDir+'/'+params.workspace+'/'+element)
                .then(async(r)=>{
                    console.log(JSON.parse(r))
                    await createModel(params.userDir+'/'+'export/'+params.workspace+'/model/'+fileName+'.js',fileName,JSON.parse(r))
                })
                .catch(err=>{console.log(err)})
            });
        })
        .catch(err=>{console.log(err)})

        await fs.mkdirs(params.userDir+'/'+'export/'+params.workspace+'/helper')
        .then(()=>{
            data.forEach(element => {
                let fileName=element.split('.json')[0]
                fs.readFile(params.userDir+'/'+params.workspace+'/'+element)
                .then(async(r)=>{
                    console.log(JSON.parse(r))
                    await createHelper(params.userDir+'/'+'export/'+params.workspace+'/helper/'+fileName+'.js',fileName,helperCreateObj(JSON.parse(r)),helperUpdateObj(JSON.parse(r)))
                })
                .catch(err=>{console.log(err)})
            });
        })
        .catch(err=>{console.log(err)})

        await fs.mkdirs(params.userDir+'/'+'export/'+params.workspace+'/router')
        .then(()=>{
            data.forEach(element => {
                let fileName=element.split('.json')[0]
                fs.readFile(params.userDir+'/'+params.workspace+'/'+element)
                .then(async(r)=>{
                    console.log(JSON.parse(r))
                    await createRouter(params.userDir+'/'+'export/'+params.workspace+'/router/'+fileName+'.js',fileName,routerDataObj(JSON.parse(r)))
                })
                .catch(err=>{console.log(err)})
            });
        })
        .catch(err=>{console.log(err)})

        await fs.mkdirs(params.userDir+'/'+'export/'+params.workspace+'/config')
        .then(async ()=>{
            await createConfig(params.userDir+'/'+'export/'+params.workspace+'/config/config.json')
        })
        .catch(err=>{console.log(err)})

        await createServer(params.userDir+'/'+'export/'+params.workspace+'/server.js',importFiles(data),useFiles(data))

        await createPackageFile(params.userDir+'/'+'export/'+params.workspace+'/package.json',params.workspace)

        
        return

}


function createModel(dir,fileName,jsonData){
    jsonData=JSON.stringify(jsonData)
    fs.writeFile(dir, 
    `const mongoose = require("mongoose");
    mongoose.set('useCreateIndex', true);    
    // Create Schema
    const ${fileName}Schema = new mongoose.Schema(
        ${jsonData}
    ,
    {timestamps:true}
    );
    module.exports = mongoose.model("${fileName}", ${fileName}Schema);`, function(err) {
        if(err) {
            return (err);
        }
        return;
    }); 
}

function createHelper(dir,fileName,createObj,updateObj){
    fs.writeFile(dir, 
    `const ${fileName}Model = require("../model/${fileName}")

    let create=(data)=>{
        return new Promise((resolve,reject)=>{
            ${fileName}Model.findOne({"name":data.name})
            .then(res=>{
                if(res){
                    reject({"message":"Already exist"})
                }
                else{
                    const newObj = new ${fileName}Model({
                        ${createObj}
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
            ${fileName}Model.findOne({"_id":data.id})
            .then(res=>{
                if(!res){
                    reject({"message":"Not found"})
                }
                else{
                    let updateQuery={}
    
                    ${updateObj}
                    ${fileName}Model.updateOne({"_id":data.id},updateQuery)
                    .then(res=>{resolve(res)})
                    .catch(err=>{reject(err)})
                }
            })
            .catch(err=>{reject(err)})
        })
    }
    
    
    let deleteObj =(id)=>{
        return new Promise((resolve,reject)=>{
            ${fileName}Model.findOne({"_id":id})
            .then(res=>{
                if(res){
                    ${fileName}Model.deleteOne({"_id":id})
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
            ${fileName}Model.find()
            .then(res=>{resolve(res)})
            .catch(err=>{reject(err)})
        })
    }
    module.exports = {
        create,
        view,
        update,
        deleteObj
    }`, function(err) {
        if(err) {
            return (err);
        }
        return;
    }); 
}

function createRouter(dir,fileName,dataObj){
    fs.writeFile(dir, 
    `const router = require('express').Router();
    const helper = require('../helper/${fileName}')
    
    router.post('/', (req,res) =>{
        const data={
            ${dataObj}
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
            ${dataObj}
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
    
    module.exports=router`, function(err) {
        if(err) {
            return (err);
        }
        return;
    }); 
}

function createServer(dir,importFiles,useFiles){
    fs.writeFile(dir, 
        `const express = require("express");
const path = require("path"); 
const mongoose = require("mongoose");
const config = require("./config/config.json");

const PORT = 3000
const app = express();   
const MONGO_URI = config.MONGODB_URI;

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true,useUnifiedTopology: true  })
    .then(console.log('MongoDB connected' + MONGO_URI))
    .catch(err => console.log(err));
${importFiles}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

${useFiles}    

app.listen(PORT,()=>{console.log('app listening on port' + PORT)})`, function(err) {
            if(err) {
                return err
            }
            return
        }); 
    
}


function createConfig(dir){
    fs.writeFile(dir, 
        `{"MONGODB_URI":"your db string here"}`, function(err) {
            if(err) {
                return (err);
            }
            return;
        }); 
    
}


function createPackageFile(dir,fileName) {
    fs.writeFile(dir, 
    `{
"name": "${fileName}",
"version": "1.0.0",
"description": "",
"main": "server.js",
"scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "start": "node server.js"
},
"author": "",
"license": "ISC",
"dependencies": {
    "express": "^4.17.1",
    "mongoose": "^5.11.8",
    "nodemon": "^2.0.6"
}
}`, function(err) {
            if(err) {
                return (err);
            }
            return;
        }); 
}

function helperCreateObj(jsonObj){
    let key=Object.keys(jsonObj)
    let query=''
    key.forEach(function(item){
        query=query+`${item}:data.${item},\n`
    })
    return(query)
}

function helperUpdateObj(jsonObj){
    let key=Object.keys(jsonObj)
    let query=''
    key.forEach(function(item){
        query=query+`if(data.${item}){
                        updateQuery={...updateQuery,${item}:data.${item}}
                    }\n`
    })
    return(query)
}

function routerDataObj(jsonObj){
    let key=Object.keys(jsonObj)
    let query=''
    key.forEach(function(item){
        query=query+`${item}:req.body.${item},\n`
    })
    return(query)
}

function importFiles(fileArray){
    let importFileString=``
    fileArray.forEach(element => {
        let fileLabel=element.split('.')[0]
        importFileString=importFileString+`const ${fileLabel} = require('./router/${fileLabel}')`
    });
    return(importFileString)
}

function useFiles(fileArray){
    let importFileString=``
    fileArray.forEach(element => {
        let fileLabel=element.split('.')[0]
        importFileString=importFileString+`app.use('/api/${fileLabel}',${fileLabel})`
    });
    return(importFileString)
}

async function convertRar(src,dist){
    return new Promise((resolve,reject)=>{
        zipFolder(src,dist,async function(err) {
            if(err) {
                reject(err)
            } else {
                resolve(true)
            }
        });
    })
}

module.exports={
    exportFile,
    convertRar
}