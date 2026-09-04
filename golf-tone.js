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
