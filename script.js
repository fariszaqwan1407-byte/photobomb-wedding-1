let stream;
let imageData;

function startCamera(){
document.getElementById("welcome").classList.remove("active");
document.getElementById("cameraScreen").classList.add("active");

navigator.mediaDevices.getUserMedia({
video:{facingMode:"user"}
}).then(s=>{
stream=s;
document.getElementById("camera").srcObject=s;
});
}

function capture(){
let video=document.getElementById("camera");
let canvas=document.getElementById("canvas");

canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

let ctx=canvas.getContext("2d");
ctx.drawImage(video,0,0);

imageData=canvas.toDataURL("image/jpeg",0.9);

document.getElementById("preview").src=imageData;

document.getElementById("cameraScreen").classList.remove("active");
document.getElementById("previewScreen").classList.add("active");
}

function upload(){

let nama=document.getElementById("nama").value;
let ucapan=document.getElementById("ucapan").value;

fetch("https://script.google.com/macros/s/AKfycbxKFf3Cuvzy888HLFXzU6V1aDnT2dS7QugJ7rZSXbJmK_gF-fR2KFASeVMSDOpJ9qej/exec",{
method:"POST",
body:JSON.stringify({
image:imageData,
nama:nama,
ucapan:ucapan
})
})
.then(res=>res.json())
.then(data=>{

document.getElementById("previewScreen").classList.remove("active");
document.getElementById("done").classList.add("active");

if(stream){
stream.getTracks().forEach(t=>t.stop());
}

});
}