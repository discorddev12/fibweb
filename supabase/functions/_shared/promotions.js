const LADDER=[
  {name:'Branch Director',keys:['branchdirector']},
  {name:'Asst. Branch Director',keys:['assistantbranchdirector']},
  {name:'Head Special Agent',keys:['headspecialagent']},
  {name:'Asst. Special Agent in Charge',keys:['assistantspecialagentincharge']},
  {name:'Executive Agent',keys:['executiveagent']},
  {name:'Supervisory Special Agent',keys:['supervisoryspecialagent']},
  {name:'Senior Special Agent',keys:['seniorspecialagent']},
  {name:'Special Agent',keys:['specialagent']},
  {name:'Field Agent',keys:['fieldagent']},
  {name:'Jr Agent',keys:['junioragent','jragent']},
  {name:'Agent',keys:['agent']},
  {name:'Agent Trainee',keys:['agenttrainee']}
];
function rankIndex(s){
  const n=String(s).toLowerCase().replace(/\basst\.?/g,'assistant').replace(/\bjr\b\.?/g,'junior').replace(/[^a-z0-9]/g,'');
  const k=LADDER.findIndex(r=>r.keys.includes(n));
  return k<0?null:k;
}
const normName=s=>String(s).toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
function sameName(a,b){
  const x=normName(a),y=normName(b);
  if(!x||!y)return false;
  if(x===y)return true;
  const short=x.length<y.length?x:y,long=x.length<y.length?y:x;
  return short.length>=3&&long.includes(short);
}
const num=(v,d)=>{const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:d;};
const fmtMin=m=>Math.floor(m/60)+'h '+String(m%60).padStart(2,'0')+'m';

function parsePromos(text){
  const out=[],seen=new Set();
  for(const chunk of text.split(/\(\s*\d+\s*%\s*\)/)){
    const m=chunk.match(/(\d+)\s*h\s*(\d+)\s*m\s*\/\s*(\d+)\s*h\s*(\d+)\s*m/i);
    if(!m)continue;
    const lines=chunk.slice(0,m.index).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const clean=s=>s.replace(/:[a-z_]*(?:place|medal)[a-z_]*:/gi,'')
      .replace(/\s*[–—-]\s*$/,'')
      .replace(/^[^\p{L}\p{N}@<_]+/u,'')
      .replace(/^\d+\s*[.)]\s*/,'')
      .trim();
    let label=lines.length?clean(lines[lines.length-1]):'';
    if(!label&&lines.length>1)label=clean(lines[lines.length-2]);
    if(!label)continue;
    const idm=label.match(/<@!?(\d{15,20})>/);
    const cs=label.match(/\b(\d+S)\s*-\s*(\d+)\b/i);
    const callsign=cs?(cs[1]+'-'+cs[2]).toUpperCase():'';
    const parts=label.replace(/<@!?\d+>/g,'').split('|').map(p=>p.trim()).filter(Boolean);
    const cleaned=parts.map(p=>p.replace(/\b\d+S\s*-\s*\d+\b/gi,'').replace(/\b[A-Z]{2,5}[- ]\d+\b/g,'').replace(/^[A-Z]{2,5}$/,'').replace(/^[@!\s]+/,'').trim()).filter(Boolean);
    const name=(cleaned.length?cleaned[cleaned.length-1]:(parts[parts.length-1]||label)).replace(/^[@!\s]+/,'').trim();
    const key=callsign||('n:'+normName(name));
    if(seen.has(key))continue;
    seen.add(key);
    out.push({key,name,callsign,id:idm?idm[1]:'',played:+m[1]*60+ +m[2],required:+m[3]*60+ +m[4]});
  }
  return out;
}

function colLetter(i){let s='';i++;while(i>0){const r=(i-1)%26;s=String.fromCharCode(65+r)+s;i=Math.floor((i-1)/26);}return s;}

function parseSheet(values){
  let hr=-1;
  for(let i=0;i<Math.min(values.length,40);i++){
    if((values[i]||[]).some(c=>/^callsign/i.test(String(c).trim()))){hr=i;break;}
  }
  if(hr<0)throw new Error('no_header');
  const H=values[hr].map(c=>String(c==null?'':c).trim());
  const find=re=>H.findIndex(c=>re.test(c));
  const cols={rank:find(/^rank/i),name:find(/^name/i),cs:find(/^callsign/i),join:find(/^join/i),pby:find(/^promoted by/i),pdate:find(/^promotion/i),status:find(/^status/i)};
  const counts={};
  for(let i=hr+1;i<values.length;i++)(values[i]||[]).forEach((c,j)=>{if(/^\d{15,20}$/.test(String(c).trim()))counts[j]=(counts[j]||0)+1;});
  let idc=-1,best=0;
  for(const [j,n] of Object.entries(counts))if(n>best){best=n;idc=+j;}
  cols.id=idc;
  const missing=Object.entries(cols).filter(([k,v])=>v<0).map(([k])=>k);
  if(missing.length)throw new Error('missing_cols:'+missing.join(','));
  const rows=[];
  for(let i=hr+1;i<values.length;i++){
    const r=values[i]||[];
    const g=j=>String(r[j]==null?'':r[j]).trim();
    const cs=g(cols.cs).toUpperCase();
    if(!/^\d+S-\d+$/.test(cs))continue;
    rows.push({row:i+1,rank:g(cols.rank),rankIdx:rankIndex(g(cols.rank)),name:g(cols.name),id:g(cols.id),cs,join:g(cols.join),pby:g(cols.pby),pdate:g(cols.pdate),status:g(cols.status)});
  }
  const byCs=new Map(),byRow=new Map();
  rows.forEach(r=>{if(!byCs.has(r.cs))byCs.set(r.cs,r);byRow.set(r.row,r);});
  const isV=r=>r.status.toLowerCase()==='vacant'?0:1;
  const vacant=LADDER.map((_,k)=>rows.filter(r=>r.rankIdx===k&&!r.name&&!r.id).sort((a,b)=>isV(a)-isV(b)||a.row-b.row));
  return {rows,byCs,byRow,vacant,cols};
}

function autoAction(played,rankIdx,s){
  const thr=(rankIdx!==null&&rankIdx<=s.supIdx)?s.supHours:s.doubleHours;
  return played>=thr*60?'double':'single';
}
function findCandidates(e,sheet){
  return sheet.rows.filter(r=>(r.name||r.id)&&sameName(e.name,r.name)).slice(0,6);
}

/* Returns {ready,errors,left}. Pure: takes parsed entries, sheet, fixes and settings. */
function computeAll(entries,sheet,fixes,s){
  const out={ready:[],errors:[],left:[]};
  const used=new Set();
  const sources=new Set();
  for(const e of entries){
    const fx=fixes[e.key]||{};
    if(fx.skip){out.left.push({e,reason:'Left out by you',manual:true});continue;}
    const need=s.minOverride>0?s.minOverride*60:e.required;
    if(e.played<need){out.left.push({e,reason:'Not enough hours ('+fmtMin(e.played)+' of '+fmtMin(need)+')'});continue;}
    if(!sheet){out.errors.push({e,reason:'Load the roster first.',candidates:[]});continue;}
    let row=null,err='';
    if(fx.rowNum)row=sheet.byRow.get(fx.rowNum)||null;
    else{
      const r=e.callsign?sheet.byCs.get(e.callsign):null;
      if(r&&r.name&&sameName(e.name,r.name))row=r;
      else if(r&&!r.name&&!r.id)err='Callsign '+e.callsign+' is an empty slot on the roster.';
      else if(r)err='Callsign '+e.callsign+' belongs to '+r.name+' on the roster, not '+e.name+'.';
      else err=e.callsign?('Callsign '+e.callsign+' is not on the roster.'):'The Discord name has no callsign.';
    }
    if(!row){out.errors.push({e,reason:err||'Not found on the roster.',candidates:findCandidates(e,sheet)});continue;}
    if(sources.has(row.row)){out.errors.push({e,reason:'This officer is already included in another promotion.',candidates:[]});continue;}
    if(row.rankIdx===null){out.left.push({e,row,reason:'Above Branch Director ('+row.rank+'), no promotion'});continue;}
    if(row.rankIdx===0){out.left.push({e,row,reason:'Branch Director, no promotion'});continue;}
    const action=fx.action||autoAction(e.played,row.rankIdx,s);
    const t=Math.max(0,row.rankIdx-(action==='double'?2:1));
    const id=fx.manualId||row.id;
    if(!id){out.errors.push({e,row,needId:true,reason:row.name+' has no Discord ID on the roster. Type it in below.',candidates:[]});continue;}
    const slot=sheet.vacant[t].find(x=>!used.has(x.row));
    if(!slot){out.errors.push({e,row,reason:'There is no empty '+LADDER[t].name+' slot left on the roster.',candidates:[]});continue;}
    used.add(slot.row);
    sources.add(row.row);
    out.ready.push({e,row,idx:row.rankIdx,t,steps:row.rankIdx-t,action,id,slot});
  }
  return out;
}

function buildMessage(ready,s){
  let promos=0;
  const L=['## '+[s.emoji,'Promotions',s.date,s.emoji].filter(Boolean).join(' '),'-'.repeat(44)];
  for(const it of ready){
    L.push('', '__**'+LADDER[it.idx].name+' to '+LADDER[it.t].name+'**__', '<@'+it.id+'> | '+it.slot.cs+' | '+(it.steps===2?'Double':'Single'));
    promos+=it.steps;
  }
  L.push('','TOTAL PROMOS: '+promos);
  return L.join('\n');
}


export { LADDER, rankIndex, parsePromos, parseSheet, computeAll, buildMessage, colLetter, fmtMin };
