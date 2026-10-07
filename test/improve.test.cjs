'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');const {improve}=require('../scripts/improve.cjs');
const now=new Date('2026-10-07T12:00:00Z');
const item=(id,title='Desk lamp')=>({id,title,source_url:'https://thieve.co/products/'+id,observed_at:now.toISOString()});
const cat=items=>({mode:'DEMO_ONLY',scan_id:'s1',items});
test('feedback makes reversible quality changes without modifying source data',()=>{const data=cat([item('a','BPA Free Bottle'),item('b','Scuba kit'),item('c')]);const copy=JSON.stringify(data);const r=improve(data,{},now);assert.equal(r.metrics.visible_count,2);assert.equal(r.items[0].title,'Bottle');assert.equal(r.metrics.suppressed_count,1);assert.equal(r.conversion_lift,null);assert.equal(JSON.stringify(data),copy);});
test('unchanged evidence does not create repeated changes or unbounded history',()=>{const c=cat([item('a')]),a=improve(c,{},now),b=improve(c,a,now);assert.deepEqual(a,b);assert.equal(b.history.length,1);});
test('duplicate, stale and unsafe entries never reach the derived catalog',()=>{const a=item('a'),b={...item('b'),source_url:a.source_url},c={...item('c'),observed_at:'2020-01-01'},d={...item('d'),source_url:'javascript:alert(1)'};const r=improve(cat([a,b,c,d]),{},now);assert.deepEqual(r.items.map(p=>p.id),['a']);assert.equal(r.metrics.suppressed_count,3);});
test('stale suppression reverses when fresh observations arrive',()=>{const c=cat([{...item('a'),observed_at:'2020-01-01'}]),a=improve(c,{},now);const b=improve(cat([item('a')]),a,now);assert.equal(a.items.length,0);assert.equal(b.items.length,1);assert.equal(b.history.length,2);});
