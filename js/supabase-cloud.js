const SUPABASE_URL = "https://vemabatawupxxpemaxff.supabase.co";
/* 使用新版 publishable key（旧版 JWT anon key 在新项目 API 网关下已不被接受） */
const SUPABASE_ANON_KEY = "sb_publishable_lGrk-WMHORjKJmDV0uKkGw_L9jGGUae";
/* ================================================================
 * js/supabase-cloud.js
 * Supabase 云端保存 · 登录拦截 · 单人自用
 * ----------------------------------------------------------------
 * ⚠️ 重要备份提醒（请务必阅读）：
 *   云端服务（Supabase 免费/付费策略、网络可用性）可能随时调整或中断。
 *   请【定期】点击顶部「导出备份」，把画布 JSON 保存到本地磁盘，
 *   防止平台服务策略变更、误删或账号异常造成数据永久丢失。
 *   建议：每次重要修改后导出一次，每月至少留存一份本地 .json。
 * ================================================================ */
/* ====== ① 配置项（请在 Supabase 后台获取后填写） ====== */
/* 关闭注册：本应用不提供任何注册入口，账号须在 Supabase 后台手动创建：
   Authentication → Users → Add user（勾选确认邮箱）。                    */
const TABLE = "canvas_data";
let client = null;
let configured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
if(configured){
  try{
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth:{ persistSession:true, autoRefreshChannel:true }
    });
  }catch(e){ client=null; configured=false; }
}
/* ====== DOM ====== */
const gate   = document.getElementById("authGate");
const msgEl  = document.getElementById("authMsg");
const userChip = document.getElementById("userChip");
function showGate(){ gate.classList.remove("hidden"); }
function hideGate(){ gate.classList.add("hidden"); }
function setMsg(t, ok=false){ msgEl.textContent=t; msgEl.className="auth-msg"+(ok?" ok":""); }
if(!configured){
  setMsg("尚未配置 Supabase：请打开 js/supabase-cloud.js，填写 SUPABASE_URL 与 SUPABASE_ANON_KEY 后刷新。");
}
/* ====== ② 登录（仅登录，无注册） ====== */
document.getElementById("authForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  if(!configured){ setMsg("未配置 SUPABASE_URL / SUPABASE_ANON_KEY，无法登录。"); return; }
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const btn = document.getElementById("authSubmit");
  btn.disabled = true; setMsg("登录中…");
  const { error } = await client.auth.signInWithPassword({ email, password });
  btn.disabled = false;
  if(error){ setMsg("登录失败："+error.message); return; }
  /* 成功后由 onAuthStateChange 统一处理 */
});
/* ====== 认证状态：未登录一律拦截 ====== */
if(client){
  client.auth.getSession().then(({data})=>{
    if(data.session){ enterApp(data.session.user); } else { showGate(); }
  });
  client.auth.onAuthStateChange((_event, session)=>{
    if(session){ enterApp(session.user); } else { showGate(); }
  });
}else{
  showGate();
}
function enterApp(user){
  hideGate();
  if(userChip) userChip.innerHTML = `<span class="dot"></span>${escapeHtml(user.email||"已登录")}`;
}
function escapeHtml(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
/* ================================================================
 * ③ 云端保存 / 加载 / 清空 / 退出
 * 数据结构说明：
 *   本项目是「疆域地图」画布，完整画布 JSON 即 DATA
 *   （含 dynasty/subtitle/regions → 道·州府·县·风物·故事·特产 等）。
 *   云端以一个 jsonb 列整体存取该快照。
 * ================================================================ */
function flash(t, ok=true){
  const s=document.getElementById("saveState");
  if(s){ s.textContent=t; s.style.color = ok?"#2f6b3f":"#a83c2a"; }
}
/* 保存画布：本人仅维护一条记录，存在则更新，否则插入 */
async function saveCanvasToCloud(){
  if(!client){ alert("尚未配置/登录 Supabase。"); return; }
  const user = client.auth.getUser ? (await client.auth.getUser()).data.user : null;
  if(!user){ alert("登录已失效，请重新登录。"); showGate(); return; }
  // ⚠️ 云端之外，仍建议同时点「导出备份」留存本地 JSON。
  const snapshot = { savedAt:new Date().toISOString(), canvas: window.getCanvasData() };
  flash("正在保存到云端…");
  const { data:rows } = await client.from(TABLE)
      .select("id").eq("user_id", user.id).limit(1);
  let err;
  if(rows && rows.length){
    ({ error:err } = await client.from(TABLE)
      .update({ data:snapshot, updated_at:new Date().toISOString() })
      .eq("id", rows[0].id));
  }else{
    ({ error:err } = await client.from(TABLE)
      .insert([{ user_id:user.id, name:"我的疆域画布", data:snapshot }]));
  }
  if(err){ flash("保存失败："+err.message,false); alert("保存失败："+err.message); return; }
  flash("已保存到云端 "+new Date().toLocaleTimeString());
}
/* 加载画布：取本人最新一条 */
async function loadCanvasFromCloud(){
  if(!client){ alert("尚未配置/登录 Supabase。"); return; }
  flash("正在从云端加载…");
  const { data:rows, error } = await client.from(TABLE)
      .select("data,updated_at").order("updated_at",{ascending:false}).limit(1);
  if(error){ flash("加载失败："+error.message,false); alert("加载失败："+error.message); return; }
  if(!rows || !rows.length){ flash("云端暂无存档",false); alert("云端还没有保存过画布。"); return; }
  const snap = rows[0].data || {};
  const canvas = snap.canvas || snap;   // 兼容直接存 DATA 的情况
  if(!canvas || !canvas.regions){ alert("云端数据格式异常。"); return; }
  if(!confirm("加载云端画布将覆盖当前未保存的本地内容，是否继续？")){ flash("已取消加载"); return; }
  window.setCanvasData(canvas);
  flash("已加载云端画布 ("+new Date(rows[0].updated_at).toLocaleString()+")");
}
/* 清空画布：地图重置为空（内置模板可用「恢复默认」找回） */
function clearCanvas(){
  if(!confirm("确定清空当前画布吗？此操作会清除全部道/州/县与编辑内容。")) return;
  if(!confirm("再次确认：清空后可点「恢复默认」还原内置模板，确定要清空吗？")) return;
  window.clearCanvasData();
  flash("画布已清空（未上云，如需同步请再点保存）", false);
}
/* 退出登录 */
async function logout(){
  if(!confirm("确定退出登录吗？")) return;
  if(client){ await client.auth.signOut(); }
  showGate();
}
/* ====== 绑定顶部云端按钮 ====== */
document.getElementById("saveCloudBtn").addEventListener("click", saveCanvasToCloud);
document.getElementById("loadCloudBtn").addEventListener("click", loadCanvasFromCloud);
document.getElementById("clearBtn").addEventListener("click", clearCanvas);
document.getElementById("logoutBtn").addEventListener("click", logout);

/* ================================================================
 * ④ 数据库初始化 SQL（在 Supabase → SQL Editor 执行一次）
 * ----------------------------------------------------------------
 * -- 画布数据表（沿用 canvas_data）
 * create table if not exists canvas_data (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid not null references auth.users(id) default auth.uid(),
 *   name text not null default '我的疆域画布',
 *   data jsonb not null,
 *   created_at timestamptz not null default now(),
 *   updated_at timestamptz not null default now()
 * );
 *
 * -- 启用行级安全 RLS：只有登录用户能读写【自己】的数据
 * alter table canvas_data enable row level security;
 * create policy "select_own" on canvas_data for select using (auth.uid() = user_id);
 * create policy "insert_own" on canvas_data for insert with check (auth.uid() = user_id);
 * create policy "update_own" on canvas_data for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
 * create policy "delete_own" on canvas_data for delete using (auth.uid() = user_id);
 *
 * -- updated_at 自动维护（可选）
 * create or replace function touch_updated_at() returns trigger language plpgsql as $$
 * begin new.updated_at = now(); return new; end; $$;
 * drop trigger if exists trg_touch on canvas_data;
 * create trigger trg_touch before update on canvas_data
 *   for each row execute function touch_updated_at();
 * ================================================================ */
