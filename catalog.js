const PHOTO="https://raw.githubusercontent.com/lensleyluan001-create/sable-looks/main/";
const SELLERS=["wian","luan","dylan"];
const SL={wian:"Wian",luan:"Luan",dylan:"Dylan"};
const UK=["3","4","5","6","7","8","9","10","11","12","13"];
const HIDES=[["book","As photographed"],["tan","Tan"],["brown","Brown"],["dark","Dark brown"],["black","Black"],["olive","Olive"]];
const HIDE_SWATCH={book:"#8a7a68",tan:"#c4a574",brown:"#6b4634",dark:"#3a2418",black:"#14110e",olive:"#5a6348"};
const TYPE_SLUG={"Vellie":"vellie","Wool-lined vellie":"vellie","Kids vellie":"vellie","Golfer":"golfer","Chelsea":"chelsea","Derby":"derby","Kids derby":"derby","Hiking boot":"hike","Combat boot":"combat","Loafer":"loafer","Sandal":"sandal","Thong":"thong","Zip boot":"zip","Wool-lined boot":"woolboot","Wool-lined slipper":"slip"};
const SOURCES=[["whatsapp","WhatsApp"],["website","Website"],["instagram","Instagram"],["walk-in","Walk-in"],["referral","Referral"],["other","Other"]];
const STAGES=[["new","New"],["contacted","Working"],["qualified","Working"],["negotiation","Working"],["closed","Closed"],["lost","Lost"]];
const RAW=[[1,"Vellie",599,350],[2,"Vellie",649,449],[3,"Vellie",599,399],[4,"Golfer",1200,1000],[5,"Vellie",699,499],[6,"Vellie",599,399],[7,"Vellie",649,449],[8,"Wool-lined boot",799,599],[9,"Wool-lined boot",799,599],[10,"Wool-lined slipper",699,499],[11,"Hiking boot",799,599],[12,"Vellie",649,449],[13,"Derby",599,399],[14,"Derby",799,599],[15,"Chelsea",1100,900],[16,"Vellie",599,399],[17,"Vellie",799,599],[18,"Vellie",699,499],[19,"Vellie",699,499],[20,"Derby",599,399],[21,"Derby",599,399],[22,"Derby",799,599],[23,"Golfer",999,799],[24,"Derby",599,399],[25,"Derby",599,399],[26,"Derby",599,399],[27,"Sandal",449,249],[28,"Thong",449,249],[29,"Thong",449,249],[30,"Sandal",449,249],[31,"Derby",649,449],[32,"Zip boot",899,699],[33,"Derby",599,399],[34,"Derby",599,399],[35,"Derby",599,399],[36,"Vellie",649,449],[37,"Vellie",649,449],[38,"Vellie",649,449],[39,"Chelsea",1100,900],[40,"Chelsea",1100,900],[41,"Derby",649,449],[42,"Derby",599,399],[43,"Loafer",699,499],[44,"Vellie",649,449],[45,"Vellie",699,499],[46,"Vellie",699,499],[47,"Golfer",850,650],[48,"Vellie",699,499],[49,"Thong",449,249],[50,"Vellie",699,499],[51,"Vellie",699,499],[52,"Vellie",699,499],[53,"Vellie",699,499],[54,"Vellie",699,499],[55,"Vellie",649,449],[56,"Hiking boot",799,599],[57,"Wool-lined vellie",799,599],[58,"Vellie",699,499],[59,"Vellie",799,599],[60,"Golfer",1100,900],[61,"Hiking boot",799,599],[62,"Vellie",699,499],[63,"Golfer",1300,1100],[64,"Vellie",699,499],[65,"Combat boot",1400,1200],[66,"Combat boot",1400,1200],[67,"Combat boot",1400,1200],[68,"Combat boot",1200,1000],[69,"Chelsea",1100,900],[70,"Chelsea",1100,900],[71,"Chelsea",1100,900],[72,"Chelsea",1100,900],[73,"Chelsea",1100,900],[74,"Chelsea",1100,900],[75,"Chelsea",1100,900],[76,"Chelsea",1100,900],[77,"Chelsea",1100,900],[78,"Kids vellie",399,199],[79,"Kids derby",399,199],[80,"Hiking boot",1400,1200],[81,"Hiking boot",899,699],[82,"Hiking boot",1400,1200],[83,"Hiking boot",1400,1200],[84,"Hiking boot",1400,1200],[85,"Hiking boot",1400,1200],[86,"Hiking boot",1400,1200],[87,"Vellie",699,499],[88,"Combat boot",1600,1400],[89,"Vellie",699,499],[90,"Golfer",1200,1000],[91,"Zip boot",799,599],[92,"Vellie",699,499]];
const PAIRS=RAW.map(([n,look,price,cost])=>({n,sku:String(45000+n),look,price,cost,img:PHOTO+(45000+n)+".jpg"}));
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
function studioSrc(slug,n){return viewHost()+slug+"-"+n+".jpg"}
function viewsOf(p,hide){
  const slug=typeSlug(p&&p.look);
  const studio=[1,2,3,4,5].map(n=>studioSrc(slug,n));
  if(!hide||hide==="book") return [(p&&p.img)||studio[0]].concat(studio.slice(1));
  return studio;
}
function hideSwatch(id){return HIDE_SWATCH[id]||HIDE_SWATCH.book}
function hideChips(on,attr){
  attr=attr||"data-hide";
  on=on||"book";
  return HIDES.map(([id,lab])=>'<button class="hide'+(on===id?" on":"")+'" type="button" '+attr+'="'+id+'"><span class="sw" style="background:'+hideSwatch(id)+'"></span>'+lab+"</button>").join("");
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
