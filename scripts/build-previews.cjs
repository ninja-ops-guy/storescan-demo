'use strict';
// Run only trusted main-branch code. PRs supply validated catalog JSON, never executable files.
const fs=require('node:fs'),path=require('node:path'),{validate}=require('./validate-stores.cjs');
async function build({repo,token,fetcher=fetch,root=path.join(__dirname,'../site')}){
 if(!/^[\w.-]+\/[\w.-]+$/.test(repo||''))throw Error('Repository required');
 const api=async route=>{const r=await fetcher('https://api.github.com/repos/'+repo+route,{headers:{Accept:'application/vnd.github+json',...(token?{Authorization:'Bearer '+token}:{})},signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('GitHub preview read failed');return r.json();};
 const prs=await api('/pulls?state=all&sort=updated&direction=desc&per_page=5'),index=[];
 for(const pr of prs){if(pr.head.repo?.full_name!==repo)continue;const files=await api('/pulls/'+pr.number+'/files?per_page=100');if(!files.length||!files.every(f=>/^site\/stores\/[a-z0-9-]+\/catalog\.json$/.test(f.filename)&&f.status!=='removed'))continue;
 const catalogs=[];for(const f of files){const data=await api('/contents/'+f.filename+'?ref='+pr.head.sha);if(data.size>262144)throw Error('Oversized preview catalog');const catalog=JSON.parse(Buffer.from(data.content,'base64'));validate(catalog);catalogs.push({file:f.filename,catalog});}
 const dest=path.join(root,'previews','pr-'+pr.number);fs.mkdirSync(dest,{recursive:true});for(const file of ['index.html','store.js','checkout.js','store.css','stores.json'])fs.copyFileSync(path.join(root,file),path.join(dest,file));for(const folder of ['vendor','stores'])fs.cpSync(path.join(root,folder),path.join(dest,folder),{recursive:true});for(const c of catalogs){const file=path.join(dest,c.file.slice(5));fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(c.catalog,null,2)+'\n');}
 fs.writeFileSync(path.join(dest,'preview.json'),JSON.stringify({pr:pr.number,head:pr.head.sha,commercial_eligibility:false}));index.push({pr:pr.number,head:pr.head.sha,path:'previews/pr-'+pr.number+'/'});
 }
 fs.mkdirSync(path.join(root,'previews'),{recursive:true});fs.writeFileSync(path.join(root,'previews/index.json'),JSON.stringify(index,null,2));return index;
}
module.exports={build};if(require.main===module)build({repo:process.env.GITHUB_REPOSITORY,token:process.env.GITHUB_TOKEN}).then(x=>console.log('Prepared '+x.length+' static catalog previews')).catch(e=>{console.error(e.message);process.exitCode=1;});
