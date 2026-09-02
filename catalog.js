const PHOTO="https://raw.githubusercontent.com/lensleyluan001-create/sable-looks/main/";
const SELLERS=["wian","luan","dylan"];
const SL={wian:"Wian",luan:"Luan",dylan:"Dylan"};
const UK=["3","4","5","6","7","8","9","10","11","12","13"];
const HIDES=[["book","As photographed"],["tan","Tan"],["brown","Brown"],["dark","Dark brown"],["black","Black"],["olive","Olive"]];
const HIDE_SWATCH={book:"#8a7a68",tan:"#c4a574",brown:"#6b4634",dark:"#3a2418",black:"#14110e",olive:"#5a6348"};
const TYPE_SLUG={"Vellie":"vellie","Wool-lined vellie":"vellie","Kids vellie":"vellie","Golfer":"golfer","Chelsea":"chelsea","Derby":"derby","Kids derby":"derby","Hiking boot":"hike","Combat boot":"combat","Loafer":"loafer","Sandal":"sandal","Thong":"thong","Zip boot":"zip","Wool-lined boot":"woolboot","Wool-lined slipper":"slip"};
const LACE_COLS=[["natural","Rawhide"],["tan","Tan"],["brown","Brown"],["black","Black"],["olive","Olive"],["white","White"]];
const STITCH_COLS=[["cream","Cream"],["tan","Tan"],["brown","Brown"],["black","Black"],["olive","Olive"],["white","White"]];
const EXTRA_FEE=50;
const SOURCES=[["whatsapp","WhatsApp"],["website","Website"],["instagram","Instagram"],["walk-in","Walk-in"],["referral","Referral"],["other","Other"]];
const STAGES=[["new","New"],["contacted","Working"],["qualified","Working"],["negotiation","Working"],["closed","Closed"],["lost","Lost"]];
const RAW=[[1,"Vellie",599,350],[2,"Vellie",649,449],[3,"Vellie",599,399],[4,"Golfer",1200,1000],[5,"Vellie",699,499],[6,"Vellie",599,399],[7,"Vellie",649,449],[8,"Wool-lined boot",799,599],[9,"Wool-lined boot",799,599],[10,"Wool-lined slipper",699,499],[11,"Hiking boot",799,599],[12,"Vellie",649,449],[13,"Derby",599,399],[14,"Derby",799,599],[15,"Chelsea",1100,900],[16,"Vellie",599,399],[17,"Vellie",799,599],[18,"Vellie",699,499],[19,"Vellie",699,499],[20,"Derby",599,399],[21,"Derby",599,399],[22,"Derby",799,599],[23,"Golfer",999,799],[24,"Derby",599,399],[25,"Derby",599,399],[26,"Derby",599,399],[27,"Sandal",449,249],[28,"Thong",449,249],[29,"Thong",449,249],[30,"Sandal",449,249],[31,"Derby",649,449],[32,"Zip boot",899,699],[33,"Derby",599,399],[34,"Derby",599,399],[35,"Derby",599,399],[36,"Vellie",649,449],[37,"Vellie",649,449],[38,"Vellie",649,449],[39,"Chelsea",1100,900],[40,"Chelsea",1100,900],[41,"Derby",649,449],[42,"Derby",599,399],[43,"Loafer",699,499],[44,"Vellie",649,449],[45,"Vellie",699,499],[46,"Vellie",699,499],[47,"Golfer",850,650],[48,"Vellie",699,499],[49,"Thong",449,249],[50,"Vellie",699,499],[51,"Vellie",699,499],[52,"Vellie",699,499],[53,"Vellie",699,499],[54,"Vellie",699,499],[55,"Vellie",649,449],[56,"Hiking boot",799,599],[57,"Wool-lined vellie",799,599],[58,"Vellie",699,499],[59,"Vellie",799,599],[60,"Golfer",1100,900],[61,"Hiking boot",799,599],[62,"Vellie",699,499],[63,"Golfer",1300,1100],[64,"Vellie",699,499],[65,"Combat boot",1400,1200],[66,"Combat boot",1400,1200],[67,"Combat boot",1400,1200],[68,"Combat boot",1200,1000],[69,"Chelsea",1100,900],[70,"Chelsea",1100,900],[71,"Chelsea",1100,900],[72,"Chelsea",1100,900],[73,"Chelsea",1100,900],[74,"Chelsea",1100,900],[75,"Chelsea",1100,900],[76,"Chelsea",1100,900],[77,"Chelsea",1100,900],[78,"Kids vellie",399,199],[79,"Kids derby",399,199],[80,"Hiking boot",1400,1200],[81,"Hiking boot",899,699],[82,"Hiking boot",1400,1200],[83,"Hiking boot",1400,1200],[84,"Hiking boot",1400,1200],[85,"Hiking boot",1400,1200],[86,"Hiking boot",1400,1200],[87,"Vellie",699,499],[88,"Combat boot",1600,1400],[89,"Vellie",699,499],[90,"Golfer",1200,1000],[91,"Zip boot",799,599],[92,"Vellie",699,499]];
const PAIRS=RAW.map(([n,look,price,cost])=>({n,sku:String(45000+n),look,price,cost,img:PHOTO+(45000+n)+".jpg"}));
function looksOf(){
  const out=[];
  const seen={};
  for(const p of PAIRS){
    if(!seen[p.look]){seen[p.look]=1;out.push(p.look)}
  }
  return out;
}
function matchLook(p,type){return !type||p.look===type}
function shoe(sku){return PAIRS.find(p=>p.sku===String(sku))||null}
function hideName(id){const h=HIDES.find(x=>x[0]===id);return h?h[1]:"As photographed"}
function typeSlug(look){return TYPE_SLUG[look]||"vellie"}
function viewHost(){
  try{
    const h=location.hostname||"";
    if(h.indexOf("vercel.app")>=0) return PHOTO+"views/";
  }catch(e){}
  return "./views/";
}
function studioSrc(slug,n){return viewHost()+slug+"-"+n+".jpg?v=4"}
function viewsOf(p,hide){
  const sku=String(p&&p.sku||"");
  const studio=[1,2,3,4,5].map(n=>viewHost()+sku+"-"+n+".jpg?v=4");
  const book=(p&&p.img)||studio[0];
  if(!hide||hide==="book") return [book].concat(studio.slice(1));
  return studio;
}
function hideSwatch(id){return HIDE_SWATCH[id]||HIDE_SWATCH.book}
function hideChips(on,attr,short){
  attr=attr||"data-hide";
  on=on||"book";
  const shortLab={book:"Book",tan:"Tan",brown:"Brown",dark:"Dark",black:"Black",olive:"Olive"};
  return HIDES.map(([id,lab])=>{
    const t=short?shortLab[id]||lab:lab;
    return '<button class="hide'+(on===id?" on":"")+'" type="button" '+attr+'="'+id+'" title="'+lab+'"><span class="sw" style="background:'+hideSwatch(id)+'"></span>'+t+"</button>";
  }).join("");
}
function turnHtml(p,hide,viewI){
  hide=hide||"book";
  const shots=viewsOf(p,hide);
  let i=Number(viewI)||0;
  if(i<0) i=shots.length-1;
  if(i>=shots.length) i=0;
  const src=shots[i]||(p&&p.img)||"";
  const alt=p?(p.sku+" "+p.look):"";
  const dots=shots.map((_,n)=>'<button type="button" class="dot'+(n===i?" on":"")+'" data-view="'+n+'" aria-label="View '+(n+1)+'"></button>').join("");
  return '<div class="turn" data-hide="'+hide+'"><img src="'+src+'" alt="'+alt+'" draggable="false" />'+
    '<div class="dots">'+dots+"</div></div>";
}
function hookTurn(setView){
  const box=document.querySelector(".turn");
  if(!box||typeof setView!=="function") return;
  let x0=null;
  box.onpointerdown=function(e){
    if(e.target&&e.target.closest&&e.target.closest("[data-view]")) return;
    x0=e.clientX;
  };
  box.onpointerup=function(e){
    if(x0==null) return;
    const dx=e.clientX-x0;
    x0=null;
    if(Math.abs(dx)<24) return;
    setView(dx<0?1:-1);
  };
  box.querySelectorAll("[data-view]").forEach(b=>b.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
    setView(0,Number(b.getAttribute("data-view")));
  });
}
function lacedLook(look){return /vellie|golfer|derby|hiking|combat|wool-lined boot|zip/i.test(String(look||""))}
function extraFix(e){
  e=e&&typeof e==="object"?e:{};
  return {
    laser:!!e.laser,
    laserPhoto:String(e.laserPhoto||""),
    laces:!!e.laces,
    laceColour:e.laceColour||"natural",
    stitch:!!e.stitch,
    stitchColour:e.stitchColour||"cream",
    custom:!!e.custom,
    customNote:String(e.customNote||""),
    customFee:Number(e.customFee||0)||0
  };
}
function extraSum(e,qty){
  e=extraFix(e);
  qty=Number(qty||1)||1;
  let n=0;
  if(e.laser) n+=EXTRA_FEE;
  if(e.laces) n+=EXTRA_FEE;
  if(e.stitch) n+=EXTRA_FEE;
  n+=e.customFee;
  return n*qty;
}
function extraBits(e){
  e=extraFix(e);
  const bits=[];
  if(e.laser) bits.push("Laser");
  if(e.laces) bits.push("Laces "+(LACE_COLS.find(x=>x[0]===e.laceColour)||[e.laceColour,e.laceColour])[1]);
  if(e.stitch) bits.push("Stitch "+(STITCH_COLS.find(x=>x[0]===e.stitchColour)||[e.stitchColour,e.stitchColour])[1]);
  if(e.custom) bits.push("Custom");
  return bits;
}
function extraLabel(e){
  e=extraFix(e);
  const bits=extraBits(e);
  if(e.custom&&e.customFee) bits[bits.length-1]="Custom";
  return bits.join(" · ");
}
function colChips(rows,on,attr){
  return rows.map(([id,lab])=>'<button class="chip '+(on===id?"on":"")+'" type="button" '+attr+'="'+id+'">'+lab+"</button>").join("");
}
function extrasHtml(e,look,kind){
  e=extraFix(e);
  kind=kind||"ex";
  const laced=lacedLook(look);
  const laserOn=e.laser?" on":"";
  const laceOn=e.laces?" on":"";
  const stitchOn=e.stitch?" on":"";
  const customOn=e.custom?" on":"";
  let html='<label>Extras</label><div class="chips extras-row">'+
    '<button class="chip'+laserOn+'" type="button" data-'+kind+'="laser">Laser · R50</button>'+
    (laced?'<button class="chip'+laceOn+'" type="button" data-'+kind+'="laces">Laces · R50</button>':"")+
    '<button class="chip'+stitchOn+'" type="button" data-'+kind+'="stitch">Stitching · R50</button>'+
    '<button class="chip'+customOn+'" type="button" data-'+kind+'="custom">Custom · quoted</button></div>';
  if(e.laser){
    html+='<label>Photo to laser</label><input type="file" id="'+kind+'-laser" accept="image/*" />';
    if(e.laserPhoto) html+='<img class="laser-preview" src="'+e.laserPhoto+'" alt="Laser art" />';
    else html+='<p class="meta">Upload the mark. We will confirm before we burn.</p>';
  }
  if(e.laces&&laced){
    html+='<label>Lace colour</label><div class="chips">'+colChips(LACE_COLS,e.laceColour,"data-"+kind+"lace")+"</div>";
  }
  if(e.stitch){
    html+='<label>Stitch colour</label><div class="chips">'+colChips(STITCH_COLS,e.stitchColour,"data-"+kind+"stitch")+"</div>";
  }
  if(e.custom){
    html+='<label>Custom</label><textarea id="'+kind+'-custom" placeholder="What to change on the pair.">'+esc(e.customNote||"")+'</textarea>';
    if(kind==="p") html+='<label>Custom amount</label><input id="p-customfee" inputmode="numeric" value="'+(e.customFee||"")+'" placeholder="Quoted ZAR" />';
    else html+='<p class="meta">Custom is quoted. Sable will confirm.</p>';
  }
  html+='<p class="hint extra-hint">Laser, laces and stitching are R50 each. Custom depends on the work.</p>';
  return html;
}
function shrinkPic(file,done){
  if(!file||!file.type||file.type.indexOf("image")!==0) return;
  const img=new Image();
  const url=URL.createObjectURL(file);
  img.onload=function(){
    const max=720;
    let w=img.width,h=img.height;
    if(w>max){h=Math.round(h*max/w);w=max}
    if(h>max){w=Math.round(w*max/h);h=max}
    const c=document.createElement("canvas");
    c.width=w;c.height=h;
    c.getContext("2d").drawImage(img,0,0,w,h);
    URL.revokeObjectURL(url);
    done(c.toDataURL("image/jpeg",0.72));
  };
  img.src=url;
}
function hookExtras(kind,getEx,setEx){
  document.querySelectorAll("[data-"+kind+"]").forEach(b=>b.onclick=function(){
    const ex=extraFix(getEx());
    const k=b.getAttribute("data-"+kind);
    if(k==="laser") ex.laser=!ex.laser;
    if(k==="laces") ex.laces=!ex.laces;
    if(k==="stitch") ex.stitch=!ex.stitch;
    if(k==="custom") ex.custom=!ex.custom;
    if(!ex.laser) ex.laserPhoto="";
    if(!ex.custom){ex.customNote="";ex.customFee=0}
    setEx(ex);
  });
  document.querySelectorAll("[data-"+kind+"lace]").forEach(b=>b.onclick=function(){
    const ex=extraFix(getEx());
    ex.laces=true;
    ex.laceColour=b.getAttribute("data-"+kind+"lace")||"natural";
    setEx(ex);
  });
  document.querySelectorAll("[data-"+kind+"stitch]").forEach(b=>b.onclick=function(){
    const ex=extraFix(getEx());
    ex.stitch=true;
    ex.stitchColour=b.getAttribute("data-"+kind+"stitch")||"cream";
    setEx(ex);
  });
  const laser=document.getElementById(kind+"-laser");
  if(laser) laser.onchange=function(){
    const f=laser.files&&laser.files[0];
    if(!f) return;
    shrinkPic(f,function(data){
      const ex=extraFix(getEx());
      ex.laser=true;
      ex.laserPhoto=data;
      setEx(ex);
    });
  };
  const note=document.getElementById(kind+"-custom");
  if(note) note.onchange=function(){
    const ex=extraFix(getEx());
    ex.custom=true;
    ex.customNote=String(note.value||"").trim();
    setEx(ex,true);
  };
  const fee=document.getElementById("p-customfee");
  if(fee) fee.onchange=function(){
    const ex=extraFix(getEx());
    ex.custom=true;
    ex.customFee=Number(String(fee.value||"").replace(/[^\d]/g,""))||0;
    setEx(ex,true);
  };
}
