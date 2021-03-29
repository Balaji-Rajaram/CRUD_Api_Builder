const fs = require('fs-extra')
const bcrypt = require('bcryptjs')


let userLogin=(params)=>{
    return new Promise((resolve,reject)=>{
        console.log(params)
        let dir = './data/Balaji/user.json'
        fs.readFile(dir)
        .then((data) => {
            data=JSON.parse(data)
            if(data){
                bcrypt.compare(params.password, data.password, (err, isMatch) => {
                    if (err) reject(err);
                    if (isMatch) {
                        resolve(data)
                    }
                    else {
                    reject({ message : "Incorrect Password" });
                    }
                })
            }
            else{
                reject({'message':'user not found'})
            }
        })
        .catch(err => {
            reject(err)

        })
    })
}


module.exports={
    userLogin
}