const fs = require('fs-extra')

let createFile=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params
        fs.pathExists(dir)
        .then(exists => {
            if(exists){
                reject({'message':'exist'})
            }
            else{
                fs.writeFile(dir,'{}')
                .then(() => {
                    resolve('File created successfully')
                })
                .catch(err => {
                    reject(err)
                })
            }
        })
    })
}

let updateFile=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params.dir
        let content = params.content
        fs.writeFile(dir,content)
                .then(() => {
                    resolve('File created successfully')
                })
                .catch(err => {
                    reject(err)
                })
    })
}

let deleteFile=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params
        fs.unlink(dir)
        .then(() => {
            resolve('File created successfully')
        })
        .catch(err => {
            reject(err)
        })
    })
}

let getFile=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params
        fs.readdir(dir)
        .then((data) => {
            resolve(data)
        })
        .catch(err => {
            reject(err)
        })
    })
}

let readCollection=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params
        fs.readFile(dir)
        .then((data) => {
            resolve(data)
        })
        .catch(err => {
            reject(err)
        })
    })
}

module.exports={
    createFile,
    updateFile,
    deleteFile,
    getFile,
    readCollection
}