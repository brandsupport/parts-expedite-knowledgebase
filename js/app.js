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
  backendActive:false, backendConfigured:false, currentUser:null,
  adminUsers:[], adminSubmissions:[], adminNotifications:[], passwordRequests:[],
  mySubmissions:[], notifications:[], archivedArticles:[],
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
    const base=merged.get(id)||{};
    const combined={...base,...article};
    // Older browser-saved preview records may contain empty imported fields.
    // Do not let those stale values blank the current source article.
    if(base.imported||base.sourceDocument||base.sourcePages){
      if(!String(article.body||'').trim())combined.body=base.body||'';
      if(!String(article.title||'').trim())combined.title=base.title||'';
      if(!String(article.summary||'').trim())combined.summary=base.summary||'';
      if(!Array.isArray(article.tags)||!article.tags.length)combined.tags=base.tags||[];
    }
    merged.set(id,combined);
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
  const source=SEED_ARTICLES.find(item=>String(item.id)===String(a.id))||{};
  return {
    ...source,
    id:a.id,
    title:String(a.title||'').trim()?a.title:(source.title||''),
    category:a.category||source.category||'',
    tags:Array.isArray(a.tags)&&a.tags.length?a.tags:(source.tags||[]),
    summary:String(a.summary||'').trim()?a.summary:(source.summary||''),
    body:String(a.body||'').trim()?a.body:(source.body||''),
    updated:a.updatedAt||a.updated||source.updated||new Date().toISOString(),
    author:a.author||source.author||'Parts Expedite Team',
    status:a.status||source.status||'published',
    sourceDocument:a.sourceDocument||source.sourceDocument||source.reference||null,
    sourcePages:a.sourcePages||source.sourcePages||null,
    imported:!!(a.sourceDocument||source.imported||source.reference),
    images:Array.isArray(a.images)?a.images.map(image=>({...image,src:image.src||('/api/media/'+encodeURIComponent(image.id))})):[],
    sample:false
  };
}
async function refreshBackendData(){
  const me=await backendRequest('/api/auth/me');
  state.currentUser=me.user||null;
  state.backendConfigured=me.configured!==false;
  state.role=state.currentUser?.role||'member';
  state.name=state.currentUser?.displayName||'Guest';
  state.avatar=state.currentUser?.avatarKey||'avatars/amber-sentinel.svg';
  const articles=await backendRequest('/api/articles');
  state.articles=(articles.articles||[]).map(mapBackendArticle);
  state.favorites=[];
  state.mySubmissions=[];
  state.notifications=[];
  state.adminUsers=[];
  state.adminSubmissions=[];
  state.adminNotifications=[];
  state.passwordRequests=[];
  state.revisions=[];
  state.archivedArticles=[];
  if(!state.currentUser)return;

  const safeGet=async(path,fallback,key)=>{
    try{return await backendRequest(path);}catch(error){
      console.warn('Parts Expedite API request failed:',path,error.message);
      return fallback;
    }
  };
  const requests=[
    safeGet('/api/favorites',{favorites:[]}),
    safeGet('/api/my/submissions',{submissions:[]}),
    safeGet('/api/notifications',{notifications:[]})
  ];
  const admin=state.currentUser.role==='admin';
  if(admin){
    requests.push(
      safeGet('/api/admin/users',{users:[]}),
      safeGet('/api/admin/submissions',{submissions:[]}),
      safeGet('/api/admin/notifications',{notifications:[],unreadCount:0}),
      safeGet('/api/admin/password-requests',{requests:[]}),
      safeGet('/api/admin/revisions',{revisions:[]}),
      safeGet('/api/admin/archived',{articles:[]})
    );
  }
  const results=await Promise.all(requests);
  state.favorites=(results[0].favorites||[]).map(String);
  state.mySubmissions=results[1].submissions||[];
  state.submissions=state.mySubmissions;
  state.notifications=results[2].notifications||[];
  if(admin){
    state.adminUsers=results[3].users||[];
    state.adminSubmissions=results[4].submissions||[];
    state.adminNotifications=results[5].notifications||[];
    state.passwordRequests=results[6].requests||[];
    state.revisions=results[7].revisions||[];
    state.archivedArticles=results[8].articles||[];
  }
}
async function initializeBackend(){
  try{
    const response=await fetch('/api/health',{credentials:'same-origin',cache:'no-store'});
    if(!response.ok)return;
    const health=await response.json();
    if(!health.ok)return;
    state.backendActive=true;
    state.backendConfigured=health.authEnabled===true;
    await refreshBackendData();
    renderRoute();
  }catch(error){
    state.backendActive=false;
    state.backendConfigured=false;
  }
}
async function submitAuthToBackend(form){
  const route=form.dataset.authForm;
  const field=name=>form.elements.namedItem(name)?.value||'';
  try{
    if(route==='login'){
      const result=await backendRequest('/api/auth/login',{method:'POST',body:JSON.stringify({email:field('email'),password:field('password')})});
      state.currentUser=result.user||null;
      await refreshBackendData();
      if(state.currentUser?.mustChangePassword){go('change-password');toast('For security, update the temporary password before continuing.');}
      else{go('home');toast('Signed in successfully.');}
    }else if(route==='signup'){
      if(field('password')!==field('confirmPassword')){toast('The passwords do not match.');return;}
      const result=await backendRequest('/api/auth/register',{method:'POST',body:JSON.stringify({displayName:field('displayName'),email:field('email'),password:field('password'),confirmPassword:field('confirmPassword')})});
      toast(result.message||'Account request submitted.');
      go('login');
    }else if(route==='forgot-password'){
      const result=await backendRequest('/api/auth/forgot-password',{method:'POST',body:JSON.stringify({email:field('email')})});
      toast(result.message||'Recovery request sent, if the account exists.');
      go('login');
    }else if(route==='change-password'){
      if(field('password')!==field('confirmPassword')){toast('The new passwords do not match.');return;}
      const result=await backendRequest('/api/auth/change-password',{method:'POST',body:JSON.stringify({currentPassword:field('currentPassword'),password:field('password')})});
      await refreshBackendData();
      go('home');
      toast(result.message||'Password updated.');
    }
  }catch(error){toast(error.message);}
}

async function submitArticleToBackend(form){
  const fd=new FormData(form),payload={
    title:String(fd.get('title')||'').trim(),category:String(fd.get('category')||''),
    tags:String(fd.get('tags')||'').split(',').map(x=>x.trim()).filter(Boolean),
    body:String(fd.get('body')||'').trim(),summary:String(fd.get('body')||'').trim().replace(/[#*\\n-]/g,' ').slice(0,150),
    sourceDocument:String(fd.get('reference')||'').trim(),changeNote:String(fd.get('changeNote')||'').trim()
  };
  if(payload.title.length<3||payload.body.length<10){toast('Please complete the required fields.');return;}
  const files=[...(document.getElementById('articleFiles')?.files||[])];
  if(files.length>8){toast('Please attach no more than 8 screenshots.');return;}
  if(files.some(file=>file.size>12*1024*1024)){toast('Each screenshot must be 12 MB or smaller.');return;}
  try{
    const editing=!!state.editingId;
    const path=editing?'/api/articles/'+encodeURIComponent(state.editingId):'/api/articles';
    const result=await backendRequest(path,{method:editing?'PUT':'POST',body:JSON.stringify(payload)});
    const isPending=result.status==='pending';
    const targetId=isPending?result.submissionId:(result.article?.id||state.editingId);
    if(targetId&&files.length){
      for(const file of files){
        const upload=new FormData();
        upload.append('file',file);
        upload.append('alt',file.name);
        upload.append('caption',file.name);
        const uploadPath=isPending
          ?'/api/submissions/'+encodeURIComponent(targetId)+'/images'
          :'/api/articles/'+encodeURIComponent(targetId)+'/images';
        await backendRequest(uploadPath,{method:'POST',body:upload});
      }
    }
    state.editingId=null;
    await refreshBackendData();
    go(isPending?'profile':(editing?'article/'+targetId:'articles'));
    toast(isPending?'Your contribution and screenshots were sent for administrator review.':'Article published to the shared library.');
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
  if(state.backendActive)return state.currentUser?({admin:'Administrator',authorized_editor:'Authorized Editor',editor:'Authorized Editor',member:'Member'}[state.currentUser.role]||'Member'):'Not signed in';
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
  const manifestImages=window.PE_ARTICLE_IMAGE_MANIFEST?.[article.id]||[];
  const backendImages=Array.isArray(article.images)?article.images:[];
  const imageRows=[...manifestImages,...backendImages].filter((img,index,all)=>
    img&&img.src&&all.findIndex(other=>other&&other.src&&
      ((img.id&&other.id)?img.id===other.id:img.src===other.src))===index
  );
  const gallery=imageRows.length?'<section class="article-images"><h3>Visual guide</h3><div class="article-image-grid">'+imageRows.map(img=>{
    const src=img.src||'';
    if(!src)return '';
    const alt=img.alt||img.caption||'Article screenshot';
    const caption='PDF page '+(img.sourcePage||img.page||'')+' · '+(img.caption||img.alt||'Reference screenshot');
    return '<figure class="article-image"><button type="button" class="article-image-open" data-view-image="'+escapeHTML(src)+'" data-image-alt="'+escapeHTML(alt)+'" data-image-caption="'+escapeHTML(caption)+'" aria-label="Enlarge screenshot: '+escapeHTML(alt)+'"><img loading="lazy" src="'+escapeHTML(src)+'" alt="'+escapeHTML(alt)+'"><span class="article-image-zoom-hint">Click to enlarge <b>⤢</b></span></button><figcaption>'+escapeHTML(caption)+'</figcaption></figure>';
  }).join('')+'</div></section>':'';
  return banner()+'<article class="article-detail surface"><div class="detail-actions"><button class="text-link" data-route="articles">← BACK TO LIBRARY</button><div class="admin-actions"><button class="btn secondary small" data-favorite="'+escapeHTML(article.id)+'">'+(state.favorites.includes(String(article.id))?'★ Saved':'☆ Save guide')+'</button><button class="btn secondary small" data-edit-article="'+escapeHTML(article.id)+'">Edit / suggest update ✎</button></div></div><span class="pill amber" style="margin-top:22px">'+escapeHTML(getCategory(article.category))+'</span><h1 class="detail-title">'+escapeHTML(article.title)+'</h1><div class="detail-meta"><span>'+escapeHTML(article.id)+'</span><span>·</span><span>UPDATED '+escapeHTML(shortDate(article.updated).toUpperCase())+'</span><span>·</span><span>BY '+escapeHTML(article.author||'PARTS EXPEDITE TEAM').toUpperCase()+'</span></div>'+gallery+'<div class="detail-body">'+bodyToHTML(article.body)+'</div><div class="detail-foot">'+tags+'</div>'+source+'</article>';
}
function renderSubmit(editId=null){const article=editId?getArticle(editId):null;state.editingId=editId;return `${titleBlock(article?'EDIT / SUGGEST A CHANGE':'CONTRIBUTE TO THE LIBRARY',article?'Improve the <span class="accent">knowledge.</span>':'Share what <span class="accent">you know.</span>',article?'Suggest a correction or improvement to an existing guide.':'Create a practical guide that helps your colleagues resolve enquiries with confidence.')}${banner()}<form id="articleForm" class="form-layout"><section class="form-card surface"><h2 class="form-section-title">Article details</h2><div class="form-grid"><div class="field full"><label for="articleTitle">Article title <span>· required</span></label><input id="articleTitle" name="title" required maxlength="180" minlength="3" value="${escapeHTML(article?.title||'')}" placeholder="Give your guide a clear, searchable title"></div><div class="field"><label for="articleCategory">Category <span>· required</span></label><select id="articleCategory" name="category" required>${CATEGORIES.filter(c=>c.id!=='all').map(c=>`<option value="${c.id}" ${article?.category===c.id?'selected':''}>${escapeHTML(c.name)}</option>`).join('')}</select></div><div class="field"><label for="articleTags">Search tags</label><input id="articleTags" name="tags" value="${escapeHTML(article?.tags?.join(', ')||'')}" placeholder="part number, supplier, backorder"><span class="hint">Separate tags with commas.</span></div><div class="field full"><label for="articleBody">Guide content <span>· required</span></label><textarea id="articleBody" name="body" minlength="10" maxlength="30000" required placeholder="Write the steps clearly. Use a blank line between paragraphs, ## for a section heading, and - for bullet points.">${escapeHTML(article?.body||'')}</textarea><div class="char-count" id="bodyCount">0 / 30,000</div></div><div class="field full"><label for="articleReference">Source / reference</label><input id="articleReference" name="reference" value="${escapeHTML(article?.reference||'')}" placeholder="Policy, system reference, supplier document or internal owner"></div><div class="field full"><label>Supporting images / files</label><div class="upload-zone">Attachment picker preview — file storage will be connected with the backend<input type="file" id="articleFiles" multiple accept="image/jpeg,image/png,image/webp"></div></div></div><div class="form-footer"><span class="muted" style="font-size:9px">${article?'Your update will follow the selected preview role’s permission rules.':'New articles follow the selected preview role’s permission rules.'}</span><div style="display:flex;gap:8px"><button type="button" class="btn ghost" data-route="articles">Cancel</button><button type="submit" class="btn">${article?'Submit update':'Submit article'} →</button></div></div></section><aside class="form-aside surface"><h3>Make it useful</h3><p>Clear, structured knowledge is easier to find and easier to follow.</p><div class="guideline"><span>✦</span><div><b>Start with the outcome.</b><br>Say what the colleague will be able to do.</div></div><div class="guideline"><span>01</span><div><b>Use numbered steps.</b><br>Keep one action in each step.</div></div><div class="guideline"><span>▤</span><div><b>Add helpful references.</b><br>Include links, codes and owners where appropriate.</div></div><div class="guideline"><span>✓</span><div><b>Check before submitting.</b><br>Remove outdated details and explain exceptions.</div></div><div class="tip-box" style="margin-top:15px"><strong>PREVIEW PERMISSIONS</strong><p>${state.role==='member'?'Member: your new guide or edit suggestion enters the review queue.':state.role==='editor'?'Authorized Editor: your contribution is published directly.':'Administrator: your contribution is published directly; you can also review member submissions.'}</p></div></aside></form>`;}
function renderGames(){const games=[['Parts Rush','🏁','A quick-fire challenge built around speed, recall and accurate answers.'],['Parts Puzzle','🧩','Piece together the details and connect the right information.'],['Parts Quiz','💡','Test product, process and parts knowledge in short rounds.'],['Parts Match','🃏','Match references, descriptions and the details that belong together.']];return `${titleBlock('LEARN BY PLAYING','The knowledge <span class="accent">garage.</span>','Four original game spaces are reserved for Parts Expedite. We’ll design each experience together in a later phase.')}<div class="preview-banner" style="margin-top:22px"><span class="notice-icon">⚡</span><div><strong>Game development is intentionally parked</strong>These are themed placeholders only. No existing Brand Support games have been copied into this project.</div></div><div class="games-grid">${games.map(([name,icon,desc],i)=>`<article class="game-card surface surface-hover"><div class="game-art">${icon}</div><div><span class="pill amber">GAME ${String(i+1).padStart(2,'0')} · COMING LATER</span><h3>${name}</h3><p>${desc}</p><button class="btn secondary small" disabled>Design phase pending</button></div></article>`).join('')}</div>`;}
function renderFavorites(){const list=state.articles.filter(a=>state.favorites.includes(String(a.id)));return `${titleBlock('YOUR SPACE','Your saved <span class="accent">guides.</span>','Keep the references you return to most close at hand.')}<div style="margin-top:22px">${list.length?`<div class="article-grid">${list.map(articleCard).join('')}</div>`:`<div class="empty-state"><div class="empty-icon">☆</div><h3>Your saved library starts here</h3><p>Save any guide with the star icon and it will appear in this space.</p><button class="btn" data-route="articles">Explore articles</button></div>`}</div>`;}
function renderProfile(){
  if(!state.backendActive)return renderProfilePreview();
  const user=state.currentUser;
  const avatar=escapeHTML(state.avatar);
  const contributions=state.mySubmissions||[];
  const contributionMarkup=contributions.length?'<div class="admin-list">'+contributions.map(item=>{
    const proposed=item.proposed||{};
    const status=String(item.status||'pending').toLowerCase();
    return '<article class="admin-item surface"><div><span class="pill '+(status==='pending'?'amber':status==='rejected'?'red':'green')+'">'+escapeHTML(status.toUpperCase())+'</span><h3>'+escapeHTML(proposed.title||'Untitled contribution')+'</h3><p>'+escapeHTML(item.requestType==='update'?'Edit suggestion':'New article')+' · '+escapeHTML(item.id)+' · '+escapeHTML(shortDate(item.createdAt))+'</p>'+(item.reviewNote?'<p class="muted">'+escapeHTML(item.reviewNote)+'</p>':'')+'</div><span class="article-meta">'+escapeHTML(getCategory(proposed.category))+'</span></article>';
  }).join('')+'</div>':'<div class="empty-state"><div class="empty-icon">＋</div><h3>No contributions yet</h3><p>Your article submissions and review decisions will appear here.</p><button class="btn secondary" data-route="submit">Create an article</button></div>';
  return `${titleBlock('YOUR PROFILE','Your Parts Expedite <span class="accent">identity.</span>','Your shared account, profile settings and contribution history.')}${banner()}<div class="profile-layout"><section class="profile-card surface"><img class="profile-portrait" src="${avatar}" alt="Profile avatar"><h2>${escapeHTML(user?.displayName||'Colleague')}</h2><p>${escapeHTML(roleLabel())}</p><span class="pill green">LIVE ACCOUNT</span><p class="muted" style="margin-top:9px">${escapeHTML(user?.email||'')}</p><div style="margin-top:17px;display:flex;gap:7px;justify-content:center;flex-wrap:wrap"><button class="btn secondary" data-action="change-name">Edit display name</button><button class="btn secondary" data-route="change-password">Change password</button><button class="btn ghost" data-action="logout">Sign out</button></div></section><section class="avatar-picker surface"><h2 class="form-section-title">Choose your hero avatar</h2><p class="muted" style="font-size:10px;margin-top:-7px">Your avatar is saved to your shared account.</p><div class="avatar-grid">${AVATARS.map(([name,src])=>`<button class="avatar-choice ${state.avatar===src?'selected':''}" data-avatar="${src}" title="${name}"><img src="${src}" alt="${name}"></button>`).join('')}</div></section></div><div class="section-head"><div><h2>My submissions & edit suggestions</h2><p>Live statuses from the shared publishing workflow.</p></div><button class="btn secondary small" data-route="submit">Submit a guide</button></div>${contributionMarkup}`;
}
function renderProfilePreview(){
  const avatar=escapeHTML(state.avatar);
  const contributions=[...state.submissions.map(x=>({...x,kind:'New article'})),...state.revisions.map(x=>({...x,kind:'Edit suggestion'}))].sort((a,b)=>String(b.created||'').localeCompare(String(a.created||'')));
  const contributionMarkup=contributions.length?`<div class="admin-list">${contributions.map(item=>`<article class="admin-item surface"><div><span class="pill ${item.status==='pending'?'amber':item.status==='rejected'?'red':'green'}">${escapeHTML((item.status||'pending').toUpperCase())}</span><h3>${escapeHTML(item.article?.title||'Untitled contribution')}</h3><p>${escapeHTML(item.kind)} · ${escapeHTML(item.id||'Preview')} · ${escapeHTML(shortDate(item.created))}</p></div><span class="article-meta">${escapeHTML(getCategory(item.article?.category))}</span></article>`).join('')}</div>`:`<div class="empty-state"><div class="empty-icon">＋</div><h3>No contributions yet</h3><p>Your article submissions and edit suggestions will be tracked here.</p><button class="btn secondary" data-route="submit">Create an article</button></div>`;
  return `${titleBlock('YOUR PROFILE','Your Parts Expedite <span class="accent">identity.</span>','Profile, avatar and personal preview settings.')}${banner()}<div class="profile-layout"><section class="profile-card surface"><img class="profile-portrait" src="${avatar}" alt="Selected superhero avatar"><h2>${escapeHTML(state.name)}</h2><p>${escapeHTML(roleLabel())}</p><span class="pill amber">LOCAL PREVIEW PROFILE</span><div style="margin-top:17px;display:flex;gap:7px;justify-content:center;flex-wrap:wrap"><button class="btn secondary" data-action="change-name">Edit display name</button><button class="btn secondary" data-action="choose-role">Preview role</button></div><div class="tip-box" style="margin-top:17px;text-align:left"><strong>ACCOUNT / SECURITY</strong><p>Login, account approval, password reset and secure sessions are available when the Cloudflare backend is enabled.</p><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button class="btn ghost small" data-route="login">Sign in UI</button><button class="btn ghost small" data-route="signup">Sign up UI</button><button class="btn ghost small" data-route="forgot-password">Recovery UI</button></div></div></section><section class="avatar-picker surface"><h2 class="form-section-title">Choose your hero avatar</h2><p class="muted" style="font-size:10px;margin-top:-7px">Original Parts Expedite character portraits.</p><div class="avatar-grid">${AVATARS.map(([name,src])=>`<button class="avatar-choice ${state.avatar===src?'selected':''}" data-avatar="${src}" title="${name}"><img src="${src}" alt="${name}"></button>`).join('')}</div><div class="form-footer" style="margin-top:18px"><span class="muted" style="font-size:9px">${contributions.length} contribution activity items in this preview</span><button class="btn" data-route="submit">Submit a guide →</button></div></section></div><div class="section-head"><div><h2>My submissions & edit suggestions</h2><p>Preview statuses for your own contributions.</p></div></div>${contributionMarkup}`;
}

function renderAuth(route){
  const live=state.backendActive&&state.backendConfigured;
  const unavailable=state.backendActive&&!state.backendConfigured;
  const config={
    login:{kicker:'WELCOME BACK',title:'Sign in to your <span class="accent">workspace.</span>',intro:'Sign in with your approved Parts Expedite account.',heading:'Account sign-in',fields:`<div class="field full"><label for="authEmail">Email address</label><input id="authEmail" name="email" type="email" required placeholder="name@company.com" autocomplete="username"></div><div class="field full"><label for="authPassword">Password</label><input id="authPassword" name="password" type="password" required placeholder="Enter your password" autocomplete="current-password"></div>`,button:'Sign in'},
    signup:{kicker:'JOIN THE TEAM',title:'Get access to <span class="accent">the knowledge.</span>',intro:'Request an account. New registrations require administrator approval.',heading:'Create your account',fields:`<div class="field full"><label>Full name</label><input name="displayName" required minlength="2" maxlength="80" placeholder="Your name" autocomplete="name"></div><div class="field full"><label>Work email</label><input name="email" type="email" required placeholder="name@company.com" autocomplete="email"></div><div class="field full"><label>Create password</label><input name="password" type="password" required minlength="12" maxlength="128" placeholder="At least 12 characters" autocomplete="new-password"></div><div class="field full"><label>Confirm password</label><input name="confirmPassword" type="password" required minlength="12" maxlength="128" placeholder="Repeat your password" autocomplete="new-password"><span class="hint">Use a unique password with at least 12 characters.</span></div>`,button:'Request access'},
    'forgot-password':{kicker:'ACCOUNT RECOVERY',title:'Get back into <span class="accent">your account.</span>',intro:'Request a secure temporary password. An administrator will be notified.',heading:'Password recovery request',fields:`<div class="field full"><label>Work email</label><input name="email" type="email" required placeholder="name@company.com" autocomplete="email"></div>`,button:'Send recovery request'},
    'change-password':{kicker:'ACCOUNT SECURITY',title:'Update your <span class="accent">password.</span>',intro:state.currentUser?.mustChangePassword?'Your temporary password must be replaced before you can continue.':'Choose a new password for your account.',heading:'Change password',fields:`${state.currentUser?.mustChangePassword?'':'<div class="field full"><label>Current password</label><input name="currentPassword" type="password" required autocomplete="current-password"></div>'}<div class="field full"><label>New password</label><input name="password" type="password" required minlength="12" maxlength="128" autocomplete="new-password"></div><div class="field full"><label>Confirm new password</label><input name="confirmPassword" type="password" required minlength="12" maxlength="128" autocomplete="new-password"></div>`,button:'Update password'}
  };
  const c=config[route];
  const status=unavailable?'<div class="preview-banner"><span class="notice-icon">!</span><div><strong>Live accounts are not activated yet</strong>The Cloudflare database and authentication setting must be configured before accounts can be used.</div></div>':(live?'':'<div class="preview-banner"><span class="notice-icon">ⓘ</span><div><strong>Preview environment</strong>Live sign-in is only available after the Parts Expedite Cloudflare Worker is deployed on this same site origin.</div></div>');
  return `${titleBlock(c.kicker,c.title,c.intro)}${status}${banner()}<div class="form-layout" style="max-width:950px"><form class="form-card surface" data-auth-form="${route}"><h2 class="form-section-title">${c.heading}</h2><div class="form-grid">${c.fields}</div><div class="form-footer"><span class="muted" style="font-size:9px">${live?'Secure shared account':'Live account connection required'}</span><button class="btn" type="submit" ${!live?'disabled':''}>${c.button} →</button></div></form><aside class="form-aside surface"><h3>Parts Expedite access</h3><p>Access is controlled by the shared account system.</p><div class="guideline"><span>01</span><div><b>Member</b><br>Submit articles and suggest edits for administrator review.</div></div><div class="guideline"><span>02</span><div><b>Authorized Editor</b><br>Publish new or updated articles without review.</div></div><div class="guideline"><span>03</span><div><b>Administrator</b><br>Approve accounts, manage roles and oversee content.</div></div><div class="tip-box"><strong>PRIVACY BY DESIGN</strong><p>Passwords are hashed server-side. Sign-in sessions use secure, HttpOnly cookies. Never share a password with an administrator.</p></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:13px">${route!=='login'?'<button class="btn secondary small" data-route="login">Sign in</button>':''}${route!=='signup'?'<button class="btn secondary small" data-route="signup">Request access</button>':''}${route!=='forgot-password'?'<button class="btn ghost small" data-route="forgot-password">Forgot password</button>':''}</div></aside></div>`;
}

function renderLeaderboard(){const people=[['Amber Sentinel','avatars/amber-sentinel.svg',1240],['Turbo Fox','avatars/turbo-fox.svg',1110],['Torque Titan','avatars/torque-titan.svg',980],['Gear Guardian','avatars/gear-guardian.svg',850],['Spark Scout','avatars/spark-scout.svg',740]];return `${titleBlock('TEAM RECOGNITION','Knowledge in <span class="accent">motion.</span>','A placeholder leaderboard layout for the future game experiences.')}<div class="leaderboard surface" style="margin-top:22px">${people.map(([name,src,points],i)=>`<div class="leader-row"><span class="leader-rank">${String(i+1).padStart(2,'0')}</span><img src="${src}" alt=""><div><strong>${name}</strong><small>${i===0?'Parts Expedite Champion':'Knowledge Garage contender'}</small></div><span class="leader-points">${points.toLocaleString()} XP</span></div>`).join('')}</div><p class="muted" style="font-size:9px">Illustrative names and scores only. Real scoring and rankings will be connected when the four games are built.</p>`;}
function renderAdmin(){
  if(!state.backendActive)return titleBlock('ADMINISTRATION','Admin <span class="accent">workspace.</span>','Live account controls are available when the Cloudflare Worker is connected.')+'<div class="preview-banner" style="margin-top:18px"><span class="notice-icon">ⓘ</span><div><strong>Preview environment</strong>Connect the Parts Expedite app to its Cloudflare Worker to load real accounts and review queues.</div></div>';
  if(state.currentUser?.role!=='admin')return '<div class="empty-state"><h3>Administrator access only</h3><p>You do not have permission to view this workspace.</p></div>';
  const pending=state.adminSubmissions.length;
  const pendingUsers=state.adminUsers.filter(user=>user.status==='pending').length;
  let panel='';
  if(state.adminTab==='overview'){
    panel=`<div class="admin-metrics"><div class="metric"><strong>${pendingUsers}</strong><small>PENDING ACCOUNTS</small></div><div class="metric"><strong>${pending}</strong><small>CONTENT REVIEWS</small></div><div class="metric"><strong>${state.articles.length}</strong><small>PUBLISHED GUIDES</small></div><div class="metric"><strong>${state.adminNotifications.filter(n=>!n.readAt).length}</strong><small>UNREAD NOTIFICATIONS</small></div></div><div class="side-panel surface"><h3>Live workspace controls</h3><p class="muted" style="font-size:10px">These controls are connected to the shared Parts Expedite database.</p><div class="quick-grid" style="margin-top:12px"><button class="quick-card" data-admin-tab="users"><span class="quick-icon">♙</span><h3>Approve accounts</h3><p>${pendingUsers} registrations waiting</p></button><button class="quick-card" data-admin-tab="submissions"><span class="quick-icon">▤</span><h3>Review contributions</h3><p>${pending} articles waiting</p></button><button class="quick-card" data-admin-tab="password-requests"><span class="quick-icon">⌑</span><h3>Password recovery</h3><p>${state.passwordRequests.length} requests waiting</p></button></div></div>`;
  }else if(state.adminTab==='submissions'){
    panel=renderLiveSubmissions();
  }else if(state.adminTab==='users'){
    panel=renderLiveUsers();
  }else if(state.adminTab==='password-requests'){
    panel=renderPasswordRequests();
  }else if(state.adminTab==='notifications'){
    panel=renderAdminNotifications();
  }else if(state.adminTab==='published'){
    panel=renderLivePublishedArticles();
  }else if(state.adminTab==='revisions'){
    panel=renderLiveRevisions();
  }else if(state.adminTab==='recycle'){
    panel=renderArchivedArticles();
  }
  const tabs=[['overview','Overview'],['users','Users & roles'],['submissions','Submissions'],['password-requests','Password recovery'],['notifications','Notifications'],['published','Published'],['revisions','Revision history'],['recycle','Archived']];
  return `${titleBlock('ADMINISTRATION','Manage the <span class="accent">knowledge hub.</span>','Live account approvals, publishing decisions and workspace administration.')}${banner()}<div class="admin-tabs">${tabs.map(([id,label])=>`<button class="admin-tab ${state.adminTab===id?'active':''}" data-admin-tab="${id}">${label}${id==='users'&&pendingUsers?' · '+pendingUsers:''}${id==='submissions'&&pending?' · '+pending:''}${id==='password-requests'&&state.passwordRequests.length?' · '+state.passwordRequests.length:''}</button>`).join('')}</div>${panel}`;
}
function renderLiveSubmissions(){
  const items=state.adminSubmissions||[];
  if(!items.length)return '<div class="empty-state"><div class="empty-icon">✓</div><h3>No pending contributions</h3><p>New member submissions and edit suggestions will appear here.</p></div>';
  return '<div class="admin-list">'+items.map(item=>{
    const article=item.proposed||{},imgs=item.images||[];
    return '<article class="admin-item surface"><div><span class="pill amber">PENDING REVIEW · '+escapeHTML(item.requestType||'create').toUpperCase()+'</span><h3>'+escapeHTML(article.title||'Untitled contribution')+'</h3><p>'+escapeHTML(item.submitter?.name||'Colleague')+' · '+escapeHTML(item.submitter?.email||'')+' · '+escapeHTML(shortDate(item.createdAt))+'</p><p class="muted">'+escapeHTML(getCategory(article.category))+' · '+escapeHTML(item.articleId||'New article')+'</p>'+(item.changeNote?'<p>'+escapeHTML(item.changeNote)+'</p>':'')+'<details class="submission-preview"><summary>Read proposed guide</summary><div class="submission-body">'+bodyToHTML(article.body||'')+'</div></details>'+(imgs.length?'<div class="submission-image-grid">'+imgs.map(img=>'<button type="button" class="submission-image" data-view-image="'+escapeHTML(img.src||'')+'" data-image-alt="'+escapeHTML(img.alt||img.caption||'Submitted screenshot')+'" data-image-caption="'+escapeHTML(img.caption||'Submitted screenshot')+'"><img src="'+escapeHTML(img.src||'')+'" alt="'+escapeHTML(img.alt||'Submitted screenshot')+'" loading="lazy"></button>').join('')+'</div>':'')+'</div><div class="admin-actions"><button class="btn secondary small" data-submission-action="reject" data-submission-id="'+escapeHTML(item.id)+'">Reject</button><button class="btn small" data-submission-action="approve" data-submission-id="'+escapeHTML(item.id)+'">Approve & publish</button></div></article>';
  }).join('')+'</div>';
}
function renderLiveUsers(){
  const users=state.adminUsers||[];
  if(!users.length)return '<div class="empty-state"><h3>No accounts found</h3><p>New registration requests will appear here.</p></div>';
  return '<div class="admin-list">'+users.map(user=>{
    const role=user.role==='admin'?'Administrator':user.role==='authorized_editor'?'Authorized Editor':user.role==='editor'?'Authorized Editor':'Member';
    const status=String(user.status||'').toLowerCase();
    let actions='';
    if(status==='pending')actions='<button class="btn small" data-user-action="approve" data-user-id="'+escapeHTML(user.id)+'">Approve account</button><button class="btn danger small" data-user-action="delete" data-user-id="'+escapeHTML(user.id)+'">Reject</button>';
    else if(status==='suspended')actions='<button class="btn small" data-user-action="activate" data-user-id="'+escapeHTML(user.id)+'">Reactivate</button><button class="btn danger small" data-user-action="delete" data-user-id="'+escapeHTML(user.id)+'">Delete</button>';
    else if(user.role==='admin')actions=(user.id!==state.currentUser.id?'<button class="btn secondary small" data-user-action="demote" data-user-id="'+escapeHTML(user.id)+'">Remove admin</button><button class="btn ghost small" data-user-action="suspend" data-user-id="'+escapeHTML(user.id)+'">Suspend</button>':'<span class="pill green">CURRENT ADMIN</span>');
    else{
      actions+=(user.authorizedEditor||user.role==='authorized_editor'?'<button class="btn secondary small" data-user-action="revoke_editor" data-user-id="'+escapeHTML(user.id)+'">Revoke editor</button>':'<button class="btn secondary small" data-user-action="grant_editor" data-user-id="'+escapeHTML(user.id)+'">Grant editor</button>');
      actions+='<button class="btn ghost small" data-user-action="reset_password" data-user-id="'+escapeHTML(user.id)+'">Issue temporary password</button><button class="btn ghost small" data-user-action="suspend" data-user-id="'+escapeHTML(user.id)+'">Suspend</button><button class="btn danger small" data-user-action="delete" data-user-id="'+escapeHTML(user.id)+'">Delete</button>';
    }
    return '<article class="admin-item surface"><div><span class="pill '+(status==='pending'?'amber':status==='suspended'?'red':'green')+'">'+escapeHTML(status.toUpperCase())+'</span><h3>'+escapeHTML(user.displayName||'Colleague')+'</h3><p>'+escapeHTML(user.email||'')+' · '+escapeHTML(role)+'</p><p class="muted">Joined '+escapeHTML(shortDate(user.createdAt))+(user.mustChangePassword?' · Password change required':'')+'</p></div><div class="admin-actions">'+actions+'</div></article>';
  }).join('')+'</div>';
}
function renderLivePublishedArticles(){
  return '<div class="admin-list">'+(state.articles||[]).map(article=>'<article class="admin-item surface"><div><span class="pill green">PUBLISHED</span><h3>'+escapeHTML(article.title||'Untitled guide')+'</h3><p>'+escapeHTML(getCategory(article.category))+' · '+escapeHTML(article.id)+' · '+escapeHTML(shortDate(article.updated))+'</p></div><div class="admin-actions"><button class="btn secondary small" data-edit-article="'+escapeHTML(article.id)+'">Edit / suggest</button><button class="btn danger small" data-archive-article="'+escapeHTML(article.id)+'">Archive</button></div></article>').join('')+'</div>';
}
async function archiveBackendArticle(id){
  if(!confirm('Archive this article? It will be removed from the public library but can be restored later.'))return;
  try{
    await backendRequest('/api/articles/'+encodeURIComponent(id),{method:'DELETE'});
    await refreshBackendData();renderRoute();toast('Article archived.');
  }catch(error){toast(error.message);}
}
function renderPasswordRequests(){
  const requests=state.passwordRequests||[];
  if(!requests.length)return '<div class="empty-state"><h3>No password recovery requests</h3><p>Requests from active colleagues will appear here.</p></div>';
  return '<div class="admin-list">'+requests.map(item=>'<article class="admin-item surface"><div><span class="pill amber">RECOVERY REQUEST</span><h3>'+escapeHTML(item.displayName||'Colleague')+'</h3><p>'+escapeHTML(item.email||'')+' · '+escapeHTML(shortDate(item.createdAt))+'</p></div><div class="admin-actions"><button class="btn small" data-password-request="'+escapeHTML(item.id)+'">Issue temporary password</button></div></article>').join('')+'</div>';
}
function renderAdminNotifications(){
  const items=state.adminNotifications||[];
  if(!items.length)return '<div class="empty-state"><h3>No notifications</h3><p>Registration requests, submissions and recovery requests will appear here.</p></div>';
  return '<div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="btn ghost small" data-notification-read-all>Mark all as read</button></div><div class="admin-list">'+items.map(item=>'<article class="admin-item surface"><div><span class="pill '+(item.readAt?'':'amber')+'">'+(item.readAt?'READ':'UNREAD')+'</span><h3>'+escapeHTML(item.title||'Notification')+'</h3><p>'+escapeHTML(item.message||'')+'</p><p class="muted">'+escapeHTML(shortDate(item.createdAt))+'</p></div><div class="admin-actions">'+(!item.readAt?'<button class="btn secondary small" data-admin-notification-read="'+escapeHTML(item.id)+'">Mark read</button>':'')+'</div></article>').join('')+'</div>';
}
function renderLiveRevisions(){
  const items=state.revisions||[];
  if(!items.length)return '<div class="empty-state"><h3>No revision history yet</h3><p>When articles are updated, previous versions will be retained here.</p></div>';
  return '<div class="admin-list">'+items.map(item=>'<article class="admin-item surface"><div><span class="pill green">REVISION '+escapeHTML(item.revisionNumber||'')+'</span><h3>'+escapeHTML(item.snapshot?.title||'Article revision')+'</h3><p>'+escapeHTML(item.actorName||'Team member')+' · '+escapeHTML(shortDate(item.createdAt))+'</p>'+(item.changeNote?'<p>'+escapeHTML(item.changeNote)+'</p>':'')+'</div><button class="btn ghost small" data-open-article="'+escapeHTML(item.articleId||'')+'">Open current guide</button></article>').join('')+'</div>';
}
function renderArchivedArticles(){
  const items=state.archivedArticles||[];
  if(!items.length)return '<div class="empty-state"><h3>Archive is empty</h3><p>Archived articles can be restored from this section.</p></div>';
  return '<div class="admin-list">'+items.map(item=>'<article class="admin-item surface"><div><span class="pill red">ARCHIVED</span><h3>'+escapeHTML(item.title||'Article')+'</h3><p>'+escapeHTML(item.id)+' · '+escapeHTML(getCategory(item.category))+'</p></div><button class="btn secondary small" data-restore-article="'+escapeHTML(item.id)+'">Restore article</button></article>').join('')+'</div>';
}
function renderAdminList(items,type){if(!items.length)return `<div class="empty-state"><div class="empty-icon">✓</div><h3>Nothing to review here</h3><p>This section is empty in the current preview workspace.</p></div>`;return `<div class="admin-list">${items.map((item,index)=>{const article=item.article||item;const id=item.id||article.id;const isRequest=['submissions','revisions'].includes(type);const status=item.status||(type==='recycle'?'recycled':'published');return `<article class="admin-item surface"><div><span class="pill ${status==='pending'?'amber':status==='rejected'?'red':'green'}">${escapeHTML(status.toUpperCase())}</span><h3>${escapeHTML(article.title||'Untitled content')}</h3><p>${escapeHTML(getCategory(article.category))} · ${escapeHTML(item.author||item.submitter||'Preview user')} · ${escapeHTML(id||'Draft')}</p>${item.note?`<p style="margin-top:5px">${escapeHTML(item.note)}</p>`:''}${item.original?`<div class="revision-box"><div><strong>BEFORE</strong>${escapeHTML(item.original.title)}</div><div><strong>PROPOSED UPDATE</strong>${escapeHTML(article.title)}</div></div>`:''}</div><div class="admin-actions">${isRequest&&status==='pending'?`<button class="btn secondary small" data-review="reject" data-index="${index}" data-type="${type}">Reject</button><button class="btn small" data-review="approve" data-index="${index}" data-type="${type}">Approve</button>`:type==='published'?`<button class="btn secondary small" data-edit-article="${escapeHTML(id)}">Edit</button><button class="btn danger small" data-recycle="${escapeHTML(id)}">Recycle</button>`:type==='recycle'?`<button class="btn secondary small" data-restore="${escapeHTML(id)}">Restore</button>`:''}</div></article>`;}).join('')}</div>`;}
function renderRoute(){
  const [page,arg]=location.hash.replace(/^#\\/?/,'').split('/');
  let route=page||'home';
  const protectedRoutes=['submit','profile','favorites','admin','change-password'];
  if(state.backendActive&&!state.currentUser&&protectedRoutes.includes(route)){
    if(route==='change-password')go('login');
    else view.innerHTML='<div class="empty-state" style="margin-top:45px"><div class="empty-icon">⌑</div><h3>Sign in required</h3><p>Sign in to submit, save or manage Parts Expedite knowledge.</p><button class="btn" data-route="login">Sign in →</button></div>';
    document.getElementById('topName').textContent='Guest';
    document.getElementById('topRole').textContent='Not signed in';
    return;
  }
  if(state.backendActive&&state.currentUser?.mustChangePassword&&route!=='change-password'){
    go('change-password');return;
  }
  if(state.backendActive&&state.currentUser&&['login','signup'].includes(route)){go('home');return;}
  document.querySelectorAll('[data-route]').forEach(el=>el.classList.toggle('active',el.dataset.route===route));
  const labels={home:'Overview',articles:'Knowledge library',article:'Article guide',submit:'Submit an article',games:'Knowledge games',favorites:'Saved articles',profile:'My profile',leaderboard:'Leaderboard',admin:'Admin workspace',login:'Sign in',signup:'Request access','forgot-password':'Password recovery','change-password':'Change password'};
  document.getElementById('crumbCurrent').textContent=labels[route]||'Overview';
  document.getElementById('articleCount').textContent=String(state.articles.length).padStart(2,'0');
  if(route==='home')view.innerHTML=renderHome();
  else if(route==='articles')view.innerHTML=renderArticles();
  else if(route==='article')view.innerHTML=renderArticle(arg);
  else if(route==='submit')view.innerHTML=renderSubmit(arg||null);
  else if(route==='games')view.innerHTML=renderGames();
  else if(route==='favorites')view.innerHTML=renderFavorites();
  else if(route==='profile')view.innerHTML=renderProfile();
  else if(route==='leaderboard')view.innerHTML=renderLeaderboard();
  else if(route==='admin'&&(!state.backendActive||state.currentUser?.role==='admin'))view.innerHTML=renderAdmin();
  else if(route==='admin')view.innerHTML='<div class="empty-state" style="margin-top:50px"><div class="empty-icon">⌑</div><h3>Administrator access only</h3><p>This area is limited to Parts Expedite administrators.</p></div>';
  else if(['login','signup','forgot-password','change-password'].includes(route))view.innerHTML=renderAuth(route);
  else{location.hash='#/home';return;}
  const adminNav=document.querySelector('[data-route="admin"]');
  if(adminNav)adminNav.hidden=state.backendActive?state.currentUser?.role!=='admin':state.role!=='admin';
  const bodyField=document.getElementById('articleBody'),bodyCounter=document.getElementById('bodyCount');
  if(bodyField&&bodyCounter)bodyCounter.textContent=bodyField.value.length.toLocaleString()+' / 30,000';
  document.getElementById('topName').textContent=state.currentUser?.displayName||state.name||'Guest';
  document.getElementById('topRole').textContent=roleLabel();
  document.getElementById('topAvatar').src=state.avatar;
  const unread=state.currentUser?.role==='admin'
    ?(state.adminNotifications||[]).filter(n=>!n.readAt).length
    :(state.notifications||[]).filter(n=>!(n.readAt||n.read_at)).length;
  const notificationDot=document.querySelector('#notificationButton i');
  if(notificationDot)notificationDot.style.display=unread?'block':'none';
  const notificationButton=document.getElementById('notificationButton');
  if(notificationButton)notificationButton.title=unread?unread+' unread notification(s)':'Notifications';
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.route===route));
  document.getElementById('sidebar').classList.remove('open');
}

function go(route){location.hash='#/'+route;}
function toggleFavorite(id){if(state.backendActive){toggleBackendFavorite(id);return;}id=String(id);state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];saveState();renderRoute();toast(state.favorites.includes(id)?'Saved to your personal preview list.':'Removed from saved guides.');}
function openRoleModal(){const modal=document.getElementById('modalContent');modal.innerHTML=`<div class="eyebrow">PREVIEW ACCESS SWITCHER</div><h2 id="modalTitle">Choose a preview role</h2><p>Switch the front-end preview to inspect the screens and permission-based flows for each role. This is not real account access control.</p>${[['member','Member','Submit articles and suggest edits for review.'],['editor','Authorized Editor','Publish new articles and direct edits without review.'],['admin','Administrator','Review submissions, manage content and preview user controls.']].map(([role,label,desc])=>`<button class="role-option ${state.role===role?'active':''}" data-set-role="${role}"><span><strong>${label}</strong><small>${desc}</small></span><b>${state.role===role?'●':'○'}</b></button>`).join('')}`;showModal();}
function showModal(){document.getElementById('modalBackdrop').hidden=false;}
function openImageViewer(src,alt,caption){
  const backdrop=document.getElementById('modalBackdrop');
  const modal=document.getElementById('modal');
  const content=document.getElementById('modalContent');
  content.innerHTML='<div class="image-viewer-content"><div class="image-viewer-heading"><div><div class="eyebrow">ARTICLE SCREENSHOT</div><h2 id="modalTitle">Image preview</h2></div><span>Press Esc or click outside to close</span></div><img class="image-viewer-image" src="'+escapeHTML(src)+'" alt="'+escapeHTML(alt||'Article screenshot')+'"><p class="image-viewer-caption">'+escapeHTML(caption||alt||'')+'</p></div>';
  modal.classList.add('image-viewer-modal');
  backdrop.classList.add('image-viewer-backdrop');
  showModal();
}
function closeModal(){
  const backdrop=document.getElementById('modalBackdrop');
  const modal=document.getElementById('modal');
  const wasImageViewer=modal.classList.contains('image-viewer-modal');
  backdrop.hidden=true;
  backdrop.classList.remove('image-viewer-backdrop');
  modal.classList.remove('image-viewer-modal');
  if(wasImageViewer)document.getElementById('modalContent').innerHTML='';
}
function notify(){
  const isAdmin=state.currentUser?.role==='admin';
  const items=isAdmin?(state.adminNotifications||[]):(state.notifications||[]);
  const unread=items.filter(item=>!(item.readAt||item.read_at)).length;
  const rows=items.length?items.map(item=>{
    const read=!!(item.readAt||item.read_at);
    return '<article class="admin-item surface"><div><span class="pill '+(read?'':'amber')+'">'+(read?'READ':'NEW')+'</span><h3>'+escapeHTML(item.title||'Notification')+'</h3><p>'+escapeHTML(item.message||'')+'</p><p class="muted">'+escapeHTML(shortDate(item.createdAt||item.created_at))+'</p></div>'+(isAdmin&&!read?'<button class="btn ghost small" data-admin-notification-read="'+escapeHTML(item.id)+'">Mark read</button>':'')+'</article>';
  }).join(''):'<div class="empty-state"><div class="empty-icon">♧</div><h3>No notifications</h3><p>Account updates, article decisions and workspace alerts will appear here.</p></div>';
  document.getElementById('modalContent').innerHTML='<div class="eyebrow">WORKSPACE ACTIVITY</div><h2 id="modalTitle">Notifications</h2><p>'+unread+' unread notification'+(unread===1?'':'s')+'.</p>'+(unread?'<div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="btn ghost small" data-notification-read-all>Mark all as read</button></div>':'')+'<div class="admin-list">'+rows+'</div>';
  showModal();
}
async function performAdminUserAction(id,action){
  if(action==='delete'&&!confirm('Remove this account from Parts Expedite? This cannot be undone.'))return;
  if(action==='suspend'&&!confirm('Suspend this account and revoke its active sessions?'))return;
  try{
    const result=await backendRequest('/api/admin/users/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({action})});
    await refreshBackendData();renderRoute();
    if(result.temporaryPassword)showTemporaryPassword(result.temporaryPassword);
    else toast(result.message||'Account updated.');
  }catch(error){toast(error.message);}
}
async function reviewLiveSubmission(id,decision){
  const note=decision==='reject'?(prompt('Reason for rejecting this contribution (optional):','')||''):'';
  if(decision==='reject'&&!confirm('Reject this contribution?'))return;
  try{
    const result=await backendRequest('/api/admin/submissions/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({decision,note})});
    await refreshBackendData();renderRoute();
    toast(decision==='approve'?'Contribution approved and published.':'Contribution rejected.');
  }catch(error){toast(error.message);}
}
async function issuePasswordRequest(id){
  if(!confirm('Create a one-time temporary password for this colleague?'))return;
  try{
    const result=await backendRequest('/api/admin/password-requests',{method:'POST',body:JSON.stringify({action:'issue-temporary-password',requestId:id})});
    await refreshBackendData();renderRoute();
    showTemporaryPassword(result.temporaryPassword);
  }catch(error){toast(error.message);}
}
function showTemporaryPassword(password){
  document.getElementById('modalContent').innerHTML='<div class="eyebrow">ONE-TIME CREDENTIAL</div><h2 id="modalTitle">Temporary password created</h2><p>Copy this password and share it with the colleague privately. It will not be shown again. They must change it at their next sign-in.</p><div class="temporary-password">'+escapeHTML(password)+'</div><div class="form-footer"><button type="button" class="btn secondary" data-copy-temp-password>Copy password</button><button type="button" class="btn" id="modalDone">Done</button></div>';
  document.getElementById('modalDone')?.addEventListener('click',closeModal);
  const copy=document.querySelector('[data-copy-temp-password]');
  if(copy)copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(password);toast('Temporary password copied.');}catch{toast('Copy is unavailable here; select and copy the password manually.');}});
  showModal();
}
async function markAllNotificationsRead(){
  try{
    if(state.currentUser?.role==='admin'){
      await backendRequest('/api/admin/notifications',{method:'PATCH',body:JSON.stringify({action:'mark-all-read'})});
    }else{
      await backendRequest('/api/notifications/read-all',{method:'PATCH',body:JSON.stringify({})});
    }
    await refreshBackendData();notify();
  }catch(error){toast(error.message);}
}
async function markAdminNotificationRead(id){
  try{
    await backendRequest('/api/admin/notifications',{method:'PATCH',body:JSON.stringify({action:'mark-read',id})});
    await refreshBackendData();notify();
  }catch(error){toast(error.message);}
}
async function restoreBackendArticle(id){
  try{
    await backendRequest('/api/admin/articles/'+encodeURIComponent(id)+'/restore',{method:'PATCH',body:JSON.stringify({})});
    await refreshBackendData();renderRoute();toast('Article restored to the library.');
  }catch(error){toast(error.message);}
}
async function signOut(){
  try{await backendRequest('/api/auth/logout',{method:'POST',body:JSON.stringify({})});}
  catch(error){toast(error.message);return;}
  state.currentUser=null;state.favorites=[];state.mySubmissions=[];state.notifications=[];state.role='member';state.name='Guest';state.avatar='avatars/amber-sentinel.svg';
  go('home');renderRoute();toast('You have signed out.');
}
async function updateAccountProfile(){
  const displayName=prompt('Update your display name:',state.currentUser?.displayName||'');
  if(displayName===null)return;
  if(displayName.trim().length<2){toast('Display name must contain at least 2 characters.');return;}
  try{
    await backendRequest('/api/auth/profile',{method:'POST',body:JSON.stringify({displayName:displayName.trim()})});
    await refreshBackendData();renderRoute();toast('Profile updated.');
  }catch(error){toast(error.message);}
}

function submitArticle(form){if(state.backendActive){submitArticleToBackend(form);return;}const fd=new FormData(form);const item={title:String(fd.get('title')).trim(),category:String(fd.get('category')),tags:String(fd.get('tags')).split(',').map(x=>x.trim()).filter(Boolean),body:String(fd.get('body')).trim(),reference:String(fd.get('reference')).trim(),summary:String(fd.get('body')).trim().replace(/[#*\n-]/g,' ').slice(0,150),author:state.name,updated:new Date().toISOString(),sample:false};if(item.title.length<3||item.body.length<10){toast('Please complete the required fields.');return;}const canPublish=state.role==='admin'||state.role==='editor';if(state.editingId){const original=getArticle(state.editingId);if(!original){toast('The original guide could not be found.');return;}if(canPublish){state.revisions.unshift({id:'REV-'+Date.now(),article:{...item,id:original.id},original:{title:original.title,body:original.body},status:'published',author:state.name,created:new Date().toISOString()});state.articles=state.articles.map(a=>String(a.id)===String(original.id)?{...item,id:original.id,status:'published'}:a);toast('Preview: update published directly.');}else{state.revisions.unshift({id:'REV-'+Date.now(),article:{...item,id:original.id},original:{title:original.title,body:original.body},status:'pending',author:state.name,created:new Date().toISOString()});toast('Preview: edit suggestion sent for review.');}}else{item.id='PE-'+String(Date.now()).slice(-7);item.status=canPublish?'published':'pending';if(canPublish){state.articles.unshift(item);toast('Preview: new article published.');}else{state.submissions.unshift({id:'SUB-'+Date.now(),article:item,status:'pending',author:state.name,created:new Date().toISOString()});toast('Preview: article submitted for review.');}}saveState();state.editingId=null;go('profile');}
function review(type,index,action){const list=type==='submissions'?state.submissions:state.revisions;const req=list[index];if(!req)return;if(action==='approve'){if(type==='submissions'){state.articles.unshift({...req.article,status:'published'});}else{const updated={...req.article,status:'published'};state.articles=state.articles.map(a=>String(a.id)===String(updated.id)?updated:a);state.revisionHistory.unshift({...req,status:'approved',reviewedAt:new Date().toISOString()});}list.splice(index,1);toast('Preview: item approved and published.');}else{if(type==='revisions')state.revisionHistory.unshift({...req,status:'rejected',reviewedAt:new Date().toISOString()});list.splice(index,1);toast('Preview: item rejected.');}saveState();renderRoute();}
function recycleArticle(id){const article=getArticle(id);if(!article)return;state.recycle.unshift({id:article.id,article,deletedAt:new Date().toISOString()});state.articles=state.articles.filter(a=>String(a.id)!==String(id));state.favorites=state.favorites.filter(x=>x!==String(id));saveState();renderRoute();toast('Moved to preview recycle bin.');}
function resetPreview(){if(!confirm('Reset all Parts Expedite preview data in this browser? This will remove demo submissions, saved items and changes.'))return;['pe-preview-role','pe-preview-name','pe-preview-avatar','pe-favorites','pe-articles','pe-submissions','pe-revisions','pe-recycle','pe-revision-history'].forEach(k=>localStorage.removeItem(k));location.hash='#/home';location.reload();}

// Delegated page interactions

document.addEventListener('click',e=>{
 const image=e.target.closest('[data-view-image]');if(image){e.preventDefault();openImageViewer(image.dataset.viewImage,image.dataset.imageAlt,image.dataset.imageCaption);return;}
 const route=e.target.closest('[data-route]');if(route){e.preventDefault();go(route.dataset.route);return;}
 const fav=e.target.closest('[data-favorite]');if(fav){e.preventDefault();toggleFavorite(fav.dataset.favorite);return;}
 const open=e.target.closest('[data-open-article]');if(open){const id=open.dataset.openArticle;if(state.backendActive){(async()=>{try{const result=await backendRequest('/api/articles/'+encodeURIComponent(id));const mapped=mapBackendArticle(result.article);state.articles=state.articles.map(a=>String(a.id)===String(id)?mapped:a);go('article/'+id);}catch(error){toast(error.message);}})();}else go('article/'+id);return;}
 const edit=e.target.closest('[data-edit-article]');if(edit){go('submit/'+edit.dataset.editArticle);return;}
 const cat=e.target.closest('[data-category]');if(cat){state.activeCategory=cat.dataset.category;renderRoute();return;}
 const tag=e.target.closest('[data-tag]');if(tag){state.search=tag.dataset.tag;state.activeCategory='all';if(location.hash.startsWith('#/articles'))renderRoute();else go('articles');return;}
 const role=e.target.closest('[data-action="choose-role"]');if(role){if(state.backendActive){toast('Roles are controlled by the administrator on the shared workspace.');return;}openRoleModal();return;}
 const setRole=e.target.closest('[data-set-role]');if(setRole){if(state.backendActive){toast('Roles are managed by the administrator.');return;}state.role=setRole.dataset.setRole;saveState();closeModal();renderRoute();toast('Preview role changed to '+roleLabel()+'.');return;}
 const adminTab=e.target.closest('[data-admin-tab]');if(adminTab){state.adminTab=adminTab.dataset.adminTab;renderRoute();return;}
 const reviewButton=e.target.closest('[data-review]');if(reviewButton){review(reviewButton.dataset.type,Number(reviewButton.dataset.index),reviewButton.dataset.review);return;}
 const liveReview=e.target.closest('[data-submission-action]');if(liveReview){reviewLiveSubmission(liveReview.dataset.submissionId,liveReview.dataset.submissionAction);return;}
 const userAction=e.target.closest('[data-user-action]');if(userAction){performAdminUserAction(userAction.dataset.userId,userAction.dataset.userAction);return;}
 const recovery=e.target.closest('[data-password-request]');if(recovery){issuePasswordRequest(recovery.dataset.passwordRequest);return;}
 const readNotice=e.target.closest('[data-admin-notification-read]');if(readNotice){markAdminNotificationRead(readNotice.dataset.adminNotificationRead);return;}
 const readAll=e.target.closest('[data-notification-read-all]');if(readAll){markAllNotificationsRead();return;}
 const rec=e.target.closest('[data-recycle]');if(rec){recycleArticle(rec.dataset.recycle);return;}
 const restore=e.target.closest('[data-restore]');if(restore){const item=state.recycle.find(x=>String(x.id)===String(restore.dataset.restore));if(item){state.articles.unshift(item.article);state.recycle=state.recycle.filter(x=>String(x.id)!==String(item.id));saveState();renderRoute();toast('Restored in preview.');}return;}
 const liveRestore=e.target.closest('[data-restore-article]');if(liveRestore){restoreBackendArticle(liveRestore.dataset.restoreArticle);return;}
 const archive=e.target.closest('[data-archive-article]');if(archive){archiveBackendArticle(archive.dataset.archiveArticle);return;}
 const avatar=e.target.closest('[data-avatar]');if(avatar){if(state.backendActive){backendRequest('/api/auth/profile',{method:'POST',body:JSON.stringify({avatarKey:avatar.dataset.avatar})}).then(async()=>{await refreshBackendData();renderRoute();toast('Avatar updated.');}).catch(error=>toast(error.message));return;}state.avatar=avatar.dataset.avatar;saveState();renderRoute();toast('Preview avatar updated.');return;}
 const clear=e.target.closest('[data-action="clear-search"]');if(clear){state.search='';state.activeCategory='all';renderRoute();return;}
 const changeName=e.target.closest('[data-action="change-name"]');if(changeName){if(state.backendActive){updateAccountProfile();return;}const name=prompt('Display name for this browser preview:',state.name);if(name&&name.trim()){state.name=name.trim().slice(0,40);saveState();renderRoute();}return;}
 const logout=e.target.closest('[data-action="logout"]');if(logout){signOut();return;}
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
