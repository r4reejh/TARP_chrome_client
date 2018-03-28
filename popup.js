'use strict';
let socketId = "";
let Domain = "";
const baseUrl = "http://192.168.43.193"
function fetchContent(){
    $.ajax({
        type:'POST',
        data:{domain:"test",sockId:socketId},
        url: baseUrl+':3000/identify',
        success:(data)=>{
            let text = data.message;
            $('.codebox').text(text);
        }
    })
}



/*function decryptHelper(uname,encPass){
    $.ajax({
        type:'POST',
        data:{encPass:encPass},
        url:'http://localhost:4000/fetchKey',
        success:(data)=>{
            let text = data.message;
            $('.codebox').text(text);
        }
    })
}

function Login(pass){
    execute(uname,encpasswd);
}*/

function socketConnect(){
    let socket = io.connect(baseUrl+':3002');
    socket.on('connect',(data)=>{
        $('.codebox').text('connected!');
    })

    socket.on('getId',(data)=>{
        console.log(data);
        socketId = data.data;
    })

    socket.on('stream',(data)=>{
        console.log(data.txt);
        $('.codebox').text(String(data.txt));
    })

    socket.on('credentials',(data)=>{
        let uname = data.username;
        let encpasswd = data.password;
        console.log('PASS');
        $('.codebox').text(String(uname));
        execute(uname,encpasswd);
        /*decryptHelper(encpasswd)
        .then(Login);*/
    })
}

function execute(uname,pass){
    let script0 = "document.getElementById('uname').value = '"+uname+"'";
    let script1 = "document.getElementById('passwd').value = '"+pass+"'";
    let script2 = "document.getElementsByClassName('btn-primary')[0].click()";
    
    chrome.tabs.executeScript(null,{code:script0},(err0,results0)=>{
        chrome.tabs.executeScript(null,{code:script1},(err1,results1)=>{
            chrome.tabs.executeScript(null,{code:script2},(err2,results2)=>{
                if(err0 || err1 || err2){
                    console.log('error');
                } else {
                    console.log('clicked');
                }
            })
        })
    });
}

document.addEventListener('DOMContentLoaded', function () {
  socketConnect();
  chrome.tabs.getSelected(null, function (tab) {
    var url = new URL(tab.url)
    var domain = url.hostname
    
    Domain = domain;
    let identify = document.getElementById("start");
    identify.addEventListener('click',()=>{
        fetchContent();
    });
  })
});