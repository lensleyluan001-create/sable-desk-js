const TONE_COLS=[["white","White"],["stone","Stone"],["red","Red"],["olive","Olive"],["navy","Navy"],["teal","Teal"],["pink","Pink"],["wine","Wine"],["cream","Cream"],["sky","Sky"],["brown","Brown"],["tan","Tan"]];
const TONE_SWATCH={white:"#f3eee6",stone:"#b7a89a",red:"#b4232a",olive:"#5c6848",navy:"#1e3a5f",teal:"#1f6f6a",pink:"#d4a3a0",wine:"#7a1f2b",cream:"#eadcc4",sky:"#6e8aa8",brown:"#5a3a28",tan:"#c4a574"};
const GOLF_PRESETS=[["book","Book"],["tt:white-stone","White / Stone"],["tt:white-red","White / Red"],["tt:white-olive","White / Olive"],["tt:navy-navy","Navy"],["tt:tan-teal","Tan / Teal"],["tt:white-pink","White / Pink"],["tt:cream-wine","Cream / Wine"],["tt:pink-cream","Pink / Cream"],["tt:white-navy","White / Navy"],["tt:white-sky","White / Sky"],["tt:white-brown","White / Brown"],["tt:tan-tan","Tan"]];
function isGolfer(look){return /^golfer$/i.test(String(look||"").trim())}
function parseTone(id){
  id=String(id||"book");
  if(!id||id==="book") return {book:true,a:"",b:"",id:"book"};
  const raw=id.indexOf("tt:")===0?id.slice(3):id;
  const parts=raw.split("-").filter(Boolean);
  if(parts.length>=2) return {book:false,a:parts[0],b:parts[1],id:"tt:"+parts[0]+"-"+parts[1]};
  if(TONE_COLS.some(x=>x[0]===raw)) return {book:false,a:raw,b:raw,id:"tt:"+raw+"-"+raw};
  return {book:false,a:raw,b:raw,id:id};
}
function toneId(a,b){
  a=String(a||""); b=String(b||"");
  if(!a&&!b) return "book";
  if(!a) a=b; if(!b) b=a;
  return "tt:"+a+"-"+b;
}
function toneSwatch(id){return TONE_SWATCH[id]||HIDE_SWATCH[id]||"#8a7a68"}
const _hideName=hideName;
hideName=function(id){
  const t=parseTone(id);
  if(t.book) return "As photographed";
  function lab(k){
    const row=TONE_COLS.find(x=>x[0]===k)||HIDES.find(x=>x[0]===k);
    return row?row[1]:k;
  }
  if(t.a&&t.b&&t.a!==t.b) return lab(t.a)+" / "+lab(t.b);
  if(t.a) return lab(t.a);
  return _hideName(id);
};
function golfToneHtml(on,attr){
  attr=attr||"data-whide";
  on=on||"book";
  const t=parseTone(on);
  const presets=GOLF_PRESETS.map(function(row){
    const id=row[0], lab=row[1];
    const pt=parseTone(id);
    const a=pt.book?toneSwatch("tan"):toneSwatch(pt.a);
    const b=pt.book?toneSwatch("tan"):toneSwatch(pt.b);
    const sel=(id==="book"&&t.book)||(!pt.book&&t.id===pt.id);
    return '<button class="hide tone'+(sel?" on":"")+'" type="button" '+attr+'="'+id+'" title="'+lab+'"><span class="sw duo"><i style="background:'+a+'"></i><i style="background:'+b+'"></i></span>'+lab+"</button>";
  }).join("");
  const body=TONE_COLS.map(function(row){
    const id=row[0], lab=row[1];
    const sel=!t.book&&t.a===id;
    return '<button class="hide'+(sel?" on":"")+'" type="button" data-tbody="'+id+'" title="'+lab+'"><span class="sw" style="background:'+toneSwatch(id)+'"></span>'+lab+"</button>";
  }).join("");
  const vamp=TONE_COLS.map(function(row){
    const id=row[0], lab=row[1];
    const sel=!t.book&&t.b===id;
    return '<button class="hide'+(sel?" on":"")+'" type="button" data-tvamp="'+id+'" title="'+lab+'"><span class="sw" style="background:'+toneSwatch(id)+'"></span>'+lab+"</button>";
  }).join("");
  return '<div class="tones"><div class="hides">'+presets+"</div>"+
    "<label>Body</label><div class=\"hides\">"+body+"</div>"+
    "<label>Vamp</label><div class=\"hides\">"+vamp+"</div></div>";
}
function toneBadge(id){
  const t=parseTone(id);
  if(t.book) return "";
  return '<div class="tone-badge"><span class="sw duo"><i style="background:'+toneSwatch(t.a)+'"></i><i style="background:'+toneSwatch(t.b)+'"></i></span>'+hideName(id)+"</div>";
}

function golf3dUrl(sku){
  return "https://cdn.jsdelivr.net/gh/lensleyluan001-create/sable-looks@fa82e44/golf3d/"+sku+".jpg";
}
function hexRgb(h){
  h=String(h||"").replace("#","");
  if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  return [parseInt(h.slice(0,2),16)||0, parseInt(h.slice(2,4),16)||0, parseInt(h.slice(4,6),16)||0];
}
const golfImgCache={};
function loadGolf3d(sku, done){
  if(golfImgCache[sku] && golfImgCache[sku].complete && golfImgCache[sku].naturalWidth){ done(golfImgCache[sku]); return; }
  const im=new Image();
  im.crossOrigin="anonymous";
  im.onload=function(){ golfImgCache[sku]=im; done(im); };
  im.onerror=function(){
    if(im.dataset.try!=="gh"){
      im.dataset.try="gh";
      im.src="https://raw.githubusercontent.com/lensleyluan001-create/sable-looks/fa82e441854c243e886f11db1abbab9304827373/golf3d/"+sku+".jpg";
      return;
    }
    if(im.dataset.try!=="local"){
      im.dataset.try="local";
      im.src="/golf/"+sku+".jpg";
      return;
    }
    done(null);
  };
  im.src=golf3dUrl(sku);
}
function paintGolfCanvas(canvas, img, bodyHex, vampHex){
  const w=img.naturalWidth, h=img.naturalHeight;
  if(!w||!h) return;
  canvas.width=w; canvas.height=h;
  const ctx=canvas.getContext("2d");
  ctx.drawImage(img,0,0);
  const data=ctx.getImageData(0,0,w,h);
  const p=data.data;
  const upper=new Uint8Array(w*h);
  let x0=w,y0=h,x1=0,y1=0,n=0;
  for(let i=0,j=0;i<p.length;i+=4,j++){
    const r=p[i],g=p[i+1],b=p[i+2];
    const lum=(r+g+b)/3;
    if(Math.abs(r-g)<32 && Math.abs(g-b)<42 && Math.abs(r-b)<48 && lum>100 && lum<245){
      upper[j]=1; n++;
      const x=j%w, y=(j/w)|0;
      if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y;
    }
  }
  if(n<80) return;
  const sw=Math.max(1,x1-x0), sh=Math.max(1,y1-y0);
  const bc=hexRgb(bodyHex), vc=hexRgb(vampHex);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const j=y*w+x;
      if(!upper[j]) continue;
      const relx=(x-x0)/sw, rely=(y-y0)/sh;
      const vamp=relx>0.50 && (relx+0.18*rely)>0.58;
      const c=vamp?vc:bc;
      const i=j*4;
      const lum=(p[i]+p[i+1]+p[i+2])/3/255;
      const scale=Math.max(0.18, Math.min(1.22, lum/0.70));
      p[i]=Math.max(0,Math.min(255, c[0]*scale));
      p[i+1]=Math.max(0,Math.min(255, c[1]*scale));
      p[i+2]=Math.max(0,Math.min(255, c[2]*scale));
    }
  }
  ctx.putImageData(data,0,0);
}
function paintGolfEl(canvas, sku, hideId){
  if(!canvas) return;
  const t=parseTone(hideId);
  if(t.book) return;
  const body=toneSwatch(t.a||"white");
  const vamp=toneSwatch(t.b||t.a||"white");
  loadGolf3d(sku, function(img){
    if(!img){
      const p=typeof shoe==="function"?shoe(sku):null;
      if(p&&p.img&&canvas.parentNode){
        const el=document.createElement("img");
        el.src=p.img; el.alt=sku+" "+hideName(hideId);
        canvas.replaceWith(el);
      }
      return;
    }
    paintGolfCanvas(canvas, img, body, vamp);
  });
}
function golfTurnHtml(sku){
  return '<div class="turn golf-3d" data-look="golfer"><div class="stage"><canvas id="golf-3d" class="golf-canvas" aria-label="Two-tone golfer"></canvas></div></div>';
}
