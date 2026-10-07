'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const {validate}=require('../scripts/validate-stores.cjs');
const fixture=()=>JSON.parse(fs.readFileSync(path.join(__dirname,'../site/stores/storescan-lab/catalog.json')));
test('published demo tenant validates but internal economics cannot enter its public schema',()=>{assert.equal(validate(fixture()),true);const d=fixture();d.items[0].internal_margin=123;assert.throws(()=>validate(d),/Unapproved public field/);});
test('duplicate IDs and unsafe media block publication',()=>{const d=fixture();d.items.push(d.items[0]);assert.throws(()=>validate(d),/Duplicate product/);const e=fixture();e.items[0].media[0].url='javascript:alert(1)';assert.throws(()=>validate(e),/Unsafe link/);});
test('changed price cannot reuse a release hash',()=>{const d=fixture();d.items[0].variants[0].price_cents++;assert.throws(()=>validate(d),/Release hash mismatch/);});
