/* mars-ui charts — UMD. window.MarsUI */
(function(root,factory){if(typeof module==='object'&&module.exports){module.exports=factory();}else{root.MarsUI=factory();}})(typeof self!=='undefined'?self:this,function(){
/* mars-ui — charts.js: vanilla SVG grafy a HTML helpery bez závislostí.
   build.py tento súbor zabalí ako UMD (window.MarsUI) aj ESM (dist/ds.esm.js).
   Farby sa čítajú z CSS premenných --mu-* (fungujú v light aj dark), fallback = Geist light. */
function createMarsUI(){
  const FALLBACK={ 'gray-100':'#f2f2f2','gray-200':'#ebebeb','gray-600':'#a8a8a8','gray-700':'#8f8f8f','gray-900':'#4d4d4d','gray-1000':'#171717',
    'blue-700':'#0070f3','blue-900':'#0068d6','green-800':'#398e4a','green-900':'#297a3a','amber-800':'#ff990a','amber-900':'#a35200',
    'red-700':'#e5484d','red-800':'#da3036','red-900':'#cb2a30','teal-700':'#12a594','teal-900':'#067a6e','purple-700':'#8e4ec6','purple-900':'#7820bc','background-100':'#ffffff' };
  const token=(name)=>{ try{ const v=getComputedStyle(document.documentElement).getPropertyValue('--mu-'+name).trim(); if(v) return v; }catch(e){} return FALLBACK[name]||'#8f8f8f'; };
  const status={ ok:()=>token('green-800'), warn3:()=>token('amber-800'), warn10:()=>token('amber-900'), crit:()=>token('red-800'), muted:()=>token('gray-700') };

  /** Formátovače podľa locale (default sk-SK). */
  function formatters(locale='sk-SK'){
    return {
      n: v=>v==null?'—':Math.round(v).toLocaleString(locale),
      k: v=>v==null?'—':(v/1000).toLocaleString(locale,{maximumFractionDigits:1}),
      pct: v=>v==null?'—':v.toLocaleString(locale,{maximumFractionDigits:1})+' %',
      f2: v=>v==null?'—':v.toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2}),
      eur: v=>v==null?'—':Math.round(v).toLocaleString(locale)+' €',
    };
  }

  /** Stavová farba podľa relatívnej odchýlky: splnené → ok, do 3 % → warn3, do 10 % → warn10, nad → crit.
      ratio = skutočnosť/cieľ; lowerIsBetter pre metriky typu PNP. */
  function ratioColor(ratio, lowerIsBetter=false){
    if(ratio==null||!isFinite(ratio)) return status.muted();
    const r=lowerIsBetter?ratio:1/ratio;
    return r<=1?status.ok():(r<=1.03?status.warn3():(r<=1.10?status.warn10():status.crit()));
  }

  /** Čiarový graf. labels: os X; series: [{label,color,values,dash,opacity,width,nodots}];
      opts: {goal, refline, ymin, ymax, yfmt, tfmt, xstep, wide}. */
  function lineChart(el, labels, series, opts={}){
    const W=opts.wide?1100:560,H=opts.wide?400:320,R=opts.wide?56:48,T=14,B=26;
    let all=series.flatMap(s=>s.values).filter(v=>v!=null);
    if(opts.goal!=null) all=all.concat([opts.goal]);
    if(!all.length){ el.innerHTML='<div class="chart-empty">'+(opts.empty||'Bez dát.')+'</div>'; return; }
    let ymax=opts.ymax||Math.max(...all)*1.1, ymin=opts.ymin!=null?opts.ymin:Math.min(0,...all)*1.1;
    if(ymax===ymin) ymax=ymin+1;
    const yLabels=[0,1,2,3,4].map(k=>{const v=ymin+(ymax-ymin)*k/4; return String(opts.yfmt?opts.yfmt(v):Math.round(v));});
    const L=Math.max(opts.wide?56:48, Math.round(Math.max(...yLabels.map(t=>t.length))*7.6)+12);
    const iw=W-L-R, ih=H-T-B, n=labels.length;
    const x=i=>L+iw*i/Math.max(n-1,1);
    const y=v=>T+ih*(1-(Math.min(Math.max(v,ymin),ymax)-ymin)/(ymax-ymin));
    const step=opts.xstep||1, grid=token('gray-200'), axis=token('gray-700'), goalC=token('gray-1000');
    let g='';
    for(let k=0;k<=4;k++){const v=ymin+(ymax-ymin)*k/4;
      g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="${grid}" stroke-width="1"/>`;
      g+=`<text x="${L-6}" y="${y(v)+3.5}" text-anchor="end" font-size="13" fill="${axis}">${yLabels[k]}</text>`;}
    labels.forEach((m,i)=>{if(i%step===0||i===n-1)g+=`<text x="${x(i)}" y="${H-6}" text-anchor="middle" font-size="13" fill="${axis}">${m}</text>`;});
    if(opts.goal!=null){g+=`<line x1="${L}" x2="${W-R}" y1="${y(opts.goal)}" y2="${y(opts.goal)}" stroke="${goalC}" stroke-dasharray="4 3" stroke-width="1.2"/><text x="${W-R-2}" y="${y(opts.goal)-5}" text-anchor="end" font-size="13" fill="${goalC}">${opts.goalLabel||'cieľ'} ${opts.yfmt?opts.yfmt(opts.goal):opts.goal}</text>`;}
    if(opts.refline!=null){g+=`<line x1="${L}" x2="${W-R}" y1="${y(opts.refline)}" y2="${y(opts.refline)}" stroke="${goalC}" stroke-width="1.2" opacity=".6"/>`;}
    series.forEach(s=>{
      const vals=s.values.map((v,i)=>[v,i]).filter(([v])=>v!=null);
      const pts=vals.map(([v,i])=>`${x(i)},${y(v)}`).join(' ');
      const op=s.opacity!=null?` stroke-opacity="${s.opacity}"`:'';
      g+=`<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="${s.width||2}" stroke-linejoin="round"${s.dash?` stroke-dasharray="${s.dash}"`:''}${op}/>`;
      if(!s.nodots) vals.forEach(([v,i])=>{g+=`<circle cx="${x(i)}" cy="${y(v)}" r="2.6" fill="${s.color}" stroke="${token('background-100')}" stroke-width="1.2"${s.opacity!=null?` fill-opacity="${s.opacity}"`:''}><title>${s.label} · ${labels[i]}: ${opts.tfmt?opts.tfmt(v):v}</title></circle>`;});
      if(vals.length&&s.label){const [lv,li]=vals[vals.length-1];
        g+=`<text x="${x(li)+6}" y="${y(lv)+3.5}" font-size="12.5" fill="${s.color}"${op}>${s.label}</text>`;}
    });
    el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;overflow:visible" role="img">${g}</svg>`;
  }

  /** Bullet graf „cieľ vs. skutočnosť". rows: [{label,val,pct,ppct,big,sub,right,rightVal,color}];
      opts: {progress (0–100, „dnes"), noData, goalLabel:'CIEĽ 100 %', todayLabel:'DNES', emptyText}. */
  function bulletChart(el, rows, opts={}){
    const W=980,x0=270,x1=770,BH=13,RH=90,TOP=34,H=TOP+rows.length*RH;
    const maxP=Math.max(115,...rows.flatMap(r=>[r.pct||0,r.ppct||0]))*1.05;
    const X=p=>x0+(x1-x0)*Math.min(Math.max(p||0,0),maxP)/maxP;
    const xg=X(100), prog=opts.progress, noData=!!opts.noData;
    const dark=token('gray-1000'), mid=token('gray-900'), light=token('gray-700'), track=token('gray-200');
    let g=`<line x1="${xg}" x2="${xg}" y1="${TOP-12}" y2="${H-10}" stroke="${dark}" stroke-width="1.8" opacity=".55"/>`+
          `<text x="${xg}" y="${TOP-18}" text-anchor="middle" font-size="13.5" fill="${dark}">${opts.goalLabel||'CIEĽ 100 %'}</text>`;
    if(prog!=null&&Math.abs(prog-100)>=3){const xd=X(prog);
      g+=`<line x1="${xd}" x2="${xd}" y1="${TOP-12}" y2="${H-10}" stroke="${light}" stroke-width="1.5" stroke-dasharray="3 3"/>`+
         `<text x="${xd}" y="${H+4}" text-anchor="middle" font-size="13.5" fill="${dark}">${opts.todayLabel||'DNES'} ${opts.progressLabel||(Math.round(prog*10)/10+' %')}</text>`;}
    rows.forEach((r,i)=>{const y=TOP+i*RH+6; const c=r.color||status.muted();
      g+=`<text x="0" y="${y+2}" font-size="13.5" fill="${light}">${r.label}</text>`+
         `<text x="0" y="${y+21}" font-size="16" font-weight="700" fill="${c}">${r.val}</text>`+
         `<rect x="${x0}" y="${y}" width="${xg-x0}" height="${BH}" rx="6" fill="${track}"/>`;
      if((r.ppct||0)>(r.pct||0)+0.5) g+=`<rect x="${Math.max(x0,X(r.pct)-6)}" y="${y}" width="${X(r.ppct)-X(r.pct)+6}" height="${BH}" rx="6" fill="${c}" opacity=".25"/>`;
      g+=`<rect x="${x0}" y="${y}" width="${Math.max(8,X(r.pct)-x0)}" height="${BH}" rx="6" fill="${c}"><title>${r.label}: ${r.val} vs ${r.rightVal}</title></rect>`+
         `<text x="${(x0+x1)/2}" y="${y+BH+27}" text-anchor="middle" font-size="21" font-weight="700" fill="${c}">${noData?'—':r.big}</text>`+
         `<text x="${(x0+x1)/2}" y="${y+BH+45}" text-anchor="middle" font-size="13.5" fill="${mid}">${noData?(opts.emptyText||'zatiaľ bez dát'):r.sub}</text>`+
         `<text x="${x1+16}" y="${y+2}" font-size="13.5" fill="${light}">${r.right}</text>`+
         `<text x="${x1+16}" y="${y+21}" font-size="16" font-weight="700" fill="${dark}">${r.rightVal}</text>`;
    });
    el.innerHTML=`<svg viewBox="0 0 ${W} ${H+10}" style="width:100%;height:auto;overflow:visible" role="img">${g}</svg>`;
  }

  /** Tabuľka: cols [{h, num, gs}], rows = pole hotových <tr>…</tr> reťazcov, groups voliteľné [{h, span}]. */
  function table(cols, rows, groups){
    const grp=groups?`<tr class="grp">${groups.map(g=>`<th colspan="${g.span}">${g.h||''}</th>`).join('')}</tr>`:'';
    return `<div class="tbl-scroll"><table${groups?' class="grouped"':''}><thead>${grp}<tr>${cols.map(c=>`<th class="${[c.num?'num':'',c.gs?'gs':''].join(' ').trim()}">${c.h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  }

  /** Badge HTML. tone: ok|warn|crit|info|neutral|purple|teal|pink|brand */
  function badge(text, tone='neutral'){ return `<span class="chip chip-${tone}">${text}</span>`; }

  /** Chip medziročnej zmeny: +x % zelený, −x % červený, null = „bez dát". */
  function yoyChip(v, fmt=formatters().pct, label='YoY'){
    if(v==null) return badge('bez '+label,'warn');
    return v>=0?badge(`${label} +${fmt(v)}`,'ok'):badge(`${label} −${fmt(-v)}`,'crit');
  }

  /** Chip tempa: fulfil % vs. progress % mesiaca. */
  function paceChip(fulfil, progress, labels={none:'bez dát',ok:'v pláne',warn:'mierne pozadu',crit:'pozadu'}){
    if(fulfil==null) return badge(labels.none,'warn');
    const r=fulfil/Math.max(progress,0.01);
    if(r>=1) return badge(labels.ok,'ok');
    if(r>=0.85) return badge(labels.warn,'warn');
    return badge(labels.crit,'crit');
  }

  return { version:'1.0.0', token, status, ratioColor, formatters, lineChart, bulletChart, table, badge, yoyChip, paceChip };
}

return createMarsUI();
});
