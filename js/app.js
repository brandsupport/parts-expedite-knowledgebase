/* Parts Expedite Knowledge Base — front-end preview only.
   Local browser storage is used to demonstrate the product flows. It is not authentication,
   shared storage, secure permissions, or the final content database. */
const CATEGORIES = [
  {id:'all',name:'All knowledge',icon:'▦'},
  {id:'backorders',name:'Backorders & ETA',icon:'◷'},
  {id:'delivery',name:'Order status & delivery',icon:'⇢'},
  {id:'parts',name:'Parts & supersessions',icon:'⚙'},
  {id:'mobility',name:'Mobility & special vehicles',icon:'🚗'},
  {id:'calls',name:'Calls & case logging',icon:'☎'},
  {id:'systems',name:'Systems & portals',icon:'⌘'},
  {id:'stock',name:'Stock & availability',icon:'▣'},
  {id:'exceptions',name:'Exceptions & escalations',icon:'⚠'}
];
const AVATARS = [
  ['Amber Sentinel','avatars/amber-sentinel.svg'],['Turbo Fox','avatars/turbo-fox.svg'],
  ['Torque Titan','avatars/torque-titan.svg'],['Gear Guardian','avatars/gear-guardian.svg'],
  ['Spark Scout','avatars/spark-scout.svg'],['Piston Knight','avatars/piston-knight.svg'],
  ['Rally Rogue','avatars/rally-rogue.svg'],['Night Shift','avatars/night-shift.svg']
];
const SEED_ARTICLES = window.PE_IMPORTED_ARTICLES || [];
const state = {
  role: localStorage.getItem('pe-preview-role') || 'member',
  backendActive:false, currentUser:null,
  name: localStorage.getItem('pe-preview-name') || 'Momo',
  avatar: localStorage.getItem('pe-preview-avatar') || AVATARS[0][1],
  favorites: loadJSON('pe-favorites',[]),
  articles: loadArticleLibrary(),
  submissions: loadJSON('pe-submissions',[]),
  revisions: loadJSON('pe-revisions',[]),
  recycle: loadJSON('pe-recycle',[]),
  revisionHistory: loadJSON('pe-revision-history',[]),
  activeCategory:'all', adminTab:'overview', search:'', editingId:null
};
const view = document.getElementById('view');
const toastEl = document.getElementById('toast');
let toastTimer;
function loadJSON(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value===null?structuredClone(fallback):value;}catch{return structuredClone(fallback);}}
function loadArticleLibrary(){
  const stored=loadJSON('pe-articles',null);
  if(!Array.isArray(stored))return structuredClone(SEED_ARTICLES);
  const merged=new Map(SEED_ARTICLES.map(article=>[String(article.id),structuredClone(article)]));
  stored.filter(article=>!article.sample).forEach(article=>{
    const id=String(article.id);
    merged.set(id,{...(merged.get(id)||{}),...article});
  });
  return [...merged.values()];
}
function saveState(){localStorage.setItem('pe-preview-role',state.role);localStorage.setItem('pe-preview-name',state.name);localStorage.setItem('pe-preview-avatar',state.avatar);localStorage.setItem('pe-favorites',JSON.stringify(state.favorites));localStorage.setItem('pe-articles',JSON.stringify(state.articles));localStorage.setItem('pe-submissions',JSON.stringify(state.submissions));localStorage.setItem('pe-revisions',JSON.stringify(state.revisions));localStorage.setItem('pe-recycle',JSON.stringify(state.recycle));localStorage.setItem('pe-revision-history',JSON.stringify(state.revisionHistory));}
function escapeHTML(value=''){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function toast(message){toastEl.textContent=message;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),3200);}

async function backendRequest(path,options={}){
  const headers=new Headers(options.headers||{});
  if(options.body&&!(options.body instanceof FormData))headers.set('Content-Type','application/json');
  const response=await fetch(path,{credentials:'same-origin',...options,headers});
  let data={};try{data=await response.json();}catch{}
  if(!response.ok)throw new Error(data.error||data.message||('Request failed ('+response.status+').'));
  return data;
}
function mapBackendArticle(a){
  return {id:a.id,title:a.title,category:a.category,tags:a.tags||[],summary:a.summary||'',body:a.body||'',
    updated:a.updatedAt||a.updated||new Date().toISOString(),author:'Parts Expedite Team',status:a.status||'published',
    sourceDocument:a.sourceDocument||null,sourcePages:a.sourcePages||null,imported:!!a.sourceDocument,
    images:a.images||[],sample:false};
}
async function refreshBackendData(){
  const me=await backendRequest('/api/auth/me');
  state.currentUser=me.user||null;
  state.role=state.currentUser?.role||'member';
  state.name=state.currentUser?.displayName||'Guest';
  state.avatar=state.currentUser?.avatarKey||'avatars/amber-sentinel.svg';
  const articles=await backendRequest('/api/articles');
  state.articles=(articles.articles||[]).map(mapBackendArticle);
  state.favorites=[];
  if(state.currentUser){
    const saved=await backendRequest('/api/favorites');
    state.favorites=(saved.favorites||[]).map(String);
  }
}
async function initializeBackend(){
  try{
    const response=await fetch('/api/health',{credentials:'same-origin',cache:'no-store'});
    if(!response.ok)return;
    const health=await response.json();
    if(!health.ok)return;
    state.backendActive=true;
    await refreshBackendData();
    renderRoute();
  }catch(error){
    state.backendActive=false;
  }
}
async function submitAuthToBackend(form){
  const route=form.dataset.authForm,inputs=[...form.querySelectorAll('input')];
  try{
    if(route==='login'){
      const result=await backendRequest('/api/auth/login',{method:'POST',body:JSON.stringify({email:inputs[0]?.value,password:inputs[1]?.value})});
      state.currentUser=result.user;await refreshBackendData();go('home');toast('Signed in successfully.');
    }else if(route==='signup'){
      const result=await backendRequest('/api/auth/register',{method:'POST',body:JSON.stringify({displayName:inputs[0]?.value,email:inputs[1]?.value,password:inputs[2]?.value})});
      toast(result.message||'Account request submitted.');go('login');
    }else{
      toast('Password recovery will be enabled after the email service is connected.');
    }
  }catch(error){toast(error.message);}
}
async function submitArticleToBackend(form){
  const fd=new FormData(form),payload={
    title:String(fd.get('title')||'').trim(),category:String(fd.get('category')||''),
    tags:String(fd.get('tags')||'').split(',').map(x=>x.trim()).filter(Boolean),
    body:String(fd.get('body')||'').trim(),summary:String(fd.get('body')||'').trim().replace(/[#*\n-]/g,' ').slice(0,150),
    sourceDocument:String(fd.get('reference')||'').trim(),changeNote:String(fd.get('changeNote')||'').trim()
  };
  if(payload.title.length<3||payload.body.length<10){toast('Please complete the required fields.');return;}
  const files=[...(document.getElementById('articleFiles')?.files||[])];
  if(files.length&&state.currentUser?.role==='member'){toast('Members can submit the guide for review; image attachments require an Authorized Editor at this stage.');return;}
  try{
    const editing=!!state.editingId;
    const path=editing?'/api/articles/'+encodeURIComponent(state.editingId):'/api/articles';
    const result=await backendRequest(path,{method:editing?'PUT':'POST',body:JSON.stringify(payload)});
    const articleId=result.article?.id||state.editingId;
    if(articleId&&files.length){
      for(const file of files){
        const upload=new FormData();upload.append('file',file);upload.append('alt',file.name);upload.append('caption',file.name);
        await backendRequest('/api/articles/'+encodeURIComponent(articleId)+'/images',{method:'POST',body:upload});
      }
    }
    state.editingId=null;await refreshBackendData();go(editing?'article/'+articleId:'articles');
    toast(result.status==='pending'?'Sent to the administrator review queue.':'Article saved to the shared library.');
  }catch(error){toast(error.message);}
}
async function toggleBackendFavorite(id){
  if(!state.currentUser){go('login');toast('Sign in to save articles.');return;}
  const exists=state.favorites.includes(String(id));
  try{
    await backendRequest('/api/favorites/'+encodeURIComponent(id),{method:exists?'DELETE':'PUT'});
    const saved=await backendRequest('/api/favorites');state.favorites=(saved.favorites||[]).map(String);
    renderRoute();toast(exists?'Removed from saved guides.':'Saved to your library.');
  }catch(error){toast(error.message);}
}

function roleLabel(role=state.role){
  if(state.backendActive)return state.currentUser?({admin:'Administrator',editor:'Authorized Editor',member:'Member'}[state.currentUser.role]||'Member'):'Not signed in';
  return role==='admin'?'Administrator preview':role==='editor'?'Authorized editor preview':'Member preview';
}
function getArticle(id){return state.articles.find(a=>String(a.id)===String(id));}
function getCategory(id){return CATEGORIES.find(c=>c.id===id)?.name||'Knowledge Base';}
function shortDate(value){if(!value||value==='Preview content')return 'Preview content';return new Date(value).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});}
function banner(){
  if(state.backendActive)return '<div class="preview-banner"><span class="notice-icon">✓</span><div><strong>Connected to the shared Parts Expedite workspace</strong>Accounts, article content and permissions are served by the Cloudflare backend.</div></div>';
  return '<div class="preview-banner"><span class="notice-icon">ⓘ</span><div><strong>Front-end preview · backend not connected</strong>Forms, roles, submissions and edits demonstrate the intended workflow in this browser only. Nothing is shared with other users or published to a live knowledge base yet.</div></div>';
}
function titleBlock(kicker,title,subtitle,action=''){return `<div class="eyebrow">${escapeHTML(kicker)}</div><div class="section-head" style="align-items:start;margin:8px 0 0"><div><h1 class="page-heading">${title}</h1><p class="page-intro">${escapeHTML(subtitle)}</p></div>${action}</div>`;}
function stat(icon,value,label){return `<div class="stat-card"><span class="stat-icon">${icon}</span><div><strong>${value}</strong><small>${label}</small></div></div>`;}
function articleCard(article){
  const saved=state.favorites.includes(String(article.id));
  const tags=(article.tags||[]).slice(0,4).map(tag=>'<button type="button" class="article-card-tag" data-tag="'+escapeHTML(tag)+'" title="Search this tag">'+escapeHTML(tag)+'</button>').join('');
  return '<article class="article-card surface surface-hover"><div class="article-card-top"><span class="article-symbol">'+(CATEGORIES.find(c=>c.id===article.category)?.icon||'▤')+'</span><button class="favorite-button '+(saved?'saved':'')+'" data-favorite="'+escapeHTML(article.id)+'" title="'+(saved?'Remove from saved':'Save article')+'">'+(saved?'★':'☆')+'</button></div><span class="pill" style="width:max-content;margin-top:11px">'+escapeHTML(getCategory(article.category))+'</span><h3>'+escapeHTML(article.title)+'</h3><p>'+escapeHTML(article.summary||'')+'</p><div class="article-card-tags">'+tags+'</div><div class="article-card-foot"><span class="article-meta">'+escapeHTML(article.id)+' · '+escapeHTML(shortDate(article.updated))+'</span><button class="article-open" data-open-article="'+escapeHTML(article.id)+'">OPEN GUIDE ↗</button></div></article>';
}
function renderHome(){const published=state.articles.length;const pending=state.submissions.filter(x=>x.status==='pending').length;return `${banner()}<section class="hero-panel"><div class="hero-copy"><div class="eyebrow">THE PARTS EXPEDITE KNOWLEDGE HUB</div><h1 class="hero-title">Keep parts<br>moving. Keep <span>knowledge</span><br>working.</h1><p class="hero-subtitle">Your team's home for clear answers, practical processes and the know-how that keeps every enquiry moving forward.</p><div class="hero-actions"><button class="btn" data-route="articles">Explore the library <b>→</b></button><button class="btn secondary" data-route="submit">Share your knowledge <b>＋</b></button></div></div><div class="hero-visual"><span class="hero-bolt one">✦</span><div class="hero-wheel"><span>⚙</span></div><span class="hero-bolt two">✧</span></div></section>
<div class="stat-grid">${stat('▤',published,'LIBRARY ARTICLES')}${stat('↗',state.submissions.length,'YOUR SUBMISSIONS')}${stat('☆',state.favorites.length,'SAVED GUIDES')}${stat('◷',pending,'AWAITING REVIEW')}</div>
<div class="home-grid"><div><div class="section-head"><div><h2>Jump back into the knowledge</h2><p>Browse the areas that help the team move faster.</p></div><button class="text-link" data-route="articles">VIEW ALL ARTICLES ↗</button></div><div class="quick-grid"><button class="quick-card" data-route="articles"><span class="quick-icon">▤</span><h3>Knowledge library</h3><p>Find processes, reference guides and practical answers.</p><span class="quick-arrow">↗</span></button><button class="quick-card" data-route="submit"><span class="quick-icon">＋</span><h3>Submit an article</h3><p>Turn what you know into something the whole team can use.</p><span class="quick-arrow">↗</span></button><button class="quick-card" data-route="games"><span class="quick-icon">⚡</span><h3>Knowledge games</h3><p>Four new team games are planned for this space.</p><span class="quick-arrow">↗</span></button></div>
<div class="section-head"><div><h2>Recently added to the library</h2><p>Source reference articles imported from the team’s guide.</p></div></div><div class="article-grid">${state.articles.slice(0,3).map(articleCard).join('')}</div></div>
<aside class="side-stack"><div class="side-panel surface"><h3>✦ Team activity</h3><div class="activity-item"><span class="activity-dot"></span><div><strong>Workspace foundations are in place</strong><small>Parts Expedite front-end preview</small></div></div><div class="activity-item"><span class="activity-dot"></span><div><strong>Four game spaces reserved</strong><small>Game design is a later project phase</small></div></div><div class="activity-item"><span class="activity-dot"></span><div><strong>Built-in content tools mapped</strong><small>Backend configuration comes next</small></div></div></div><div class="tip-box"><strong>THE PARTS EXPEDITE PRINCIPLE</strong><p>Clear information. Useful handovers. One place for the knowledge that keeps parts moving.</p></div><div class="side-panel surface"><h3>✧ Preview controls</h3><p class="muted" style="font-size:10px;margin:0 0 12px">Switch demo roles to inspect member, editor and administrator screens.</p><button class="btn secondary" data-action="choose-role" style="width:100%">Change preview role ↗</button></div></aside></div>`;}
function renderArticles(){
  const articles=state.articles.filter(a=>{
    const categoryMatch=state.activeCategory==='all'||a.category===state.activeCategory;
    const haystack=[a.title,a.summary,a.body,...(a.tags||[])].join(' ').toLowerCase();
    return categoryMatch&&haystack.includes(state.search.toLowerCase());
  });
  const countFor=id=>id==='all'?state.articles.length:state.articles.filter(a=>a.category===id).length;
  return `${titleBlock('KNOWLEDGE LIBRARY','Find the <span class="accent">right answer.</span>','Browse 30 imported reference articles across the team’s processes, systems and parts scenarios.','<button class="btn" data-route="submit">＋ Submit article</button>')}
  <div class="library-layout"><aside class="filter-panel surface"><h3>EXPLORE BY CATEGORY</h3><div class="filter-list">${CATEGORIES.map(c=>`<button class="filter-button ${state.activeCategory===c.id?'active':''}" data-category="${c.id}"><span>${c.icon} &nbsp;${escapeHTML(c.name)}</span><small>${countFor(c.id)}</small></button>`).join('')}</div></aside><div><div class="library-toolbar"><label class="inline-search"><span>⌕</span><input id="librarySearch" value="${escapeHTML(state.search)}" placeholder="Search title, tags or topic…"></label><select class="sort-select" id="sortArticles"><option value="new">Recently updated</option><option value="az">Title A–Z</option></select><span class="pill">${articles.length} RESULTS</span></div>${articles.length?`<div class="article-grid" id="articleResults">${articles.map(articleCard).join('')}</div>`:`<div class="empty-state"><div class="empty-icon">⌕</div><h3>No matching guides</h3><p>Try another phrase or choose a different category.</p><button class="btn secondary" data-action="clear-search">Clear filters</button></div>`}</div></div>`;
}
function bodyToHTML(body){
  const lines=String(body||'').split(/\r?\n/),out=[];
  let listType=null,listItems=[];
  function flushList(){
    if(!listItems.length)return;
    const tag=listType==='ol'?'ol':'ul';
    out.push('<'+tag+'>'+listItems.map(item=>'<li>'+escapeHTML(item)+'</li>').join('')+'</'+tag+'>');
    listType=null;listItems=[];
  }
  for(const raw of lines){
    const s=raw.trim();
    if(!s){flushList();continue;}
    if(s.startsWith('### ')){flushList();out.push('<h4>'+escapeHTML(s.slice(4))+'</h4>');continue;}
    if(s.startsWith('## ')){flushList();out.push('<h3>'+escapeHTML(s.slice(3))+'</h3>');continue;}
    const ordered=s.match(/^\d+[.)]\s+(.*)$/);
    if(ordered){if(listType!=='ol'){flushList();listType='ol';}listItems.push(ordered[1]);continue;}
    if(/^[-•]\s+/.test(s)){if(listType!=='ul'){flushList();listType='ul';}listItems.push(s.replace(/^[-•]\s+/,''));continue;}
    flushList();
    if(/^(note|important|warning):/i.test(s))out.push('<div class="detail-callout">'+escapeHTML(s)+'</div>');
    else out.push('<p>'+escapeHTML(s)+'</p>');
  }
  flushList();
  return out.join('');
}
function renderArticle(id){
  const article=getArticle(id);
  if(!article)return '<div class="empty-state"><div class="empty-icon">?</div><h3>Guide not found</h3><p>This article may have been removed in the preview workspace.</p><button class="btn" data-route="articles">Back to library</button></div>';
  const source=(article.sourceDocument||article.sourcePages||article.imported)?'<div class="source-note"><strong>Source reference</strong><span>'+escapeHTML(article.sourceDocument||'BlueLight Cases-combined.pdf')+' · PDF pages '+escapeHTML(article.sourcePages||'recorded in the source')+'</span><p>Imported from the team’s source document. Check that the process and contact details remain current before acting on this guidance.</p></div>':'';
  const tags=(article.tags||[]).map(tag=>'<button type="button" class="pill" data-tag="'+escapeHTML(tag)+'"># '+escapeHTML(tag)+'</button>').join('');
  const imageRows=state.backendActive?((article.images&&article.images.length)?article.images:(window.PE_ARTICLE_IMAGE_MANIFEST?.[article.id]||[])):[];
  const gallery=imageRows.length?'<section class="article-images"><h3>Visual guide</h3><div class="article-image-grid">'+imageRows.map((img,i)=>'<figure class="article-image"><a href="/api/media/'+escapeHTML(img.id)+'" target="_blank" rel="noopener"><img loading="lazy" src="/api/media/'+escapeHTML(img.id)+'" alt="'+escapeHTML(img.alt||img.caption||'Article screenshot')+'"></a><figcaption>PDF page '+escapeHTML(img.sourcePage||img.page||'')+' · '+escapeHTML(img.caption||img.alt||'Reference screenshot')+'</figcaption></figure>').join('')+'</div></section>':'';
  return banner()+'<article class="article-detail surface"><div class="detail-actions"><button class="text-link" data-route="articles">← BACK TO LIBRARY</button><div class="admin-actions"><button class="btn secondary small" data-favorite="'+escapeHTML(article.id)+'">'+(state.favorites.includes(String(article.id))?'★ Saved':'☆ Save guide')+'</button><button class="btn secondary small" data-edit-article="'+escapeHTML(article.id)+'">Edit / suggest update ✎</button></div></div><span class="pill amber" style="margin-top:22px">'+escapeHTML(getCategory(article.category))+'</span><h1 class="detail-title">'+escapeHTML(article.title)+'</h1><div class="detail-meta"><span>'+escapeHTML(article.id)+'</span><span>·</span><span>UPDATED '+escapeHTML(shortDate(article.updated).toUpperCase())+'</span><span>·</span><span>BY '+escapeHTML(article.author||'PARTS EXPEDITE TEAM').toUpperCase()+'</span></div><div class="detail-body">'+bodyToHTML(article.body)+'</div>'+gallery+'<div class="detail-foot">'+tags+'</div>'+source+'</article>';
}
function renderSubmit(editId=null){const article=editId?getArticle(editId):null;state.editingId=editId;return `${titleBlock(article?'EDIT / SUGGEST A CHANGE':'CONTRIBUTE TO THE LIBRARY',article?'Improve the <span class="accent">knowledge.</span>':'Share what <span class="accent">you know.</span>',article?'Suggest a correction or improvement to an existing guide.':'Create a practical guide that helps your colleagues resolve enquiries with confidence.')}${banner()}<form id="articleForm" class="form-layout"><section class="form-card surface"><h2 class="form-section-title">Article details</h2><div class="form-grid"><div class="field full"><label for="articleTitle">Article title <span>· required</span></label><input id="articleTitle" name="title" required maxlength="180" minlength="3" value="${escapeHTML(article?.title||'')}" placeholder="Give your guide a clear, searchable title"></div><div class="field"><label for="articleCategory">Category <span>· required</span></label><select id="articleCategory" name="category" required>${CATEGORIES.filter(c=>c.id!=='all').map(c=>`<option value="${c.id}" ${article?.category===c.id?'selected':''}>${escapeHTML(c.name)}</option>`).join('')}</select></div><div class="field"><label for="articleTags">Search tags</label><input id="articleTags" name="tags" value="${escapeHTML(article?.tags?.join(', ')||'')}" placeholder="part number, supplier, backorder"><span class="hint">Separate tags with commas.</span></div><div class="field full"><label for="articleBody">Guide content <span>· required</span></label><textarea id="articleBody" name="body" minlength="10" maxlength="30000" required placeholder="Write the steps clearly. Use a blank line between paragraphs, ## for a section heading, and - for bullet points.">${escapeHTML(article?.body||'')}</textarea><div class="char-count" id="bodyCount">0 / 30,000</div></div><div class="field full"><label for="articleReference">Source / reference</label><input id="articleReference" name="reference" value="${escapeHTML(article?.reference||'')}" placeholder="Policy, system reference, supplier document or internal owner"></div><div class="field full"><label>Supporting images / files</label><div class="upload-zone">Attachment picker preview — file storage will be connected with the backend<input type="file" id="articleFiles" multiple accept="image/jpeg,image/png,image/webp"></div></div></div><div class="form-footer"><span class="muted" style="font-size:9px">${article?'Your update will follow the selected preview role’s permission rules.':'New articles follow the selected preview role’s permission rules.'}</span><div style="display:flex;gap:8px"><button type="button" class="btn ghost" data-route="articles">Cancel</button><button type="submit" class="btn">${article?'Submit update':'Submit article'} →</button></div></div></section><aside class="form-aside surface"><h3>Make it useful</h3><p>Clear, structured knowledge is easier to find and easier to follow.</p><div class="guideline"><span>✦</span><div><b>Start with the outcome.</b><br>Say what the colleague will be able to do.</div></div><div class="guideline"><span>01</span><div><b>Use numbered steps.</b><br>Keep one action in each step.</div></div><div class="guideline"><span>▤</span><div><b>Add helpful references.</b><br>Include links, codes and owners where appropriate.</div></div><div class="guideline"><span>✓</span><div><b>Check before submitting.</b><br>Remove outdated details and explain exceptions.</div></div><div class="tip-box" style="margin-top:15px"><strong>PREVIEW PERMISSIONS</strong><p>${state.role==='member'?'Member: your new guide or edit suggestion enters the review queue.':state.role==='editor'?'Authorized Editor: your contribution is published directly.':'Administrator: your contribution is published directly; you can also review member submissions.'}</p></div></aside></form>`;}
function renderGames(){const games=[['Parts Rush','🏁','A quick-fire challenge built around speed, recall and accurate answers.'],['Parts Puzzle','🧩','Piece together the details and connect the right information.'],['Parts Quiz','💡','Test product, process and parts knowledge in short rounds.'],['Parts Match','🃏','Match references, descriptions and the details that belong together.']];return `${titleBlock('LEARN BY PLAYING','The knowledge <span class="accent">garage.</span>','Four original game spaces are reserved for Parts Expedite. We’ll design each experience together in a later phase.')}<div class="preview-banner" style="margin-top:22px"><span class="notice-icon">⚡</span><div><strong>Game development is intentionally parked</strong>These are themed placeholders only. No existing Brand Support games have been copied into this project.</div></div><div class="games-grid">${games.map(([name,icon,desc],i)=>`<article class="game-card surface surface-hover"><div class="game-art">${icon}</div><div><span class="pill amber">GAME ${String(i+1).padStart(2,'0')} · COMING LATER</span><h3>${name}</h3><p>${desc}</p><button class="btn secondary small" disabled>Design phase pending</button></div></article>`).join('')}</div>`;}
function renderFavorites(){const list=state.articles.filter(a=>state.favorites.includes(String(a.id)));return `${titleBlock('YOUR SPACE','Your saved <span class="accent">guides.</span>','Keep the references you return to most close at hand.')}<div style="margin-top:22px">${list.length?`<div class="article-grid">${list.map(articleCard).join('')}</div>`:`<div class="empty-state"><div class="empty-icon">☆</div><h3>Your saved library starts here</h3><p>Save any guide with the star icon and it will appear in this space.</p><button class="btn" data-route="articles">Explore articles</button></div>`}</div>`;}
function renderProfile(){
  const avatar=escapeHTML(state.avatar);
  const contributions=[...state.submissions.map(x=>({...x,kind:'New article'})),...state.revisions.map(x=>({...x,kind:'Edit suggestion'}))].sort((a,b)=>String(b.created||'').localeCompare(String(a.created||'')));
  const contributionMarkup=contributions.length?`<div class="admin-list">${contributions.map(item=>`<article class="admin-item surface"><div><span class="pill ${item.status==='pending'?'amber':item.status==='rejected'?'red':'green'}">${escapeHTML((item.status||'pending').toUpperCase())}</span><h3>${escapeHTML(item.article?.title||'Untitled contribution')}</h3><p>${escapeHTML(item.kind)} · ${escapeHTML(item.id||'Preview')} · ${escapeHTML(shortDate(item.created))}</p></div><span class="article-meta">${escapeHTML(getCategory(item.article?.category))}</span></article>`).join('')}</div>`:`<div class="empty-state"><div class="empty-icon">＋</div><h3>No contributions yet</h3><p>Your article submissions and edit suggestions will be tracked here.</p><button class="btn secondary" data-route="submit">Create an article</button></div>`;
  return `${titleBlock('YOUR PROFILE','Your Parts Expedite <span class="accent">identity.</span>','Profile, avatar and personal preview settings.')}${banner()}<div class="profile-layout"><section class="profile-card surface"><img class="profile-portrait" src="${avatar}" alt="Selected superhero avatar"><h2>${escapeHTML(state.name)}</h2><p>${escapeHTML(roleLabel())}</p><span class="pill amber">LOCAL PREVIEW PROFILE</span><div style="margin-top:17px;display:flex;gap:7px;justify-content:center;flex-wrap:wrap"><button class="btn secondary" data-action="change-name">Edit display name</button><button class="btn secondary" data-action="choose-role">Preview role</button></div><div class="tip-box" style="margin-top:17px;text-align:left"><strong>ACCOUNT / SECURITY</strong><p>Login, account approval, password reset and secure sessions will be wired to the backend later. This preview does not authenticate anyone.</p><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button class="btn ghost small" data-route="login">Sign in UI</button><button class="btn ghost small" data-route="signup">Sign up UI</button><button class="btn ghost small" data-route="forgot-password">Recovery UI</button></div></div></section><section class="avatar-picker surface"><h2 class="form-section-title">Choose your hero avatar</h2><p class="muted" style="font-size:10px;margin-top:-7px">Original Parts Expedite character portraits.</p><div class="avatar-grid">${AVATARS.map(([name,src])=>`<button class="avatar-choice ${state.avatar===src?'selected':''}" data-avatar="${src}" title="${name}"><img src="${src}" alt="${name}"></button>`).join('')}</div><div class="form-footer" style="margin-top:18px"><span class="muted" style="font-size:9px">${contributions.length} contribution activity items in this preview</span><button class="btn" data-route="submit">Submit a guide →</button></div></section></div><div class="section-head"><div><h2>My submissions & edit suggestions</h2><p>Preview statuses for your own contributions.</p></div></div>${contributionMarkup}`;
}
function renderAuth(route){
  const config={login:{kicker:'WELCOME BACK',title:'Sign in to your <span class="accent">workspace.</span>',intro:'The sign-in experience for approved Parts Expedite colleagues.',heading:'Account sign-in',fields:`<div class="field full"><label>Email address</label><input type="email" required placeholder="name@company.com" autocomplete="username"></div><div class="field full"><label>Password</label><input type="password" required placeholder="Enter your password" autocomplete="current-password"></div>`,button:'Sign in'},signup:{kicker:'JOIN THE TEAM',title:'Get access to <span class="accent">the knowledge.</span>',intro:'Request an account. New registrations will require administrator approval.',heading:'Create your account',fields:`<div class="field full"><label>Full name</label><input required minlength="2" placeholder="Your name" autocomplete="name"></div><div class="field full"><label>Work email</label><input type="email" required placeholder="name@company.com" autocomplete="email"></div><div class="field full"><label>Create password</label><input type="password" required minlength="10" placeholder="At least 10 characters" autocomplete="new-password"><span class="hint">The production service will enforce password and session security server-side.</span></div>`,button:'Request access'},'forgot-password':{kicker:'ACCOUNT RECOVERY',title:'Get back into <span class="accent">your account.</span>',intro:'Request help with a forgotten password. The finished system will route this securely to an administrator.',heading:'Password recovery request',fields:`<div class="field full"><label>Work email</label><input type="email" required placeholder="name@company.com" autocomplete="email"></div><div class="field full"><label>Additional context <span>· optional</span></label><textarea placeholder="Add any helpful details"></textarea></div>`,button:'Send recovery request'},'change-password':{kicker:'ACCOUNT SECURITY',title:'Update your <span class="accent">password.</span>',intro:'The password-change screen will be connected to secure authenticated sessions in the backend phase.',heading:'Change password',fields:`<div class="field full"><label>Current password</label><input type="password" required autocomplete="current-password"></div><div class="field full"><label>New password</label><input type="password" required minlength="10" autocomplete="new-password"></div><div class="field full"><label>Confirm new password</label><input type="password" required minlength="10" autocomplete="new-password"></div>`,button:'Update password'}};
  const c=config[route];
  return `${titleBlock(c.kicker,c.title,c.intro)}${banner()}<div class="form-layout" style="max-width:950px"><form class="form-card surface" data-auth-form="${route}"><h2 class="form-section-title">${c.heading}</h2><div class="form-grid">${c.fields}</div><div class="form-footer"><span class="muted" style="font-size:9px">Preview screen · backend not connected</span><button class="btn" type="submit">${c.button} →</button></div></form><aside class="form-aside surface"><h3>Parts Expedite access</h3><p>Access is designed around clear account roles and controlled publishing rights.</p><div class="guideline"><span>01</span><div><b>Member</b><br>Submit articles and suggest edits for administrator review.</div></div><div class="guideline"><span>02</span><div><b>Authorized Editor</b><br>Publish new or updated articles without review.</div></div><div class="guideline"><span>03</span><div><b>Administrator</b><br>Approve accounts, manage roles and oversee content.</div></div><div class="tip-box"><strong>PRIVACY BY DESIGN</strong><p>The production backend will use secure sessions, password hashing and server-side role enforcement. This front end does not collect or store credentials.</p></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:13px">${route!=='login'?'<button class="btn secondary small" data-route="login">Sign in</button>':''}${route!=='signup'?'<button class="btn secondary small" data-route="signup">Request access</button>':''}${route!=='forgot-password'?'<button class="btn ghost small" data-route="forgot-password">Forgot password</button>':''}</div></aside></div>`;
}
function renderLeaderboard(){const people=[['Amber Sentinel','avatars/amber-sentinel.svg',1240],['Turbo Fox','avatars/turbo-fox.svg',1110],['Torque Titan','avatars/torque-titan.svg',980],['Gear Guardian','avatars/gear-guardian.svg',850],['Spark Scout','avatars/spark-scout.svg',740]];return `${titleBlock('TEAM RECOGNITION','Knowledge in <span class="accent">motion.</span>','A placeholder leaderboard layout for the future game experiences.')}<div class="leaderboard surface" style="margin-top:22px">${people.map(([name,src,points],i)=>`<div class="leader-row"><span class="leader-rank">${String(i+1).padStart(2,'0')}</span><img src="${src}" alt=""><div><strong>${name}</strong><small>${i===0?'Parts Expedite Champion':'Knowledge Garage contender'}</small></div><span class="leader-points">${points.toLocaleString()} XP</span></div>`).join('')}</div><p class="muted" style="font-size:9px">Illustrative names and scores only. Real scoring and rankings will be connected when the four games are built.</p>`;}
function renderAdmin(){const pending=state.submissions.filter(s=>s.status==='pending'),published=state.articles.length;let panel='';if(state.adminTab==='overview'){panel=`<div class="admin-metrics"><div class="metric"><strong>${pending.length}</strong><small>PENDING SUBMISSIONS</small></div><div class="metric"><strong>${state.revisions.filter(x=>x.status==='pending').length}</strong><small>EDIT SUGGESTIONS</small></div><div class="metric"><strong>${published}</strong><small>PUBLISHED GUIDES</small></div><div class="metric"><strong>${state.recycle.length}</strong><small>RECYCLE BIN</small></div></div><div class="side-panel surface"><h3>Workspace controls</h3><p class="muted" style="font-size:10px">The finished admin centre will manage account approvals, permissions, content review, revision history and recovery. Some administration controls are still being connected to the shared API.</p><div class="quick-grid" style="margin-top:12px"><button class="quick-card" data-admin-tab="submissions"><span class="quick-icon">▤</span><h3>Review submissions</h3><p>${pending.length} waiting for review</p></button><button class="quick-card" data-admin-tab="published"><span class="quick-icon">✓</span><h3>Published content</h3><p>Review the library contributions</p></button><button class="quick-card" data-admin-tab="users"><span class="quick-icon">♙</span><h3>Users & roles</h3><p>Role management preview</p></button></div></div>`;}else if(state.adminTab==='submissions'){panel=renderAdminList(pending,'submissions');}else if(state.adminTab==='published'){panel=renderAdminList(state.articles,'published');}else if(state.adminTab==='revisions'){panel=`${renderAdminList(state.revisions,'revisions')}<div class="section-head"><div><h2>Decision history</h2><p>Approved and rejected edit suggestions retained in this browser preview.</p></div></div>${renderAdminList(state.revisionHistory,'history')}`;}else if(state.adminTab==='recycle'){panel=renderAdminList(state.recycle,'recycle');}else{panel=`<div class="surface" style="padding:18px"><h3 class="form-section-title">Account and access preview</h3><p class="muted" style="font-size:10px">The production backend will provide registration approvals, account suspension/reactivation, administrator promotion and Authorized Editor grants. The rows below are mock records to show the planned controls; no real user accounts are present.</p><div class="admin-list" style="margin-top:12px"><div class="admin-item surface"><div><span class="pill amber">PENDING REGISTRATION</span><h3>Sample colleague</h3><p>sample.member@parts-expedite.example · Member request</p></div><div class="admin-actions"><button class="btn secondary small" disabled>Approve</button><button class="btn ghost small" disabled>Reject</button></div></div><div class="admin-item surface"><div><span class="pill green">ACTIVE MEMBER</span><h3>Sample editor</h3><p>sample.editor@parts-expedite.example · Member</p></div><div class="admin-actions"><button class="btn secondary small" disabled>Grant editor</button><button class="btn ghost small" disabled>Suspend</button></div></div><div class="admin-item surface"><div><span class="pill green">AUTHORIZED EDITOR</span><h3>Sample authorized editor</h3><p>sample.authorized@parts-expedite.example · Authorized Editor</p></div><div class="admin-actions"><button class="btn secondary small" disabled>Revoke editor</button><button class="btn ghost small" disabled>Suspend</button></div></div></div><div class="admin-item" style="margin-top:12px"><div><h3>${escapeHTML(state.name)} · current preview identity</h3><p>${escapeHTML(roleLabel())}</p></div><button class="btn secondary small" data-action="choose-role">Change demo role</button></div></div>`;}return `${titleBlock('ADMINISTRATION','Manage the <span class="accent">knowledge hub.</span>','A front-end preview of the built-in administration workspace.')}<div class="preview-banner" style="margin-top:18px"><span class="notice-icon">⚙</span><div><strong>Admin preview only</strong>These controls are not connected to a database, user authentication or shared publishing workflow yet.</div></div><div class="admin-tabs">${[['overview','Overview'],['submissions','Submissions'],['revisions','Edit suggestions'],['published','Published'],['recycle','Recycle bin'],['users','Users & roles']].map(([id,label])=>`<button class="admin-tab ${state.adminTab===id?'active':''}" data-admin-tab="${id}">${label}${id==='submissions'&&pending.length?` · ${pending.length}`:''}</button>`).join('')}</div>${panel}`;}
function renderAdminList(items,type){if(!items.length)return `<div class="empty-state"><div class="empty-icon">✓</div><h3>Nothing to review here</h3><p>This section is empty in the current preview workspace.</p></div>`;return `<div class="admin-list">${items.map((item,index)=>{const article=item.article||item;const id=item.id||article.id;const isRequest=['submissions','revisions'].includes(type);const status=item.status||(type==='recycle'?'recycled':'published');return `<article class="admin-item surface"><div><span class="pill ${status==='pending'?'amber':status==='rejected'?'red':'green'}">${escapeHTML(status.toUpperCase())}</span><h3>${escapeHTML(article.title||'Untitled content')}</h3><p>${escapeHTML(getCategory(article.category))} · ${escapeHTML(item.author||item.submitter||'Preview user')} · ${escapeHTML(id||'Draft')}</p>${item.note?`<p style="margin-top:5px">${escapeHTML(item.note)}</p>`:''}${item.original?`<div class="revision-box"><div><strong>BEFORE</strong>${escapeHTML(item.original.title)}</div><div><strong>PROPOSED UPDATE</strong>${escapeHTML(article.title)}</div></div>`:''}</div><div class="admin-actions">${isRequest&&status==='pending'?`<button class="btn secondary small" data-review="reject" data-index="${index}" data-type="${type}">Reject</button><button class="btn small" data-review="approve" data-index="${index}" data-type="${type}">Approve</button>`:type==='published'?`<button class="btn secondary small" data-edit-article="${escapeHTML(id)}">Edit</button><button class="btn danger small" data-recycle="${escapeHTML(id)}">Recycle</button>`:type==='recycle'?`<button class="btn secondary small" data-restore="${escapeHTML(id)}">Restore</button>`:''}</div></article>`;}).join('')}</div>`;}
function renderRoute(){if(state.backendActive&&!state.currentUser&&['submit','profile','favorites','admin'].includes((location.hash.replace(/^#\/?/,'').split('/')[0]||'home'))){view.innerHTML='<div class="empty-state" style="margin-top:45px"><div class="empty-icon">⌑</div><h3>Sign in required</h3><p>Sign in to submit, save or manage Parts Expedite knowledge.</p><button class="btn" data-route="login">Sign in →</button></div>';document.getElementById('topName').textContent='Guest';document.getElementById('topRole').textContent='Not signed in';return;}const [page,arg]=location.hash.replace(/^#\/?/,'').split('/');const route=page||'home';document.querySelectorAll('[data-route]').forEach(el=>el.classList.toggle('active',el.dataset.route===route));const labels={home:'Overview',articles:'Knowledge library',article:'Article guide',submit:'Submit an article',games:'Knowledge games',favorites:'Saved articles',profile:'My profile',leaderboard:'Leaderboard',admin:'Admin workspace',login:'Sign in',signup:'Request access','forgot-password':'Password recovery','change-password':'Change password'};document.getElementById('crumbCurrent').textContent=labels[route]||'Overview';document.getElementById('articleCount').textContent=String(state.articles.length).padStart(2,'0');if(route==='home')view.innerHTML=renderHome();else if(route==='articles'){view.innerHTML=renderArticles();}else if(route==='article')view.innerHTML=renderArticle(arg);else if(route==='submit')view.innerHTML=renderSubmit(arg||null);else if(route==='games')view.innerHTML=renderGames();else if(route==='favorites')view.innerHTML=renderFavorites();else if(route==='profile')view.innerHTML=renderProfile();else if(route==='leaderboard')view.innerHTML=renderLeaderboard();else if(route==='admin'&&state.role==='admin')view.innerHTML=renderAdmin();else if(route==='admin')view.innerHTML=`<div class="empty-state" style="margin-top:50px"><div class="empty-icon">⌑</div><h3>Administrator access only</h3><p>Switch to the Administrator preview role to inspect the admin workspace. In production, this area will be protected by server-side permissions.</p><button class="btn secondary" data-action="choose-role">Change preview role</button></div>`;else if(['login','signup','forgot-password','change-password'].includes(route))view.innerHTML=renderAuth(route);else{location.hash='#/home';return;}const adminNav=document.querySelector('[data-route="admin"]');if(adminNav)adminNav.hidden=state.role!=='admin';const bodyField=document.getElementById('articleBody'),bodyCounter=document.getElementById('bodyCount');if(bodyField&&bodyCounter)bodyCounter.textContent=bodyField.value.length.toLocaleString()+' / 30,000';document.getElementById('topName').textContent=state.name;document.getElementById('topRole').textContent=roleLabel();document.getElementById('topAvatar').src=state.avatar;document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.route===route));document.getElementById('sidebar').classList.remove('open');}
function go(route){location.hash='#/'+route;}
function toggleFavorite(id){if(state.backendActive){toggleBackendFavorite(id);return;}id=String(id);state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];saveState();renderRoute();toast(state.favorites.includes(id)?'Saved to your personal preview list.':'Removed from saved guides.');}
function openRoleModal(){const modal=document.getElementById('modalContent');modal.innerHTML=`<div class="eyebrow">PREVIEW ACCESS SWITCHER</div><h2 id="modalTitle">Choose a preview role</h2><p>Switch the front-end preview to inspect the screens and permission-based flows for each role. This is not real account access control.</p>${[['member','Member','Submit articles and suggest edits for review.'],['editor','Authorized Editor','Publish new articles and direct edits without review.'],['admin','Administrator','Review submissions, manage content and preview user controls.']].map(([role,label,desc])=>`<button class="role-option ${state.role===role?'active':''}" data-set-role="${role}"><span><strong>${label}</strong><small>${desc}</small></span><b>${state.role===role?'●':'○'}</b></button>`).join('')}`;showModal();}
function showModal(){document.getElementById('modalBackdrop').hidden=false;}
function closeModal(){document.getElementById('modalBackdrop').hidden=true;}
function notify(){document.getElementById('modalContent').innerHTML=`<div class="eyebrow">NOTIFICATIONS</div><h2 id="modalTitle">You're all caught up.</h2><p>Notifications for article reviews, account approvals and updates will appear here once the backend is connected.</p><div class="empty-state"><div class="empty-icon">♧</div><h3>No live notifications</h3><p>This is a front-end preview, so no shared account activity is being received.</p></div>`;showModal();}
function submitArticle(form){if(state.backendActive){submitArticleToBackend(form);return;}const fd=new FormData(form);const item={title:String(fd.get('title')).trim(),category:String(fd.get('category')),tags:String(fd.get('tags')).split(',').map(x=>x.trim()).filter(Boolean),body:String(fd.get('body')).trim(),reference:String(fd.get('reference')).trim(),summary:String(fd.get('body')).trim().replace(/[#*\n-]/g,' ').slice(0,150),author:state.name,updated:new Date().toISOString(),sample:false};if(item.title.length<3||item.body.length<10){toast('Please complete the required fields.');return;}const canPublish=state.role==='admin'||state.role==='editor';if(state.editingId){const original=getArticle(state.editingId);if(!original){toast('The original guide could not be found.');return;}if(canPublish){state.revisions.unshift({id:'REV-'+Date.now(),article:{...item,id:original.id},original:{title:original.title,body:original.body},status:'published',author:state.name,created:new Date().toISOString()});state.articles=state.articles.map(a=>String(a.id)===String(original.id)?{...item,id:original.id,status:'published'}:a);toast('Preview: update published directly.');}else{state.revisions.unshift({id:'REV-'+Date.now(),article:{...item,id:original.id},original:{title:original.title,body:original.body},status:'pending',author:state.name,created:new Date().toISOString()});toast('Preview: edit suggestion sent for review.');}}else{item.id='PE-'+String(Date.now()).slice(-7);item.status=canPublish?'published':'pending';if(canPublish){state.articles.unshift(item);toast('Preview: new article published.');}else{state.submissions.unshift({id:'SUB-'+Date.now(),article:item,status:'pending',author:state.name,created:new Date().toISOString()});toast('Preview: article submitted for review.');}}saveState();state.editingId=null;go('profile');}
function review(type,index,action){const list=type==='submissions'?state.submissions:state.revisions;const req=list[index];if(!req)return;if(action==='approve'){if(type==='submissions'){state.articles.unshift({...req.article,status:'published'});}else{const updated={...req.article,status:'published'};state.articles=state.articles.map(a=>String(a.id)===String(updated.id)?updated:a);state.revisionHistory.unshift({...req,status:'approved',reviewedAt:new Date().toISOString()});}list.splice(index,1);toast('Preview: item approved and published.');}else{if(type==='revisions')state.revisionHistory.unshift({...req,status:'rejected',reviewedAt:new Date().toISOString()});list.splice(index,1);toast('Preview: item rejected.');}saveState();renderRoute();}
function recycleArticle(id){const article=getArticle(id);if(!article)return;state.recycle.unshift({id:article.id,article,deletedAt:new Date().toISOString()});state.articles=state.articles.filter(a=>String(a.id)!==String(id));state.favorites=state.favorites.filter(x=>x!==String(id));saveState();renderRoute();toast('Moved to preview recycle bin.');}
function resetPreview(){if(!confirm('Reset all Parts Expedite preview data in this browser? This will remove demo submissions, saved items and changes.'))return;['pe-preview-role','pe-preview-name','pe-preview-avatar','pe-favorites','pe-articles','pe-submissions','pe-revisions','pe-recycle','pe-revision-history'].forEach(k=>localStorage.removeItem(k));location.hash='#/home';location.reload();}

// Delegated page interactions

document.addEventListener('click',e=>{
 const route=e.target.closest('[data-route]');if(route){e.preventDefault();go(route.dataset.route);return;}
 const fav=e.target.closest('[data-favorite]');if(fav){e.preventDefault();toggleFavorite(fav.dataset.favorite);return;}
 const open=e.target.closest('[data-open-article]');if(open){go('article/'+open.dataset.openArticle);return;}
 const edit=e.target.closest('[data-edit-article]');if(edit){go('submit/'+edit.dataset.editArticle);return;}
 const cat=e.target.closest('[data-category]');if(cat){state.activeCategory=cat.dataset.category;renderRoute();return;}
 const tag=e.target.closest('[data-tag]');if(tag){state.search=tag.dataset.tag;state.activeCategory='all';if(location.hash.startsWith('#/articles'))renderRoute();else go('articles');return;}
 const role=e.target.closest('[data-action="choose-role"]');if(role){if(state.backendActive){toast('Roles are controlled by the administrator on the shared workspace.');return;}openRoleModal();return;}
 const setRole=e.target.closest('[data-set-role]');if(setRole){if(state.backendActive){toast('Roles are managed by the administrator.');return;}state.role=setRole.dataset.setRole;saveState();closeModal();renderRoute();toast('Preview role changed to '+roleLabel()+'.');return;}
 const adminTab=e.target.closest('[data-admin-tab]');if(adminTab){state.adminTab=adminTab.dataset.adminTab;renderRoute();return;}
 const reviewButton=e.target.closest('[data-review]');if(reviewButton){review(reviewButton.dataset.type,Number(reviewButton.dataset.index),reviewButton.dataset.review);return;}
 const rec=e.target.closest('[data-recycle]');if(rec){recycleArticle(rec.dataset.recycle);return;}
 const restore=e.target.closest('[data-restore]');if(restore){const item=state.recycle.find(x=>String(x.id)===String(restore.dataset.restore));if(item){state.articles.unshift(item.article);state.recycle=state.recycle.filter(x=>String(x.id)!==String(item.id));saveState();renderRoute();toast('Restored in preview.');}return;}
 const avatar=e.target.closest('[data-avatar]');if(avatar){if(state.backendActive){toast('Avatar updates will be enabled in the next backend step.');return;}state.avatar=avatar.dataset.avatar;saveState();renderRoute();toast('Preview avatar updated.');return;}
 const clear=e.target.closest('[data-action="clear-search"]');if(clear){state.search='';state.activeCategory='all';renderRoute();return;}
 const changeName=e.target.closest('[data-action="change-name"]');if(changeName){if(state.backendActive){toast('Profile editing will be enabled in the next backend step.');return;}const name=prompt('Display name for this browser preview:',state.name);if(name&&name.trim()){state.name=name.trim().slice(0,40);saveState();renderRoute();}return;}
 const modalClose=e.target.closest('#modalClose');if(modalClose){closeModal();return;}
});
document.getElementById('globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){state.search=e.target.value.trim();state.activeCategory='all';if(location.hash.startsWith('#/articles'))renderRoute();else go('articles');}});
document.getElementById('globalSearch').addEventListener('input',e=>{if(!e.target.value){state.search='';}});
document.getElementById('notificationButton').addEventListener('click',notify);
document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal();});
window.addEventListener('hashchange',renderRoute);
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('globalSearch').focus();}if(e.key==='Escape')closeModal();});
view.addEventListener('input',e=>{if(e.target.id==='librarySearch'){state.search=e.target.value;const cursor=e.target.selectionStart;renderRoute();const next=document.getElementById('librarySearch');next?.focus();next?.setSelectionRange(cursor,cursor);}if(e.target.id==='articleBody'){const count=document.getElementById('bodyCount');if(count)count.textContent=e.target.value.length.toLocaleString()+' / 30,000';}});
view.addEventListener('change',e=>{if(e.target.id==='sortArticles'){state.articles.sort((a,b)=>e.target.value==='az'?a.title.localeCompare(b.title):0);renderRoute();}});
view.addEventListener('submit',e=>{if(e.target.id==='articleForm'){e.preventDefault();submitArticle(e.target);}if(e.target.matches('[data-auth-form]')){e.preventDefault();if(state.backendActive){submitAuthToBackend(e.target);}else{toast('Preview only: this form does not authenticate users.');e.target.reset();}}});
renderRoute();
initializeBackend();
