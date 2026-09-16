import { loadExport, setupCanvas, drawFooter, downloadCsv, nowEvent } from "../shared.js";

const stage = document.querySelector("#stage");
const canvas = document.querySelector("#canvas");
const context = setupCanvas(canvas);
const handles = [...document.querySelectorAll(".corner")];
const events = [];
let data;
let corners = [{ x: .08, y: .1 }, { x: .92, y: .08 }, { x: .9, y: .9 }, { x: .1, y: .92 }];
let active = null;

function point(u, v, width, height) {
  const [a, b, c, d] = corners;
  return {
    x: ((1-u)*(1-v)*a.x + u*(1-v)*b.x + u*v*c.x + (1-u)*v*d.x) * width,
    y: ((1-u)*(1-v)*a.y + u*(1-v)*b.y + u*v*c.y + (1-u)*v*d.y) * height,
  };
}
function placeHandles() { const rect = stage.getBoundingClientRect(); handles.forEach((handle, index) => { handle.style.left = `${corners[index].x * rect.width}px`; handle.style.top = `${corners[index].y * rect.height}px`; }); }
function render() {
  const width = canvas.getBoundingClientRect().width, height = canvas.getBoundingClientRect().height;
  context.clearRect(0, 0, width, height); context.fillStyle = "#030712"; context.fillRect(0,0,width,height);
  const anchor = point(.5,.5,width,height); const moleculePositions = data.molecules.map((m, i) => point(.13 + i*.105, .25 + ((i%2)*.5), width, height));
  context.strokeStyle = "rgba(122, 162, 247, .6)"; context.lineWidth = 2;
  moleculePositions.forEach((position) => { context.beginPath(); context.moveTo(anchor.x, anchor.y); context.lineTo(position.x, position.y); context.stroke(); });
  context.fillStyle = "#b18cff"; context.beginPath(); context.arc(anchor.x,anchor.y,22,0,Math.PI*2); context.fill(); context.fillStyle="#06111e"; context.font="700 12px Noto Sans"; context.fillText(data.recipe.name,anchor.x-38,anchor.y+4);
  data.molecules.forEach((m, i) => { const p = moleculePositions[i], radius = 8 + m.proportion * .6; context.fillStyle = `hsl(${210 + i*20} 82% 65%)`; context.beginPath(); context.arc(p.x,p.y,radius,0,Math.PI*2); context.fill(); context.fillStyle="#e5efff"; context.font="12px Noto Sans"; context.fillText(`${m.name} · ${m.boilingPointC} °C`,p.x+radius+6,p.y+4); });
  drawFooter(context,width,height,data);
}
function populate() { document.querySelector("#exportDate").textContent=data.exportedAt; document.querySelector("#summary").textContent=`${data.recipe.name} · ${data.molecules.length} relations documentaires.`; document.querySelector("#table").innerHTML=`<tr><th>Molécule</th><th>BP</th></tr>${data.molecules.map(m=>`<tr><td>${m.name}</td><td>${m.boilingPointC} °C</td></tr>`).join("")}`; }
handles.forEach((handle, index) => { handle.addEventListener("pointerdown", event => { active=index; handle.setPointerCapture(event.pointerId); }); handle.addEventListener("pointermove", event => { if(active!==index) return; const rect=stage.getBoundingClientRect(); corners[index]={x:Math.max(.01,Math.min(.99,(event.clientX-rect.left)/rect.width)),y:Math.max(.01,Math.min(.99,(event.clientY-rect.top)/rect.height))}; placeHandles(); render(); }); handle.addEventListener("pointerup",()=>active=null); });
document.querySelector("#reset").onclick=()=>{ corners=[{x:.08,y:.1},{x:.92,y:.08},{x:.9,y:.9},{x:.1,y:.92}]; placeHandles(); render(); };
document.querySelector("#log").onclick=()=>{ events.push(nowEvent("graphe_anamorphique","calibration",JSON.stringify(corners),"normalized_points","Calibration manuelle quatre points")); alert("Calibration ajoutée au journal local."); };
document.querySelector("#download").onclick=()=>downloadCsv(events,"perfumum-graphe-anamorphique.csv");
data=await loadExport(); populate(); placeHandles(); render(); window.addEventListener("resize",()=>{placeHandles();render();});
