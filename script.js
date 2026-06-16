let stream;
let imageData;

// START CAMERA
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

// CAPTURE + WEDDING FRAME
function capture(){

let video=document.getElementById("camera");
let canvas=document.getElementById("canvas");

canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

let ctx=canvas.getContext("2d");

// draw camera
ctx.drawImage(video,0,0);

// input data
let nama=document.getElementById("nama").value || "";
let ucapan=document.getElementById("ucapan").value || "";

// DARK GRADIENT FRAME BOTTOM
let h=canvas.height;

let gradient=ctx.createLinearGradient(0,h-250,0,h);
gradient.addColorStop(0,"transparent");
gradient.addColorStop(1,"rgba(0,0,0,0.75)");

ctx.fillStyle=gradient;
ctx.fillRect(0,h-250,canvas.width,250);

// TEXT STYLE
ctx.fillStyle="white";
ctx.textAlign="center";

// TITLE
ctx.font="bold 42px sans-serif";
ctx.fillText("FARIS ❤️ SHAFIQAH",canvas.width/2,h-170);

// DATE
ctx.font="28px sans-serif";
ctx.fillText("27 SEPTEMBER 2026",canvas.width/2,h-120);

// NAME
ctx.font="bold 32px sans-serif";
ctx.fillText(nama,canvas.width/2,h-70);

// UCAPAN (short)
ctx.font="24px sans-serif";
ctx.fillText(ucapan.substring(0,45),canvas.width/2,h-30);

// convert
imageData=canvas.toDataURL("image/jpeg",0.9);

document.getElementById("preview").src=imageData;

document.getElementById("cameraScreen").classList.remove("active");
document.getElementById("previewScreen").classList.add("active");
}

// UPLOAD TO GOOGLE DRIVE
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
.then(data=>{

document.getElementById("previewScreen").classList.remove("active");
document.getElementById("done").classList.add("active");

if(stream){
stream.getTracks().forEach(t=>t.stop());
}

});
}