'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
test('public catalog contains only bounded, unverified demo items without internal data',()=>{
 const d=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../site/catalog.json')));assert.equal(d.mode,'DEMO_ONLY');assert.equal(d.market,'US');assert(d.items.length>0&&d.items.length<=10);assert(Number.isFinite(Date.parse(d.updated_at)));assert.equal(new Set(d.items.map(x=>x.id)).size,d.items.length);
 for(const p of d.items){assert.deepEqual(Object.keys(p).sort(),['id','title','description','source_url','observed_at','price','currency','status','demo'].sort());assert.equal(p.demo,true);assert.equal(p.price,null);assert.equal(p.status,'RESEARCH_REQUIRED');assert(p.title.length<=120);const u=new URL(p.source_url);assert.equal(u.protocol,'https:');assert(['thieve.co','www.thieve.co'].includes(u.hostname));assert(!u.username&&!u.password&&!u.search);}
});
