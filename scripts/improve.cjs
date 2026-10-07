'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const VERSION=1;
function improve(catalog,previous={},now=new Date()){
 if(catalog.mode!=='DEMO_ONLY'||!Array.isArray(catalog.items))throw Error('Only demo catalogs can be optimized');
 const seen=new Set(),changes=[],items=[],issues=[];
 for(const p of catalog.items){
  let reason=null;const age=now-Date.parse(p.observed_at);
  if(!Number.isFinite(age)||age< -300000||age>7*86400000)reason='invalid_or_stale_observation';
  let url;try{url=new URL(p.source_url);if(url.protocol!=='https:'||!['thieve.co','www.thieve.co'].includes(url.hostname)||url.username||url.password)reason='unsafe_source';}catch{reason='unsafe_source';}
  const key=url?.pathname.replace(/\/$/,'');if(seen.has(key))reason='duplicate_source';
  if(/scuba|oxygen|knife|weapon|bin laden|medical|supplement|infant|baby/i.test(p.title))reason='specialist_review_required';
  if(reason){changes.push({id:p.id,action:'HIDE',reason});continue;}
  seen.add(key);
  const title=p.title.replace(/\bBPA[ -]?Free\b/gi,'').replace(/\s+/g,' ').trim();
  if(title!==p.title)changes.push({id:p.id,action:'SANITIZE_TITLE',reason:'unsupported_safety_claim'});
  const category=/puzzle|game/i.test(title)?'Play & leisure':/pen|pencil|fineliner|desk/i.test(title)?'Desk & studio':/bottle|bag/i.test(title)?'Everyday carry':/necklace|jewel/i.test(title)?'Accessories':'Other discoveries';
  items.push({id:p.id,title,category,category_basis:'TITLE_INFERENCE'});
 }
 if(catalog.items.some(p=>now-Date.parse(p.observed_at)>48*3600000))issues.push({code:'STALE_DISCOVERY',priority:1,task:'Restore daily discovery before making new recommendations.'});
 if(items.length<10)issues.push({code:'LOW_ELIGIBLE_COVERAGE',priority:2,task:'Find additional eligible candidates; never fill gaps with invented products.'});
 issues.push({code:'DEMAND_EVIDENCE_MISSING',priority:1,task:'Connect Kalodata and Google Trends observations before selecting real product tests.'},{code:'OUTCOME_MEASUREMENT_MISSING',priority:2,task:'Connect aggregate visitor and commercial outcomes before optimizing for conversion.'});
 const evidence=crypto.createHash('sha256').update(JSON.stringify(catalog)).digest('hex');
 const config={version:VERSION,source_hash:evidence,source_scan:catalog.scan_id,items,categories:[...new Set(items.map(p=>p.category))].sort(),changes,metrics:{input_count:catalog.items.length,visible_count:items.length,suppressed_count:catalog.items.length-items.length,title_claims_removed:changes.filter(c=>c.action==='SANITIZE_TITLE').length},backlog:issues,learning_basis:'CATALOG_QUALITY_ONLY',conversion_lift:null};
 const signature=crypto.createHash('sha256').update(JSON.stringify(config)).digest('hex');
 const history=Array.isArray(previous.history)?previous.history.slice(-30):[];
 if(previous.signature!==signature){if(history.length===30)history.shift();history.push({at:now.toISOString(),signature,source_scan:catalog.scan_id,changes,metrics:config.metrics,reason:'Measured catalog quality checks; no sales or conversion inference.'});}
 return {...config,signature,history};
}
module.exports={improve};
if(require.main===module){const root=path.join(__dirname,'..'),file=path.join(root,'site/experience.json');const catalog=JSON.parse(fs.readFileSync(path.join(root,'site/catalog.json')));const old=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{};const next=improve(catalog,old);fs.writeFileSync(file,JSON.stringify(next,null,2)+'\n');console.log(JSON.stringify({changed:old.signature!==next.signature,metrics:next.metrics,backlog:next.backlog.map(x=>x.code)}));}
