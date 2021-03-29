const fs = require('fs-extra')

let createFolder=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params
        fs.pathExists(dir)
        .then(exists => {
            if(exists){
                reject({'message':'exist'})
            }
            else{
                fs.mkdirs(dir)
                .then(() => {
                    resolve('Folder created successfully')
                })
                .catch(err => {
                    reject(err)
                })
            }
        })
    })
}

let updateFolder=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params.oldDir
        let newDirName = params.newDir
        fs.rename(dir,newDirName)
        .then(() => {
            resolve('Folder updated successfully')
        })
        .catch(err => {
            reject(err)
        })
    })
}

let deleteFolder=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params
        fs.rmdir(dir)
        .then(() => {
            resolve('Folder created successfully')
        })
        .catch(err => {
            reject(err)
        })
    })
}

let getFolder=(params)=>{
    return new Promise((resolve,reject)=>{
        let dir = params
        fs.readdir(dir)
        .then((data) => {
            if(data.length){
                let index=data.indexOf('export')
                if(index>=0){
                    data.splice(index,1)
                }
                let indexe=data.indexOf('user.json')
                if(indexe>=0){
                    data.splice(indexe,1)
                }
                resolve(data)
            }
            else{
                resolve(data)
            }
        })
        .catch(err => {
            reject(err)
        })
    })
}


module.exports={
    createFolder,
    updateFolder,
    deleteFolder,
    getFolder
}