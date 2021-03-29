var workSpace = ['workspace1']
var Collection = ['collectionName']
let collectionValue=[]
let currentWorkSpace=''
let savedCollection=''
let currentCollection=''
let currentUser=CURRENT_USER


if(!workSpace.length){
    document.getElementById('welcomeCard').style.display='block'
    document.getElementById('cardLayoutDisplay').style.display='none';
}
else{
    document.getElementById('cardLayoutDisplay').style.display='none';
    WorkspaceModal()
}



async function WorkspaceModal(){
    await fetch('/api/workspace/'+currentUser)
    .then(a=>a.json())
    .then(b=>{
        console.log(b.data)
        workSpace=b.data
    })
    .catch(err=>{
        console.log(err)
    })

    let workSpaceListTemplate = ``
    workSpace.forEach(element => {
        console.log(element);
        workSpaceListTemplate=workSpaceListTemplate+`<div class="d-flex d-xl-flex justify-content-start align-items-center justify-content-xl-start align-items-xl-center" style="padding: 5px;background: #f9f9f9;border-radius: 5px;border: 0.1px solid rgb(163,163,163); margin-bottom: 5px;" id="${element}" >
        <p class="flex-fill" style="margin-bottom: 0px;"onclick='openWorkSpace(this)' >${element}</p><i class="fa fa-trash" style="color: rgb(255,49,49);" onclick='deleteWorkSpace(this)'></i></div>`
    });
    if(!workSpace.length){
        workSpaceListTemplate=`<p>No Workspace created Yet!!!</p>`
    }
    document.getElementById('workSpaceList').innerHTML=workSpaceListTemplate
    $("#WorkspaceModal").modal()
}

function openWorkSpace(params){
    console.log(params.parentNode);
    currentWorkSpace=params.parentNode.id
    $("#WorkspaceModal").modal('hide')
    document.getElementById('workspaceIndicator').innerText=currentWorkSpace
    CollectionModal()
}

function deleteWorkSpace(params){
    fetch('/api/workspace/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'delete',
        body:JSON.stringify({
            'name':currentUser,
            'workspaceName':params.parentNode.id,
        })
    }).then(res=>{
        WorkspaceModal()
    })
    .catch(err=>{
        console.log(err)
    })
}

function createWorkSpace(){
    let workSpaceName=document.getElementById('workSpaceName').value;
    fetch('/api/workspace/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'post',
        body:JSON.stringify({
            'name':currentUser,
            'workspaceName':workSpaceName,
        })
    }).then(res=>{
        currentWorkSpace=workSpaceName
        $("#WorkspaceModal").modal('hide')
        CollectionModal()
    })
    .catch(err=>{
        console.log(err)
    })
}

async function CollectionModal(){
    console.log(currentUser, currentWorkSpace);
    await fetch('/api/collection/'+currentUser+'/'+currentWorkSpace)
    .then(a=>a.json())
    .then(b=>{
        console.log(b.data)
        let collectionParse=[]
        b.data.forEach(element => {
            collectionParse.push(element.split('.')[0])
        });
        Collection=collectionParse
        // workSpace=b.data
    })
    .catch(err=>{
        console.log(err)
    })

    let collectionListTemplate = ``
    Collection.forEach(element => {
        
        collectionListTemplate=collectionListTemplate+`<div class="d-flex d-xl-flex justify-content-start align-items-center justify-content-xl-start align-items-xl-center" style="padding: 5px;background: #f9f9f9;border-radius: 5px;border: 0.1px solid rgb(163,163,163); margin-bottom: 5px;" id=${element} >
        <p class="flex-fill" style="margin-bottom: 0px;"onclick='openCollection(this)' >${element}</p><i class="fa fa-trash" style="color: rgb(255,49,49);" onclick='deleteCollection(this)'></i></div>`
    });
    if(!Collection.length){
        collectionListTemplate=`<p>No collection created Yet!!!</p>`
    }
    document.getElementById('collectionList').innerHTML=collectionListTemplate
    $("#collectionModal").modal()
}

function createCollection(){
    let collectionName=document.getElementById('collectionName').value;
    fetch('/api/collection/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'post',
        body:JSON.stringify({
            'name':currentUser,
            'workspaceName':currentWorkSpace,
            'collectionName':collectionName
        })
    }).then(res=>{
        $("#collectionModal").modal('hide')
        $("#keyModal").modal()
    })
    .catch(err=>{
        console.log(err)
    })
}

async function openCollection(params){
    currentCollection=params.parentNode.id
    await fetch('/api/collection/'+currentUser+'/'+currentWorkSpace+'/'+params.parentNode.id)
    .then(a=>a.json())
    .then(b=>{
        document.getElementById('collectionIndicator').innerText=currentCollection
        if(b.data){
            let collectionFromFile=[]
            let key=Object.keys(b.data)
            console.log(key);
            key.forEach(element => {
                if(Array.isArray(b.data[element])){
                    let copiedKeyCard={
                        'keyName':element,
                        'objType':'array',
                        'type':b.data[element][0].type,
                        'unique':b.data[element][0].unique,
                        'required':b.data[element][0].required
                    }
                    collectionFromFile.push(copiedKeyCard)
                }
                else{
                    let copiedKeyCard={
                        'keyName':element,
                        'objType':'json',
                        'type':b.data[element].type,
                        'unique':b.data[element].unique,
                        'required':b.data[element].required
                    }
                    collectionFromFile.push(copiedKeyCard)
                }
            });
            collectionValue=collectionFromFile
            $("#collectionModal").modal('hide')   
            document.getElementById('collectionCount').innerText=`(${collectionValue.length})`

        }
        else{
            $("#collectionModal").modal('hide')
            collectionValue=[]
            document.getElementById('collectionCount').innerText=`(${collectionValue.length})`
        }
        if(collectionValue.length){
            decodeCollection()
        }
        else{
            $("#keyModal").modal()
        }
    })
    .catch(err=>{
        console.log(err)
    })
}

function deleteCollection(params){
    console.log(params.parentNode.id)
    fetch('/api/collection/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'delete',
        body:JSON.stringify({
            'name':currentUser,
            'workspaceName':currentWorkSpace,
            'collectionName':params.parentNode.id
        })
    }).then(res=>{
        CollectionModal()
    })
    .catch(err=>{
        console.log(err)
    })
}


function keySet() {
    let keyName=document.getElementById('key').value
    let data={
        'keyName':keyName,
        'type':'String',
        'objType':'json',
        'unique':'false',
        'required':'false'
    }
    collectionValue.push(data)
    $("#keyModal").modal('hide')
    decodeCollection()
}


function decodeCollection(){
    let cardTemplate=``
    collectionValue.forEach(element => {
        cardTemplate = cardTemplate+`
                                    <div class="shadow-sm" style="margin: 10px;" id='${element.keyName}'>
                                        <div class="d-flex d-xl-flex justify-content-start align-items-center justify-content-xl-start align-items-xl-center" style="background: #007bff;width: 315px;border-radius: 0px;border-top-left-radius: 5px;border-top-right-radius: 5px;">
                                            <div class="d-xl-flex flex-fill justify-content-xl-start" style="padding: 5px;padding-left: 10px;">
                                                <p class="flex-fill" style="margin-top: 0px;padding-top: 10px;color: rgb(255,255,255);" id="${element.keyName}keyNamePara">${element.keyName}</p>
                                            </div>
                                            <div class="d-xl-flex justify-content-xl-end" style="padding-right: 10px;"><i class="fa fa-pencil" style="color: rgb(255,255,255);" onclick="editKeyName(this)"></i><i class="fa fa-copy" style="color: rgb(255,255,255);margin-left: 10px;" onclick='copyKeyCard(this)'></i></div>
                                        </div>
                                        <div style="width: 315px;padding: 10px;">
                                            <div class="d-flex d-xl-flex justify-content-start justify-content-xl-start align-items-xl-center" style="padding: 5px;">
                                                <p class="flex-fill" style="margin-bottom: 0px;">Object Type</p><select style="border-style: none;border-color: rgb(94,94,94);color: rgb(137,137,137);"><option value="json" selected="">json</option><option value="array">Array</option></select></div>
                                            <div class="d-flex d-xl-flex justify-content-start justify-content-xl-start align-items-xl-center"
                                                style="padding: 5px;">
                                                <p class="flex-fill" style="margin-bottom: 0px;">Type</p><select style="border-style: none;border-color: rgb(94,94,94);color: rgb(137,137,137);"id="type"><option value="String" selected="">String</option><option value="boolean">Boolean</option><option value="number">Number</option><option value="date">Date</option></select></div>
                                            <div
                                                class="d-flex d-xl-flex justify-content-start justify-content-xl-start align-items-xl-center" style="padding: 5px;">
                                                <p class="flex-fill" style="margin-bottom: 0px;">Unique</p><select style="border-style: none;border-color: rgb(94,94,94);color: rgb(137,137,137);" id="unique"><option value="false" selected="">false</option><option value="true">true</option></select></div>
                                        <div class="d-flex d-xl-flex justify-content-start justify-content-xl-start align-items-xl-center"
                                            style="padding: 5px;">
                                            <p class="flex-fill" style="margin-bottom: 0px;">Required</p><select style="border-style: none;border-color: rgb(94,94,94);color: rgb(137,137,137);" id="required"><option value="false" selected="">false</option><option value="true">true</option></select></div>
                                        <div class="d-flex d-xl-flex justify-content-start justify-content-xl-start align-items-xl-center"
                                            style="padding: 5px;margin-top: 10px;"><button class="btn btn-danger" type="button" style="height: 30px;padding-top: 0px;font-size: 13px;" onclick="deleteKeyFunction(this)">Delete</button><button class="btn btn-info" type="button" style="height: 30px;padding-top: 0px;font-size: 13px;margin-left: 5px;" onclick="addKeyCard(this)">Add</button></div>
                                    </div>
                                    </div>`

        
    });
    
    document.getElementById('cardLayoutDisplay').style.display='block';
    document.getElementById('welcomeCard').style.display='none';
    document.getElementById('cardLayout').innerHTML=cardTemplate
    collectionValue.forEach(element => {
        let masterDiv=document.getElementById(element.keyName)
        let selectValues=masterDiv.querySelectorAll('select')
        selectValues[0].value=element.objType
        selectValues[1].value=element.type
        selectValues[2].value=element.unique
        selectValues[3].value=element.required
    })
}


function editKeyName(params) {
    let parentId=params.parentNode.parentNode.parentNode.id
    console.log(parentId)
    document.getElementById('updateKey').value=parentId
    $("#keyEditModal").modal()
    document.getElementById('keyEdit').addEventListener('click',function(){
        document.getElementById(parentId).id=document.getElementById('updateKey').value
        document.getElementById(parentId+'keyNamePara').innerText=document.getElementById('updateKey').value
        collectionValue.forEach(element => {
            if(element.keyName==parentId){
                element.keyName=document.getElementById('updateKey').value;
                return
            }
        });
        console.log(collectionValue)
        $("#keyEditModal").modal('hide')
    })
}

function copyKeyCard(params) {
    let parentId=params.parentNode.parentNode.parentNode.id
    let masterDiv=document.getElementById(parentId)
    let selectValues=masterDiv.querySelectorAll('select')
    console.log(selectValues)
    let newCollectionValue=[]
    for (let i = 0; i < collectionValue.length; i++) {
        if(collectionValue[i].keyName==parentId){
            console.log(collectionValue[i])
            collectionValue[i].objType=selectValues[0].value
            collectionValue[i].type=selectValues[1].value
            collectionValue[i].unique=selectValues[2].value
            collectionValue[i].required=selectValues[3].value
            newCollectionValue.push(collectionValue[i])
            let parentIdparse=parentId.split(' _ ')
            if(parentIdparse.length>1){
                console.log(parentIdparse)
                let copiedKeyCard={
                    'keyName':parentIdparse[0]+" _ "+new Date().getTime(),
                    'objType':selectValues[0].value,
                    'type':selectValues[1].value,
                    'unique':selectValues[2].value,
                    'required':selectValues[3].value
                }
                newCollectionValue.push(copiedKeyCard)
            }
            else{
                let copiedKeyCard={
                    'keyName':parentId+" _ "+new Date().getTime(),
                    'objType':selectValues[0].value,
                    'type':selectValues[1].value,
                    'unique':selectValues[2].value,
                    'required':selectValues[3].value
                }
                newCollectionValue.push(copiedKeyCard)
            }
        }
        else{
            newCollectionValue.push(collectionValue[i])
        }
    }
    collectionValue=newCollectionValue
    document.getElementById('collectionCount').innerText=`(${collectionValue.length})`
    decodeCollection()
}

let addKeyParentId
let addKeySelectValue
function addKeyCard(params) {
    let parentId=params.parentNode.parentNode.parentNode.id
    addKeyParentId=parentId
    document.getElementById('addKey').value=''
    let masterDiv=document.getElementById(parentId)
    let selectValues=masterDiv.querySelectorAll('select')
    addKeySelectValue=selectValues
    $("#addKeyModal").modal('show')
}


function addKeyFunction(){
    let newCollectionValue=[]
    let addKeyName=document.getElementById('addKey').value
    for (let i = 0; i < collectionValue.length; i++) {
        if(collectionValue[i].keyName==addKeyParentId){
            collectionValue[i].objType=addKeySelectValue[0].value
            collectionValue[i].type=addKeySelectValue[1].value
            collectionValue[i].unique=addKeySelectValue[2].value
            collectionValue[i].required=addKeySelectValue[3].value
            newCollectionValue.push(collectionValue[i])
                let copiedKeyCard={
                    'keyName':addKeyName,
                    'objType':'json',
                    'type':'String',
                    'unique':true,
                    'required':true
                }
                newCollectionValue.push(copiedKeyCard)
        }
        else{
            newCollectionValue.push(collectionValue[i])
        }
    }
    collectionValue=newCollectionValue
    document.getElementById('collectionCount').innerText=`(${collectionValue.length})`
    decodeCollection()
    $("#addKeyModal").modal('hide');
}

function deleteKeyFunction(params) {
    let parentId=params.parentNode.parentNode.parentNode.id
    for (let i = 0; i < collectionValue.length; i++) {
        if(collectionValue[i].keyName==parentId){
            collectionValue.splice(i, 1)
            console.log(collectionValue)
            document.getElementById('collectionCount').innerText=`(${collectionValue.length})`
            decodeCollection()
            return
        }
    }
}


async function saveWorkspace() {
        let encodeCollection=``
        for (let i = 0; i < collectionValue.length; i++) {
            const element = collectionValue[i];
            let updated=document.getElementById(collectionValue[i].keyName)
            let updatedSelect=updated.querySelectorAll('select')
            if(updatedSelect[0].value=='json'){
                encodeCollection=encodeCollection+`"${element.keyName}":{
                    "type":"${updatedSelect[1].value}",
                    "unique":"${updatedSelect[2].value}",
                    "required":"${updatedSelect[3].value}"
                }`
            }
            if(updatedSelect[0].value=='array'){
                encodeCollection=encodeCollection+`"${element.keyName}":[{
                    "type":"${updatedSelect[1].value}",
                    "unique":"${updatedSelect[2].value}",
                    "required":"${updatedSelect[3].value}"
                }]`
            }
            if(collectionValue.length-1>i){
                encodeCollection=encodeCollection+`,`
            }
        }
        savedCollection=`{${encodeCollection}}`
        console.log(savedCollection);
        await fetch('/api/collection/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'put',
            body:JSON.stringify({
                'name':currentUser,
                'workspaceName':currentWorkSpace,
                'collection':currentCollection,
                'content':savedCollection
            })
        }).then(res=>{
            updateKeyValues()
        })
        .catch(err=>{
            console.log(err)
        })
      //  console.log(savedCollection)
}


function updateKeyValues() {
    let updatedCollection=[]
    for (let i = 0; i < collectionValue.length; i++) {
        const element = collectionValue[i];
        let updated=document.getElementById(collectionValue[i].keyName)
        let selectValues=updated.querySelectorAll('select')
        let copiedKeyCard={
            'keyName':collectionValue[i].keyName,
            'objType':selectValues[0].value,
            'type':selectValues[1].value,
            'unique':selectValues[2].value,
            'required':selectValues[3].value
        }
        updatedCollection.push(copiedKeyCard)
    }
    collectionValue=updatedCollection
}



async function exportWorkspace(){
    await saveWorkspace()
    document.getElementById('exportWorkspaceName').innerText=currentWorkSpace
    document.getElementById('downloadBtn').style.disabled=true
    $("#exportModal").modal()
    await fetch('/api/export/'+currentUser+'/'+currentWorkSpace)
    .then(a=>a.json())
    .then(b=>{
        document.getElementById('exportProgress').innerText="100%"
        document.getElementById('exportProgress').style.width="100%"

        document.getElementById('downloadBtn').style.disabled=false
    })
    .catch(err=>{
        console.log(err)
    })
}

async function downloadWorkspace(){
    $("#exportModal").modal('hide')
    window.open('/api/export/download/'+currentUser+'/'+currentWorkSpace)
    
    $("#downloadNote").modal()
    
}