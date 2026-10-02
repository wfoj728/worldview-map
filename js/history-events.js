/* ================================================================
 * 历史事件图层  js/history-events.js
 * 数据：五朝关键战役(battle) / 政治变动(politics)
 * 坐标为 map 坐标（与州点同一坐标系，随画布缩放平移）
 * 层级契约：本图层 #layerEvents 固定在州点层之上、州名标签之上，
 *           且仅通过 HistoryLayer.render() 单一入口重绘，保证层级稳定。
 * ================================================================ */
window.HISTORY_EVENTS = [
  /* ---------------- 汉 ---------------- */
  {id:"han_mobei", name:"漠北之战", type:"battle", year:"汉元狩四年",
   dynasties:["han"], x:700, y:214,
   desc:"卫青、霍去病分道深入漠北，大破匈奴。霍去病封狼居胥、禅姑衍，登临瀚海，自此漠南无王庭。"},
  {id:"han_zhangqian", name:"张骞凿空西域", type:"politics", year:"汉建元二年",
   dynasties:["han"], x:330, y:400,
   desc:"张骞两使西域，十三年始归，凿空之旅开丝绸之路。葡萄、苜蓿、良马由此入中土。"},
  {id:"han_wugu", name:"巫蛊之祸", type:"politics", year:"汉征和二年",
   dynasties:["han"], x:840, y:416,
   desc:"江充以桐木人偶构陷太子据，皇后卫子夫、太子据先后自杀，株连死者数万，长安血流成渠。"},
  {id:"han_wangmang", name:"王莽篡汉", type:"politics", year:"汉初始元年",
   dynasties:["han"], x:842, y:432,
   desc:"王莽受孺子婴禅让，改国号新，西汉二百一十年而亡。随后托古改制，天下大乱。"},

  /* ---------------- 晋 ---------------- */
  {id:"jin_bawang", name:"八王之乱", type:"politics", year:"晋永平元年",
   dynasties:["jin"], x:932, y:416,
   desc:"汝南王亮等八王为争夺中枢混战十六年，中原虚耗，洛阳长安迭遭兵燹，遂启五胡乱华之祸。"},
  {id:"jin_nandu", name:"衣冠南渡", type:"politics", year:"晋建兴五年",
   dynasties:["jin"], x:898, y:534,
   desc:"琅邪王司马睿于建康即位，是为东晋。中州士女避乱江左者十六七，王与马共天下。"},
  {id:"jin_feishui", name:"淝水之战", type:"battle", year:"晋太元八年",
   dynasties:["jin"], x:858, y:476,
   desc:"谢玄率北府兵八万，破苻坚百万之众于淝水。秦兵奔溃，风声鹤唳、草木皆兵，东晋得保半壁。"},

  /* ---------------- 唐 ---------------- */
  {id:"tang_xuanwumen", name:"玄武门之变", type:"politics", year:"唐武德九年",
   dynasties:["tang"], x:848, y:434,
   desc:"秦王李世民伏兵玄武门，杀太子建成、齐王元吉，高祖旋立之为太子，两月后禅位。"},
  {id:"tang_daluosi", name:"怛罗斯之战", type:"battle", year:"唐天宝十年",
   dynasties:["tang"], x:196, y:374,
   desc:"安西节度使高仙芝与大食战于怛罗斯，葛逻禄叛，唐军败绩。唐俘西去，造纸术由此传入中亚。"},
  {id:"tan_anlushan", name:"安史之乱", type:"battle", year:"唐天宝十四年",
   dynasties:["tang"], x:940, y:274,
   desc:"安禄山以诛杨国忠为名起于范阳，两京陷落，明皇幸蜀。乱历八年，大唐由盛而衰。"},
  {id:"tang_fanzhen", name:"藩镇割据", type:"politics", year:"唐广德元年",
   dynasties:["tang"], x:918, y:354,
   desc:"安史降将分据河朔三镇，自署官吏、不输贡赋。其后藩镇遍天下，割据百五十年，终亡唐室。"},

  /* ---------------- 宋 ---------------- */
  {id:"song_chenqiao", name:"陈桥兵变", type:"politics", year:"周显德七年",
   dynasties:["song"], x:948, y:394,
   desc:"赵匡胤北征至陈桥驿，将士黄袍加身，回师汴梁，兵不血刃而代周，北宋立。"},
  {id:"song_chanyuan", name:"澶渊之盟", type:"politics", year:"宋景德元年",
   dynasties:["song"], x:892, y:374,
   desc:"真宗亲征澶州，宋辽约为兄弟之国，宋岁输银绢。此后北疆百年无大战，然武备亦弛。"},
  {id:"song_wanganshi", name:"王安石变法", type:"politics", year:"宋熙宁二年",
   dynasties:["song"], x:964, y:406,
   desc:"王安石得神宗之眷行新法，青苗、募伤、保甲纷起。新旧党争垂四十年，朝局反复，元气大伤。"},
  {id:"song_jingkang", name:"靖康之变", type:"politics", year:"宋靖康二年",
   dynasties:["song"], x:968, y:422,
   desc:"金兵再围汴京，城破，徽钦二帝及宗室百官被掳北去，北宋亡。靖康耻，犹未雪。"},

  /* ---------------- 明 ---------------- */
  {id:"ming_jingnan", name:"靖难之役", type:"battle", year:"明建文元年—四年",
   dynasties:["ming"], x:936, y:272,
   desc:"燕王朱棣以清君侧为名起兵北平，四年渡江入南京，宫中火起，建文帝不知所终，朱棣即帝位。"},
  {id:"ming_tumubao", name:"土木堡之变", type:"battle", year:"明正统十四年",
   dynasties:["ming"], x:786, y:330,
   desc:"英宗从王振言亲征瓦剌，至土木堡大军溃，英宗被俘，从臣死者数十万，京师震动。"},
  {id:"ming_qiqiguang", name:"戚继光抗倭", type:"battle", year:"明嘉靖年间",
   dynasties:["ming"], x:992, y:520,
   desc:"戚继光募义乌兵练鸳鸯阵，台州九战九捷，与俞大猷合力荡平东南倭患，海疆复宁。"},
  {id:"ming_donglin", name:"东林党争", type:"politics", year:"明万历—天启",
   dynasties:["ming"], x:918, y:544,
   desc:"东林书院诸臣清议议政，与齐楚浙党及魏忠贤阉党相争。忠良榜示东林点将，惨死诏狱，明亡有由。"}
];

window.HistoryLayer = (function(){
  const SVGNS = "http://www.w3.org/2000/svg";
  const state = { visible:true, types:{battle:true, politics:true}, selId:null };

  function el(tag, attrs){
    const e = document.createElementNS(SVGNS, tag);
    for(const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;"); }

  /* 按当前朝代 + 图层开关 + 类型筛选过滤 */
  function visibleEvents(){
    if(!state.visible) return [];
    return window.HISTORY_EVENTS.filter(ev=>
      ev.dynasties.includes(currentDynasty) && state.types[ev.type]);
  }

  /* 唯一重绘入口 */
  function render(){
    const layer = document.getElementById("layerEvents");
    if(!layer) return;
    layer.innerHTML = "";
    visibleEvents().forEach(ev=>{
      const g = el("g",{class:"ev-dot", transform:`translate(${ev.x},${ev.y})`});
      if(ev.type==="battle"){
        g.appendChild(el("circle",{cx:0,cy:0,r:8,fill:"#a83c2a",stroke:"#f4ecd6","stroke-width":1.2}));
        const tx=el("text",{x:0,y:3.4,"text-anchor":"middle","font-size":9.5,fill:"#f7efda"});tx.textContent="战";g.appendChild(tx);
      }else{
        g.appendChild(el("rect",{x:-7,y:-7,width:14,height:14,rx:2.5,fill:"#5b4a8a",stroke:"#f4ecd6","stroke-width":1.2}));
        const tx=el("text",{x:0,y:3.4,"text-anchor":"middle","font-size":9.5,fill:"#f7efda"});tx.textContent="政";g.appendChild(tx);
      }
      if(state.selId===ev.id){
        g.appendChild(el("circle",{cx:0,cy:0,r:11,fill:"none",stroke:"#f2c14e","stroke-width":1.8}));
      }
      const lab = el("text",{x:12,y:-7,class:"ev-label",fill:"#3d2b1a"});
      lab.textContent = ev.name;
      g.appendChild(lab);
      g.addEventListener("click",(e)=>{e.stopPropagation(); showEvent(ev.id);});
      layer.appendChild(g);
    });
  }

  /* 点击事件 → 右侧面板详情 */
  function showEvent(id){
    state.selId = id;
    const ev = window.HISTORY_EVENTS.find(x=>x.id===id);
    const dynName = ({jin:"晋",han:"汉",tang:"唐",song:"宋",ming:"明"})[currentDynasty];
    const panel = document.getElementById("panel");
    panel.innerHTML = `
      <span class="badge ${ev.type==="battle"?"":"state"}" style="${ev.type==="politics"?"background:#5b4a8a":""}">
        ${ev.type==="battle"?"关键战役":"政治变动"}</span>
      <h2>${esc(ev.name)}</h2>
      <div class="field"><label>纪年</label><div class="geo-box">${esc(ev.year)} · ${dynName}</div></div>
      <div class="field"><label>事件经过</label><div class="story-box">${esc(ev.desc)}</div></div>
      <div class="readonly-tip">历史事件随上方「朝代」与图层筛选联动</div>`;
    render();
  }

  /* 浮动图层控件（地图右上角） */
  function buildControl(){
    const wrap = document.getElementById("mapWrap");
    if(!wrap || document.getElementById("eventCtl")) return;
    const box = document.createElement("div");
    box.id = "eventCtl";
    box.className = "event-ctl";
    box.innerHTML = `
      <label class="ev-switch"><input type="checkbox" id="evToggle" checked> 历史事件</label>
      <span class="ev-chip on" data-type="battle">⚔ 战役</span>
      <span class="ev-chip on" data-type="politics">⚑ 政治</span>`;
    wrap.appendChild(box);
    box.querySelector("#evToggle").addEventListener("change",(e)=>{
      state.visible = e.target.checked; render();
    });
    box.querySelectorAll(".ev-chip").forEach(c=>{
      c.addEventListener("click",()=>{
        const t = c.dataset.type;
        state.types[t] = !state.types[t];
        c.classList.toggle("on", state.types[t]);
        render();
      });
    });
  }

  function init(){ buildControl(); render(); }
  return { init, render, showEvent };
})();
