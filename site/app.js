'use strict';
const el=(tag,text,parent)=>{const node=document.createElement(tag);if(text)node.textContent=text;parent?.append(node);return node;};
const tones=['#dfe7ca','#e9dacc','#dce5e2','#e9dfb8','#d7deed','#e4d9df'];
(async()=>{try{
 const r=await fetch('catalog.json',{cache:'no-store'});if(!r.ok)throw Error('Catalog unavailable');const data=await r.json();if(data.mode!=='DEMO_ONLY'||!Array.isArray(data.items))throw Error('Invalid catalog');
 document.querySelector('#count').textContent=data.items.length+' discovery candidates';document.querySelector('#updated').textContent='Source updated '+new Date(data.updated_at).toLocaleDateString('en-US');
 const age=Date.now()-Date.parse(data.updated_at);document.querySelector('#status').textContent=age>48*3600000?'Last saved collection — discovery is overdue. All items remain unverified.':'Latest saved collection · all items require further research';
 const render=()=>{const grid=document.querySelector('#catalog');grid.replaceChildren();const query=document.querySelector('#search').value.toLowerCase();const rows=data.items.filter(p=>p.title.toLowerCase().includes(query));
 rows.forEach((p,i)=>{const card=el('article',null,grid),visual=el('div',null,card);visual.className='visual';visual.style.setProperty('--tone',tones[i%tones.length]);el('span','RESEARCH CANDIDATE',visual).className='badge';el('div',null,visual).className='shape';el('h3',p.title,card);el('p',p.description,card);const bottom=el('div',null,card);bottom.className='bottom';el('span','Price pending',bottom);const url=new URL(p.source_url);if(url.protocol==='https:'&&['thieve.co','www.thieve.co'].includes(url.hostname)){const a=el('a','View discovery ↗',bottom);a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';}const note=el('p','Demo item · unavailable for purchase',card);note.className='availability';});if(!rows.length)el('p','No matching candidates.',grid);};
 document.querySelector('#search').addEventListener('input',render);render();
}catch(e){document.querySelector('#status').textContent='The catalog could not load. Please try again later.';}})();
