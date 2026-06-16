let stream;
let imageData;
let currentFacing = "user";

/* 🌸 FLOWERS EFFECT */
function spawnFlowers(){
for(let i=0;i<18;i++){
let f=document.createElement("div");
f.className="flower";
f.innerHTML="🌸";
f.style.left=Math.random()*100+"%";
f.style.animationDuration=(3+Math.random()*6)+"s";
document.body.appendChild(f);
}
}
spawnFlowers();

/* 💎 START CAMERA */
function startCamera(){
document.getElementById("welcome").classList.remove("active");
document.getElementById("cameraScreen").classList.add("active");
openCamera(currentFacing);
}

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

/* 🔁 SWITCH CAMERA */
function switchCamera(){
currentFacing = currentFacing === "user" ? "environment" : "user";
openCamera(currentFacing);
}

/* 💎 AI BEAUTY FILTER */
function applyBeautyFilter(ctx, w, h){

let imageData = ctx.getImageData(0,0,w,h);
let data = imageData.data;

for(let i=0;i<data.length;i+=4){

// brightness + soft skin
data[i] = data[i] * 1.08 + 10;     // R
data[i+1] = data[i+1] * 1.05 + 10; // G
data[i+2] = data[i+2] * 1.05 + 10; // B

}

ctx.putImageData(imageData,0,0);

// soft glow overlay
ctx.globalAlpha = 0.08;
ctx.fillStyle = "#ffffff";
ctx.fillRect(0,0,w,h);
ctx.globalAlpha = 1;
}

/* 📸 CAPTURE + FRAME + BEAUTY */
function capture(){

let video=document.getElementById("camera");
let canvas=document.getElementById("canvas");

canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

let ctx=canvas.getContext("2d");

ctx.drawImage(video,0,0);

// 💎 APPLY BEAUTY
applyBeautyFilter(ctx, canvas.width, canvas.height);

// INPUT
let nama=document.getElementById("nama").value||"";
let ucapan=document.getElementById("ucapan").value||"";

let h=canvas.height;

/* 🌸 FRAME */
let gradient=ctx.createLinearGradient(0,h-300,0,h);
gradient.addColorStop(0,"transparent");
gradient.addColorStop(1,"rgba(0,0,0,0.75)");

ctx.fillStyle=gradient;
ctx.fillRect(0,h-300,canvas.width,300);

/* TEXT */
ctx.fillStyle="white";
ctx.textAlign="center";

ctx.font="bold 44px sans-serif";
ctx.fillText("FARIS ❤️ SHAFIQAH",canvas.width/2,h-190);

ctx.font="28px sans-serif";
ctx.fillText("27 SEPTEMBER 2026",canvas.width/2,h-140);

ctx.font="bold 32px sans-serif";
ctx.fillText(nama,canvas.width/2,h-90);

ctx.font="22px sans-serif";

let shortText = ucapan.length>50 ? ucapan.substring(0,50)+"..." : ucapan;
ctx.fillText(shortText,canvas.width/2,h-45);

/* SAVE IMAGE */
imageData = canvas.toDataURL("image/jpeg",0.92);

document.getElementById("preview").src=imageData;

document.getElementById("cameraScreen").classList.remove("active");
document.getElementById("previewScreen").classList.add("active");
}

/* 📥 DOWNLOAD */
function downloadImage(){
let a=document.createElement("a");
a.href=imageData;
a.download="Faris-Shafiqah-Photobooth.jpg";
a.click();
}

/* ☁️ UPLOAD */
function upload(){

document.getElementById("loading").style.display="flex";

let nama=document.getElementById("nama").value||"guest";
let ucapan=document.getElementById("ucapan").value||"";

fetch("https://script.google.com/macros/s/AKfycbxKFf3Cuvzy888HLFXzU6V1aDnT2dS7QugJ7rZSXbJmK_gF-fR2KFASeVMSDOpJ9qej/exec",{
method:"POST",
body:JSON.stringify({
image:imageData,
nama:nama,
ucapan:ucapan
})
})
.then(r=>r.json())
.then(()=>{

document.getElementById("loading").style.display="none";

document.getElementById("previewScreen").classList.remove("active");
document.getElementById("done").classList.add("active");

if(stream){
stream.getTracks().forEach(t=>t.stop());
}

});
}