const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const money=n=>'$'+n.toFixed(2);
let cart=[];try{cart=JSON.parse(localStorage.getItem('donchepe-cart'))||[]}catch(e){}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function renderCart(){
  try{localStorage.setItem('donchepe-cart',JSON.stringify(cart))}catch(e){}
  $('#cart-count').textContent=cart.length;
  $('#cart-items').innerHTML=cart.length?cart.map((c,i)=>`<li><span>${c.n}</span><span>${money(c.p)} <button data-rm="${i}" aria-label="Quitar ${c.n}">✕</button></span></li>`).join(''):'<li>Tu pedido está vacío. Agrega platos desde el menú.</li>';
  $('#cart-total').textContent=money(cart.reduce((s,c)=>s+c.p,0));
}
document.addEventListener('click',e=>{
  const t=e.target;
  if(t.closest('.burger'))$('.main-nav').classList.toggle('open');
  if(t.closest('#cart-open'))$('#drawer').classList.add('open');
  if(t.closest('#cart-close'))$('#drawer').classList.remove('open');
  if(t.dataset.rm){cart.splice(+t.dataset.rm,1);renderCart()}
  if(t.classList.contains('add')){cart.push({n:t.dataset.n,p:+t.dataset.p});renderCart();toast(t.dataset.n+' agregado al pedido')}
  if(t.id==='checkout'){if(!cart.length)return toast('Agrega al menos un plato');cart=[];renderCart();$('#drawer').classList.remove('open');toast('¡Pedido simulado enviado! Gracias')}
  if(t.dataset.f){$$('.filters button').forEach(b=>b.classList.toggle('on',b===t));$$('.menu-card[data-c]').forEach(c=>c.hidden=t.dataset.f!=='todos'&&c.dataset.c!==t.dataset.f)}
});
$$('img').forEach(i=>i.addEventListener('error',()=>i.style.display='none'));
renderCart();
function handle(id,fn){const f=$(id);if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();const m=$('.msg',f);const r=fn(Object.fromEntries(new FormData(f)));m.className='msg '+(r.ok?'ok':'err');m.textContent=r.t;if(r.ok)f.reset()})}
handle('#form-reserva',d=>{
  if(new Date(d.fecha)<new Date(new Date().toDateString()))return{ok:false,t:'Elige una fecha de hoy en adelante.'};
  return{ok:true,t:`¡Reserva confirmada, ${d.nombre}! Mesa para ${d.personas} el ${d.fecha} a las ${d.hora}. Código: SYB-${Math.floor(1000+Math.random()*9000)}`}});
handle('#form-contacto',d=>({ok:true,t:`Gracias, ${d.nombre}. Recibimos tu mensaje y te responderemos pronto.`}));
handle('#form-login',d=>d.clave.length<6?{ok:false,t:'La contraseña debe tener al menos 6 caracteres.'}:{ok:true,t:'Sesión iniciada (simulado). ¡Bienvenido de vuelta!'});
const fe=$('#fecha');if(fe){fe.min=new Date().toISOString().split('T')[0]}
