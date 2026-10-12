/* LabTox — site público estático. Lê somente JSON aprovado em data/. */
(() => {
  'use strict';
  const C = window.LABTOX_CONFIG || {};
  const page = document.body.dataset.page || 'inicio';
  const names = {inicio:'Início',noticias:'Notícias',noticia:'Notícias',publicacoes:'Publicações',servicos:'Serviços',equipe:'Equipe',galeria:'Galeria',album:'Galeria',contato:'Contato',ensino:'Ensino'};
  const navigation = [['inicio','Início','index.html'],['noticias','Notícias','noticias.html'],['publicacoes','Publicações','publicacoes.html'],['servicos','Serviços','servicos.html'],['ensino','Ensino','ensino.html'],['equipe','Equipe','equipe.html'],['galeria','Galeria','galeria.html'],['contato','Contato','contato.html']];
  let records = {noticias:[],publicacoes:[],equipe:[],servicos:[],galeria:[],ensino:[]};
  const esc = x => String(x ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const compact = (t, n=155) => String(t||'').replace(/[#*_\[\]<>]/g,'').replace(/\s+/g,' ').trim().slice(0,n) + (String(t||'').length>n?'…':'');
  const safeExternal = str => {try{const u=new URL(String(str));return u.protocol==='https:' ? u.href : '';}catch{return '';}};
  const media = str => {
    if(!str) return '';
    const s=String(str).trim();
    const match=s.match(/^r2:\/\/(uploads\/\d+\/[a-f0-9-]{36}\.(?:jpg|png|webp))$/i);
    if(match) return 'assets/media/'+match[1];
    if(/^assets\/media\/[a-zA-Z0-9/_-]+\.(?:png|jpg|webp)$/i.test(s))return s;
    return safeExternal(s);
  };
  const date = str => {
    if(!str)return '';
    const iso=String(str).slice(0,10);
    const d=new Date(iso+'T12:00:00');
    return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(d);
  };
  const unique = arr => [...new Set(arr.filter(Boolean))];
  const el = (id) => document.getElementById(id);
  function imageHTML(src, alt, symbol='✦'){
    const url=media(src);
    if(!url)return `<span class="fallback-icon" aria-hidden="true">${symbol}</span>`;
    return `<img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span class=&quot;fallback-icon&quot; aria-hidden=&quot;true&quot;>✦</span>')">`;
  }
  function empty(message, hint='O conteúdo aparecerá assim que for aprovado e sincronizado com o site público.'){
    return `<div class="empty"><div class="symbol" aria-hidden="true">◇</div><h3>${esc(message)}</h3><p>${esc(hint)}</p></div>`;
  }
  function brand(){
    const logo=C.logo ? `<img src="${esc(C.logo)}" alt="" onerror="this.onerror=null;this.parentElement.textContent='LT'">` : 'LT';
    return `<a class="brand" href="index.html" aria-label="LabTox — Início"><span class="brand-icon" aria-hidden="true">${logo}</span><span class="brand-copy"><strong>Lab<span>Tox</span></strong><small>Laboratório de Toxicologia</small></span></a>`;
  }
  function chrome(){
    el('site-header').innerHTML=`<a class="skip" href="#main">Ir para o conteúdo</a><div class="microbar"><div class="container"><span>UNIVERSIDADE DE BRASÍLIA <span aria-hidden="true"> · </span> PESQUISA E FORMAÇÃO</span><a href="${esc(safeExternal(C.siteInstitucional)||'https://www.unb.br/') }" target="_blank" rel="noopener noreferrer">Portal da UnB ↗</a></div></div><header class="header"><div class="container header-row">${brand()}<button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">☰ Menu</button><nav id="site-nav" class="nav" aria-label="Navegação principal">${navigation.map(([slug,name,link])=>`<a href="${link}" ${((page==='noticia'&&slug==='noticias')||(page==='album'&&slug==='galeria')||slug===page)?'aria-current="page"':''}>${name}</a>`).join('')}</nav></div></header>`;
    el('site-footer').innerHTML=`<footer class="footer"><div class="container"><div class="footer-grid"><div>${brand()}<p>${esc(C.descricao||'Pesquisa, formação e ciência em toxicologia.')}</p></div><div><h3>Navegação</h3><ul>${navigation.map(([slug,name,link])=>`<li><a href="${link}">${name}</a></li>`).join('')}</ul></div><div><h3>Institucional</h3><ul><li>${esc(C.instituicao||'Universidade de Brasília')}</li><li>${esc(C.endereco||'Brasília, DF')}</li><li><a href="${esc(safeExternal(C.siteInstitucional)||'https://www.unb.br/') }" target="_blank" rel="noopener noreferrer">Universidade de Brasília ↗</a></li></ul></div></div><div class="footer-bottom"><span>© <span id="year"></span> LabTox · ${esc(C.instituicao||'Universidade de Brasília')}.</span><span>Site institucional · Conteúdos científicos e atividades do laboratório</span></div></div></footer>`;
    el('year').textContent=new Date().getFullYear();
    const toggle=el('menu-toggle'),nav=el('site-nav');
    toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
    nav.addEventListener('click',ev=>{if(ev.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
    el('back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    addEventListener('scroll',()=>el('back-top').classList.toggle('visible',scrollY>450),{passive:true});
  }
  // Identidade visual opcional: não exige alterações manuais no HTML ou no CSS.
  // Mostra o fundo original até uma fotografia de banner realmente existir.
  function setupIdentity(){
    document.querySelectorAll('.brand-icon img').forEach(img => {
      const fitLogo = () => {
        if (img.naturalWidth && img.naturalHeight && img.naturalWidth / img.naturalHeight >= 1.65) {
          img.closest('.brand')?.classList.add('brand--horizontal');
        }
      };
      img.addEventListener('load', fitLogo, {once:true});
      if(img.complete && img.naturalWidth) fitLogo();
    });

    const path = C.banners && C.banners[page];
    if (typeof path !== 'string' || !/^assets\/banners\/[a-z0-9_-]+\.(?:jpg|jpeg|png|webp)$/i.test(path)) return;
    const element = document.querySelector(page === 'inicio' ? '.hero' : '.page-hero');
    if (!element) return;
    const preloader = new Image();
    preloader.onload = () => {
      element.style.setProperty('--labtox-banner-image', `url("${path}")`);
      element.classList.add('has-banner');
    };
    preloader.onerror = () => {}; // Sem imagem: permanece o fundo original da página.
    preloader.src = path;
  }
  function cardNews(n){
    const id=Number(n.id);
    return `<article class="card"><div class="card-top">${imageHTML(n.imagem_url,n.titulo,'▤')}</div><div class="card-body"><div class="meta">${esc(n.categoria||'Notícia')} ${n.aprovado_em?' · '+date(n.aprovado_em):''}</div><h3>${esc(n.titulo||'Notícia')}</h3><p>${esc(compact(n.conteudo,145))}</p><a class="mini-link" href="noticia.html?id=${Number.isSafeInteger(id)?id:0}">Ler notícia <span aria-hidden="true">↗</span></a></div></article>`;
  }
  function cardAlbum(a){
    const id=Number(a.id);const fotos=Array.isArray(a.fotos)?a.fotos:[];
    return `<article class="card"><div class="card-top">${imageHTML(fotos[0]?.imagem_url,a.titulo,'▧')}</div><div class="card-body"><div class="meta">${date(a.data_registro)||'Galeria'} · ${fotos.length} ${fotos.length===1?'foto':'fotos'}</div><h3>${esc(a.titulo)}</h3><p>${esc(compact(a.descricao||a.local||'Registros fotográficos das atividades do laboratório.',130))}</p><a class="mini-link" href="album.html?id=${Number.isSafeInteger(id)?id:0}">Ver álbum ↗</a></div></article>`;
  }
  function publication(p){
    const year=Number(p.ano)||'';const doi=String(p.doi||'').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i,'');
    const validDoi=/^10\.\d{4,9}\/\S+$/i.test(doi);
    return `<article class="paper"><div class="meta">${esc(year)} ${p.revista?'· '+esc(p.revista):''}</div><h3>${esc(p.titulo||'Publicação')}</h3><div class="authors">${esc(p.autores||'')}</div>${p.resumo?`<p>${esc(compact(p.resumo,290))}</p>`:''}<div class="paper-actions">${validDoi?`<a class="btn btn-outline" href="https://doi.org/${encodeURI(doi).replace(/\"/g,'') }" target="_blank" rel="noopener noreferrer">Acessar artigo ↗</a><span class="meta" style="text-transform:none;letter-spacing:0">DOI: ${esc(doi)}</span>`:'<span class="tag">Referência bibliográfica</span>'}</div></article>`;
  }
  function service(s){return `<article class="card"><div class="card-top">${imageHTML(s.imagem_url,s.titulo,'✧')}</div><div class="card-body"><span class="meta">${esc(s.categoria||'Serviço')}</span><h3>${esc(s.titulo||'Serviço')}</h3><p>${esc(compact(s.descricao,250))}</p><a class="mini-link" href="contato.html?assunto=Servi%C3%A7os">Solicitar informações ↗</a></div></article>`;}
  function teaching(item){
    const url=safeExternal(item.link_url);
    return `<article class="card"><div class="card-body"><span class="meta">${esc(item.categoria||'Ensino')}</span><h3>${esc(item.titulo)}</h3><p>${esc(item.descricao||'')}</p>${url?`<a class="mini-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Saiba mais ↗</a>`:''}</div></article>`;
  }
  function person(p){
    return `<article class="card team-card"><div class="card-top">${imageHTML(p.foto_url,p.nome,'♙')}</div><div class="card-body"><h3>${esc(p.nome)}</h3><div class="role">${esc(p.cargo||'Equipe LabTox')}</div>${p.descricao?`<p class="desc">${esc(compact(p.descricao,130))}</p>`:''}<div class="team-links">${safeExternal(p.lattes_url)?`<a href="${esc(safeExternal(p.lattes_url))}" target="_blank" rel="noopener noreferrer">Lattes ↗</a>`:''}${p.orcid&&/^\d{4}-\d{4}-\d{4}-[0-9X]{4}$/.test(p.orcid)?`<a href="https://orcid.org/${esc(p.orcid)}" target="_blank" rel="noopener noreferrer">ORCID ↗</a>`:''}</div></div></article>`;
  }
  function parseInline(text){
    let x=esc(text);
    x=x.replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)/g,(_,label,url)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`);
    x=x.replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>');
    x=x.replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
    return x;
  }
  function formatMarkdown(text){
    // A conversão começa escapando todo HTML; apenas uma parte conhecida do Markdown é interpretada.
    const lines=String(text||'').replace(/\r\n/g,'\n').split('\n');
    let out='',para=[],list=null;
    const flushPara=()=>{if(para.length){out+=`<p>${parseInline(para.join(' '))}</p>`;para=[];}};
    const flushList=()=>{if(list){out+=`</${list}>`;list=null;}};
    for(const raw of lines){const l=raw.trim();if(!l){flushPara();flushList();continue;}
      let m=l.match(/^(#{2,3})\s+(.+)$/);if(m){flushPara();flushList();const tag=m[1].length===2?'h2':'h3';out+=`<${tag}>${parseInline(m[2])}</${tag}>`;continue;}
      m=l.match(/^([-*])\s+(.+)$/);let ol=l.match(/^\d+[.)]\s+(.+)$/);
      if(m||ol){flushPara();const type=ol?'ol':'ul';if(list!==type){flushList();out+=`<${type}>`;list=type;}out+=`<li>${parseInline(ol?ol[1]:m[2])}</li>`;continue;}
      flushList();para.push(l);
    }
    flushPara();flushList();return out;
  }
  function setupHomeNewsCarousel(count) {
    const track=el('home-news'), controls=el('news-controls'), dots=el('home-news-dots');
    if(!track||!controls||!dots)return;
    controls.hidden=count<2;
    track.dataset.count=String(count);
    dots.innerHTML='';
    if(count<2) return;
    const cards=[...track.querySelectorAll('.card')];
    const prev=el('home-news-prev'), next=el('home-news-next'), status=el('home-news-status');
    const motion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    let current=0;
    function visibleCount(){
      if(!cards.length)return 1;
      const width=cards[0].getBoundingClientRect().width;
      return Math.max(1,Math.round(track.clientWidth/Math.max(width,1)));
    }
    function updateDots(){
      const num=Math.max(1,count-visibleCount()+1);
      if(dots.children.length===num)return;
      dots.replaceChildren();
      for(let i=0;i<num;i++){
        const dot=document.createElement('button');
        dot.type='button';dot.className='news-dot';
        dot.setAttribute('aria-label',`Mostrar a partir da notícia ${i+1}`);
        dot.setAttribute('aria-controls','home-news');
        dot.addEventListener('click',()=>go(i));
        dots.appendChild(dot);
      }
    }
    function update(){
      if(!cards.length)return;
      controls.hidden=count<=visibleCount();
      dots.hidden=controls.hidden;
      updateDots();
      const first=cards[0].offsetLeft;
      let min=Infinity;
      cards.forEach((card,index)=>{
        const diff=Math.abs(card.offsetLeft-first-track.scrollLeft);
        if(diff<min){min=diff;current=index;}
      });
      const shown=Math.min(count,current+visibleCount());
      status.textContent=`Notícias ${current+1} a ${shown} de ${count}`;
      prev.disabled=current===0;
      next.disabled=track.scrollLeft+track.clientWidth >= track.scrollWidth-3;
      [...dots.children].forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));
    }
    function go(i){
      const index=Math.max(0,Math.min(cards.length-1,i));
      const target=cards[index].offsetLeft-cards[0].offsetLeft;
      track.scrollTo({left:Math.min(target,track.scrollWidth-track.clientWidth),behavior:motion});
      if(motion==='auto')update();
    }
    prev.addEventListener('click',()=>go(current-1));
    next.addEventListener('click',()=>go(current+1));
    track.addEventListener('keydown',ev=>{
      if(ev.key==='ArrowRight'){ev.preventDefault();go(current+1);}
      if(ev.key==='ArrowLeft'){ev.preventDefault();go(current-1);}
    });
    let raf=null;
    track.addEventListener('scroll',()=>{
      if(raf!==null)cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{raf=null;update();});
    },{passive:true});
    addEventListener('resize',update,{passive:true});
    update();
  }
  function publicationGroups(items){
    if(!items.length)return '';
    const years=new Map();
    for(const item of items){
      const num=Number(item.ano);
      const year=Number.isInteger(num)&&num>=1900&&num<=2100?String(num):'Sem ano informado';
      if(!years.has(year))years.set(year,[]);
      years.get(year).push(item);
    }
    return [...years].sort(([a],[b])=>{
      if(a==='Sem ano informado')return 1;
      if(b==='Sem ano informado')return -1;
      return Number(b)-Number(a);
    }).map(([year,group])=>`<section class="publication-year" aria-label="Publicações de ${esc(year)}"><div class="publication-year-heading"><h2>${esc(year)}</h2><span>${group.length} ${group.length===1?'publicação':'publicações'}</span></div><div class="stack">${group.map(publication).join('')}</div></section>`).join('');
  }
  function renderHome(){
    const news=records.noticias.slice().sort((a,b)=>{
      const ad=String(a.aprovado_em||a.data_publicacao||a.criado_em||'');
      const bd=String(b.aprovado_em||b.data_publicacao||b.criado_em||'');
      return bd.localeCompare(ad)||Number(b.id||0)-Number(a.id||0);
    }).slice(0,5);
    const papers=records.publicacoes.slice().sort((a,b)=>Number(b.ano||0)-Number(a.ano||0)).slice(0,3);
    const albums=records.galeria.slice().sort((a,b)=>String(b.data_registro||'').localeCompare(String(a.data_registro||''))).slice(0,3);
    el('home-news').innerHTML=news.length?news.map(cardNews).join(''):empty('As primeiras notícias aparecerão aqui.');
    if(!news.length)el('home-news').classList.add('news-empty');
    else setupHomeNewsCarousel(news.length);
    el('home-papers').innerHTML=papers.length?papers.map(publication).join(''):empty('As publicações científicas aparecerão aqui.');
    el('home-albums').innerHTML=albums.length?albums.map(cardAlbum).join(''):empty('A galeria de atividades será exibida aqui.');
    for(const id of ['home-papers','home-albums'])if(el(id).querySelector('.empty'))el(id).style.display='block';
  }
  function renderList(type,id,renderItem,emptyTitle){
    let items=records[type].slice();const root=el(id);if(!root)return;
    const search=el('search'),select=el('filter');
    let selectField=type==='noticias'?'categoria':type==='publicacoes'?'ano':type==='servicos'?'categoria':'';
    if(select){const opt=unique(items.map(x=>String(x[selectField]||'').trim())).sort((a,b)=>selectField==='ano'?Number(b)-Number(a):a.localeCompare(b,'pt-BR'));
      select.innerHTML='<option value="">Todos</option>'+opt.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    }
    function update(){const q=String(search?.value||'').trim().toLocaleLowerCase('pt-BR');const f=select?.value||'';
      let filtered=items.filter(x=>{const text=Object.entries(x).filter(([k])=>!['versao_publicada','fotos','dados_json'].includes(k)).map(([,v])=>typeof v==='string'?v:'').join(' ').toLocaleLowerCase('pt-BR');return (!q||text.includes(q))&&(!f||String(x[selectField]||'')===f);});
      if(type==='galeria'){const asc=el('album-order')?.value==='asc';filtered.sort((a,b)=>((String(a.data_registro||'').localeCompare(String(b.data_registro||'')))||Number(a.id||0)-Number(b.id||0))*(asc?1:-1));}
      if(el('results-count'))el('results-count').textContent=`${filtered.length} ${filtered.length===1?'resultado':'resultados'}`;
      root.innerHTML=filtered.length?(type==='publicacoes'?publicationGroups(filtered):filtered.map(renderItem).join('')):empty(emptyTitle,q||f?'Tente outro termo ou retire o filtro.':'O conteúdo aparecerá após aprovação e sincronização.');
      if(root.querySelector('.empty'))root.style.display='block';else root.style.display='';
    }
    search?.addEventListener('input',update);select?.addEventListener('change',update);el('album-order')?.addEventListener('change',update);update();
  }
  function renderDetails(type){
    const id=Number(new URLSearchParams(location.search).get('id'));const root=el('detail-root');
    const item=records[type].find(x=>Number(x.id)===id);
    if(!item){root.innerHTML=empty('Conteúdo não encontrado','O item pode não ter sido publicado ou pode ter sido retirado do site.');return;}
    if(type==='noticias'){
      const img=media(item.imagem_url);
      document.title=`${item.titulo} | LabTox`;
      root.innerHTML=`<a class="text-link" href="noticias.html">← Voltar para Notícias</a><div class="divider"></div><span class="meta">${esc(item.categoria||'Notícia')} ${item.aprovado_em?' · '+date(item.aprovado_em):''}</span><h1 style="font-size:clamp(32px,4.1vw,48px);margin:13px 0 22px">${esc(item.titulo)}</h1>${img?`<img class="cover" src="${esc(img)}" alt="Imagem de capa da notícia: ${esc(item.titulo)}" onerror="this.remove()">`:''}<div class="article-text">${formatMarkdown(item.conteudo)}</div>`;
    }else{
      document.title=`${item.titulo} | Galeria LabTox`;
      const photos=Array.isArray(item.fotos)?item.fotos:[];
      const chronological=(asc)=>photos.map((f,i)=>({...f,_originalIndex:i})).sort((a,b)=>{const c=String(a.data_foto||item.data_registro||'').localeCompare(String(b.data_foto||item.data_registro||''));return (asc?c:-c)||(a._originalIndex-b._originalIndex);});
      const photoMarkup=(asc)=>chronological(asc).map((f,i)=>`<figure class="album-photo"><img src="${esc(media(f.imagem_url)||'assets/missing-photo.png')}" alt="${esc(f.legenda||`Fotografia ${i+1} do álbum`)}" loading="lazy" data-zoom="true" onerror="this.style.visibility='hidden'"><figcaption>${f.data_foto?esc(date(f.data_foto))+' · ':''}${esc(f.legenda||`Foto ${i+1}`)}</figcaption></figure>`).join('');
      root.innerHTML=`<a class="text-link" href="galeria.html">← Voltar para Galeria</a><div class="divider"></div><span class="meta">${date(item.data_registro)}${item.local?' · '+esc(item.local):''}</span><h1 style="font-size:clamp(32px,4.1vw,48px);margin:13px 0 15px">${esc(item.titulo)}</h1><p style="color:var(--muted)">${esc(item.descricao||'')}</p><div class="filters" style="margin-top:22px"><label for="photo-order">Ordem das fotografias</label><select id="photo-order" class="filter-select"><option value="asc">Mais antigas primeiro</option><option value="desc">Mais recentes primeiro</option></select></div><div class="album-grid" id="album-photos" style="margin-top:15px">${photos.length?photoMarkup(true):empty('Álbum ainda sem fotografias disponíveis','As imagens serão exibidas depois da sincronização dos arquivos aprovados.')}</div>`;
      const wireZoom=()=>root.querySelectorAll('[data-zoom]').forEach(img=>img.addEventListener('click',()=>openLightbox(img.src,img.alt)));
      el('photo-order')?.addEventListener('change',e=>{el('album-photos').innerHTML=photoMarkup(e.target.value==='asc');wireZoom();});
      wireZoom();
    }
  }
  function openLightbox(src,alt){const d=el('lightbox');el('lightbox-image').src=src;el('lightbox-image').alt=alt;d.classList.add('open');d.setAttribute('aria-hidden','false');el('close-lightbox').focus();}
  function closeLightbox(){const d=el('lightbox');d.classList.remove('open');d.setAttribute('aria-hidden','true');el('lightbox-image').src='';}
  function renderContact(){
    const email=el('contact-email');
    if(email)email.innerHTML=C.email?`<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`:'E-mail institucional em atualização';
    if(el('contact-address'))el('contact-address').textContent=C.endereco||'Universidade de Brasília — Brasília, DF';
    const form=el('contact-form');
    if(form){
      const topic=el('form-topic');const subject=el('form-subject');
      const setSubject=()=>{subject.value='[LabTox] '+(topic.value||'Contato pelo site');};
      topic.addEventListener('change',setSubject);
      const q=new URLSearchParams(location.search);
      const selected=q.get('assunto');
      if(selected&&[...topic.options].some(opt=>opt.value===selected)){topic.value=selected;setSubject();}
      form.addEventListener('submit',setSubject);
    }
  }
  async function load(){
    try{
      const res=await fetch(C.dados||'data/labtox-conteudos.json',{cache:'no-cache'});
      if(!res.ok)throw Error('Não foi possível carregar o JSON');
      const data=await res.json();
      if(data.formato!=='labtox-conteudos-v1')throw Error('Formato de dados não reconhecido');
      for(const key of Object.keys(records))records[key]=Array.isArray(data[key])?data[key]:[];
      if(data.gerado_em&&el('updated-at'))el('updated-at').textContent=`Atualização dos dados: ${date(data.gerado_em)}`;
    }catch(e){console.warn('LabTox: carregamento de conteúdos',e.message);const target=el('data-warning');if(target)target.textContent='Os dados ainda não estão sincronizados. As páginas institucionais continuam disponíveis.';}
    if(page==='inicio')renderHome();
    if(page==='noticias')renderList('noticias','news-list',cardNews,'Nenhuma notícia disponível');
    if(page==='publicacoes')renderList('publicacoes','papers-list',publication,'Nenhuma publicação disponível');
    if(page==='servicos')renderList('servicos','services-list',service,'Nenhum serviço cadastrado');
    if(page==='ensino')renderList('ensino','teaching-list',teaching,'Nenhuma atividade de ensino cadastrada');
    if(page==='equipe'){
      const partners=records.equipe.filter(x=>x.grupo!=='alunos');
      const students=records.equipe.filter(x=>x.grupo==='alunos');
      for(const [id,items,label] of [['team-partners',partners,'Colaboradores e parcerias'],['team-students',students,'Alunos']]){
        const root=el(id);root.innerHTML=items.length?items.map(person).join(''):empty(label+' em atualização','Cadastre ou reclassifique os integrantes no painel administrativo.');
      }
    }
    if(page==='galeria')renderList('galeria','albums-list',cardAlbum,'Nenhum álbum disponível');
    if(page==='noticia')renderDetails('noticias');
    if(page==='album')renderDetails('galeria');
    if(page==='contato')renderContact();
  }
  document.addEventListener('DOMContentLoaded',()=>{chrome();setupIdentity();if(el('lightbox')){el('close-lightbox').addEventListener('click',closeLightbox);el('lightbox').addEventListener('click',ev=>{if(ev.target===el('lightbox'))closeLightbox();});addEventListener('keydown',ev=>{if(ev.key==='Escape')closeLightbox();});}load();});
})();
