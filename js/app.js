/* Aahar RNS demo frontend. All product data below is SAMPLE DATA. */
const P=[
["Pesarattu with Ginger Chutney","Andhra Traditional Foods","Andhra Pradesh",120,260,"Amma's Kitchen (sample)",4.6,128,0,["green gram","rice","ginger","green chilli"],14,9,"2025-05-01"],
["Jonna Rotte Meal","Telangana Heritage Foods","Telangana",150,310,"Savitri Home Foods (sample)",4.5,86,0,["jowar flour","peanut chutney","brinjal curry"],11,9,"2025-06-10"],
["Ragi Mudde with Sambar","Millet-Based Foods","Karnataka",110,330,"Halli Ruchi (sample)",4.4,64,0,["finger millet","toor dal","vegetables"],12,11,"2025-04-02"],
["Idli Sambar Set","South Indian Breakfast","Tamil Nadu",90,280,"Kaveri Tiffins (sample)",4.7,310,0,["rice","urad dal","toor dal"],10,5,"2025-03-12"],
["Pulihora (Tamarind Rice)","Traditional Rice Dishes","Andhra Pradesh",100,350,"Amma's Kitchen (sample)",4.3,97,0,["rice","tamarind","peanuts","curry leaves"],7,6,"2025-02-20"],
["Millet Khichdi Bowl","Millet-Based Foods","Maharashtra",130,300,"Sahyadri Organics (sample)",4.5,58,1,["foxtail millet","moong dal","vegetables"],12,9,"2025-07-18"],
["Organic Seasonal Veg Box (1 kg)","Organic Vegetables and Produce","Telangana",220,200,"Green Acre Farm (sample)",4.2,41,1,["mixed vegetables"],6,8,"2025-08-01"],
["Sarva Pindi","Traditional Snacks","Telangana",80,380,"Savitri Home Foods (sample)",4.4,73,0,["rice flour","chana dal","sesame","ajwain"],8,7,"2025-01-15"],
["Ragi Laddu (4 pcs)","Healthy Sweets","Karnataka",140,340,"Halli Ruchi (sample)",4.6,110,0,["ragi","jaggery","ghee","nuts"],6,10,"2025-06-30"],
["Ariselu","Regional Festival Foods","Andhra Pradesh",160,290,"Amma's Kitchen (sample)",4.5,52,0,["rice flour","jaggery","sesame","ghee"],3,6,"2025-09-01"],
["Homestyle Thali","Homemade Vegetarian Meals","Telangana",180,520,"Savitri Home Foods (sample)",4.8,204,0,["rice","dal","roti","two curries","curd"],18,12,"2025-05-25"],
["Bisi Bele Bath","Traditional Rice Dishes","Karnataka",130,410,"Halli Ruchi (sample)",4.3,69,0,["rice","toor dal","vegetables","tamarind"],13,8,"2025-04-22"]
].map((a,i)=>({id:i+1,name:a[0],cat:a[1],region:a[2],price:a[3],cal:a[4],seller:a[5],rating:a[6],reviews:a[7],organic:!!a[8],ing:a[9],protein:a[10],fiber:a[11],date:a[12],stock:i==8?0:20}));
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const rs=n=>"₹"+n;
let cart=ls("rns_cart",{}),fav=ls("rns_fav",[]),render=null;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1800)}
function addCart(id,q=1){const p=P.find(x=>x.id==id);if(!p||p.stock<1)return toast("Currently unavailable");cart[id]=Math.min((cart[id]||0)+q,p.stock);save("rns_cart",cart);count();toast("Added to cart")}
function toggleFav(id){fav=fav.includes(id)?fav.filter(x=>x!=id):[...fav,id];save("rns_fav",fav);count();toast("Favorites updated");if(render)render()}
function count(){$("#cc").textContent=Object.values(cart).reduce((a,b)=>a+b,0);$("#fc").textContent=fav.length}
const hue=id=>["#6D9B58","#C87546","#234B35","#B5883E","#7a5c3a","#4f7a5a"][id%6];
function card(p){return `<article class="card"><div class="ph" style="background:${hue(p.id)}" aria-hidden="true">${esc(p.name[0])}</div><div class="body">
<div><span class="tag">Vegetarian</span>${p.organic?'<span class="tag org">Organic claim (unverified)</span>':''}</div>
<h3 style="font-size:1.15rem;margin:0">${esc(p.name)}</h3><div class="muted">${esc(p.region)} · ${esc(p.seller)}</div>
<div class="muted">~${p.cal} kcal/serving · ★ ${p.rating} (${p.reviews})</div>
<div><b>${rs(p.price)}</b> <span class="muted">${p.stock?"In stock":"Sold out"}</span></div>
<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:auto"><button class="btn sm" onclick="addCart(${p.id})">Add to cart</button>
<button class="btn sm alt" onclick="toggleFav(${p.id})">${fav.includes(p.id)?"♥ Saved":"♡ Save"}</button>
<a class="btn sm alt" href="product.html?id=${p.id}">Details</a></div></div></article>`}
function filter(o){const q=(o.q||"").toLowerCase();return P.filter(p=>
(!q||[p.name,p.region,p.cat,p.ing.join(" ")].join(" ").toLowerCase().includes(q))&&(!o.cat||p.cat==o.cat)&&(!o.region||p.region==o.region)&&
(!o.max||p.price<=o.max)&&(!o.cal||p.cal<=o.cal)&&(!o.org||p.organic)&&(!o.stock||p.stock>0)&&(!o.rating||p.rating>=o.rating))}
/* Rule-based recommender. To use a real AI, call your backend /api/recommendations from here; never put API keys in frontend code. */
function recommend({budget=999,cal=9999,focus="any"}){return P.filter(p=>p.price<=budget&&p.cal<=cal&&p.stock>0)
.sort((a,b)=>focus=="protein"?b.protein-a.protein:focus=="fiber"?b.fiber-a.fiber:a.cal-b.cal).slice(0,4)
.map(p=>({p,why:`Fits your ${rs(budget)} budget and ${cal} kcal limit${focus!="any"?"; ranked by "+focus:""}. Sample estimates, not medically verified.`}))}
function totals(){let s=0;for(const[id,q]of Object.entries(cart)){const p=P.find(x=>x.id==id);if(p)s+=p.price*q}
const fee=s&&s<500?40:0,disc=s>=800?Math.round(s*.05):0;return{s,fee,disc,total:s+fee-disc}}
function shell(){$("#hd").innerHTML=`<div class="wrap"><a class="logo" href="index.html"><img src="sources/Logo.png" alt="Aahar RNS logo" onerror="this.replaceWith(document.createTextNode('Aahar RNS'))"></a><nav aria-label="Main">
<a href="index.html">Home</a><a href="shop.html">Explore Foods</a><a href="index.html#ai">AI Nutrition Guide</a><a href="index.html#heritage">How it works</a></nav>
<a href="shop.html#fav">♥ <span class="badge" id="fc">0</span></a><a href="cart.html">Cart <span class="badge" id="cc">0</span></a></div>`;
$("#ft").innerHTML=`<div class="wrap flex"><div class="col"><b>Aahar RNS</b><p>Traditional vegetarian food from home cooks and small producers. Demo site with sample data only.</p></div>
<div class="col"><a href="shop.html">Shop</a><a href="cart.html">Cart</a><a href="checkout.html">Checkout (demo)</a></div></div><div class="wrap">© Aahar RNS demo. No real orders or payments.</div>`;count()}
