let stream;
let imageData;
let currentFacing="user"; // front default

function startCamera(){
openCamera(currentFacing);

document.getElementById("welcome").classList.remove("active");
document.getElementById("cameraScreen").classList.add("active");
}

// OPEN CAMERA FUNCTION
function openCamera(facing){

if(stream){
stream.getTracks().forEach(t=>t.stop());
}

navigator.mediaDevices.getUserMedia({
video:{facingMode:facing}
}).then(s=>{
stream=s;
document.getElementById("camera").srcObject=s;
});
}

// SWITCH CAMERA
function switchCamera(){

currentFacing = currentFacing === "user" ? "environment" : "user";

openCamera(currentFacing);
}

// CAPTURE + FRAME
function capture(){

let video=document.getElementById("camera");
let canvas=document.getElementById("canvas");

canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

let ctx=canvas.getContext("2d");

ctx.drawImage(video,0,0);

let nama=document.getElementById("nama").value || "";
let ucapan=document.getElementById("ucapan").value || "";

let h=canvas.height;

// gradient frame
let gradient=ctx.createLinearGradient(0,h-250,0,h);
gradient.addColorStop(0,"transparent");
gradient.addColorStop(1,"rgba(0,0,0,0.75)");

ctx.fillStyle=gradient;
ctx.fillRect(0,h-250,canvas.width,250);

// text
ctx.fillStyle="white";
ctx.textAlign="center";

ctx.font="bold 42px sans-serif";
ctx.fillText("FARIS ❤️ SHAFIQAH",canvas.width/2,h-170);

ctx.font="28px sans-serif";
ctx.fillText("27 SEPTEMBER 2026",canvas.width/2,h-120);

ctx.font="bold 32px sans-serif";
ctx.fillText(nama,canvas.width/2,h-70);

ctx.font="24px sans-serif";
ctx.fillText(ucapan.substring(0,45),canvas.width/2,h-30);

imageData=canvas.toDataURL("image/jpeg",0.9);

document.getElementById("preview").src=imageData;

document.getElementById("cameraScreen").classList.remove("active");
document.getElementById("previewScreen").classList.add("active");
}

// UPLOAD
function upload(){

let nama=document.getElementById("nama").value || "guest";
let ucapan=document.getElementById("ucapan").value || "";

fetch("https://script.google.com/macros/s/AKfycbxKFf3Cuvzy888HLFXzU6V1aDnT2dS7QugJ7rZSXbJmK_gF-fR2KFASeVMSDOpJ9qej/exec",{
method:"POST",
body:JSON.stringify({
image:imageData,
nama:nama,
ucapan:ucapan
})
})
.then(res=>res.json())
.then(()=>{

document.getElementById("previewScreen").classList.remove("active");
document.getElementById("done").classList.add("active");

if(stream){
stream.getTracks().forEach(t=>t.stop());
}

});
}