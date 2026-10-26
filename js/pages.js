const page=document.body.dataset.page;shell();
if(page=="home"){const cats=[...new Set(P.map(p=>p.cat))];
$("#cats").innerHTML=cats.map(c=>`<a class="cat" href="shop.html?cat=${encodeURIComponent(c)}">${esc(c)}</a>`).join("");
render=()=>{$("#feat").innerHTML=[...P].sort((a,b)=>b.reviews-a.reviews).slice(0,4).map(card).join("")};render();
$("#hs").onsubmit=e=>{e.preventDefault();location.href="shop.html?q="+encodeURIComponent($("#hq").value)};
$("#aif").onsubmit=e=>{e.preventDefault();const r=recommend({budget:+$("#ab").value||999,cal:+$("#ac").value||9999,focus:$("#af").value});
$("#air").innerHTML=r.length?r.map(x=>`<div class="card" style="margin-bottom:12px"><div class="body"><b>${esc(x.p.name)} — ${rs(x.p.price)}</b><span class="muted">${esc(x.why)}</span><span class="muted">Protein ~${x.p.protein} g, fiber ~${x.p.fiber} g</span></div></div>`).join(""):'<p class="empty">No dishes match. Raise your budget or calorie limit.</p>'}}
if(page=="shop"){const u=new URLSearchParams(location.search);$("#q").value=u.get("q")||"";
const sel=(id,arr)=>{$(id).innerHTML+=arr.map(x=>`<option>${esc(x)}</option>`).join("")};sel("#cat",[...new Set(P.map(p=>p.cat))]);sel("#reg",[...new Set(P.map(p=>p.region))]);$("#cat").value=u.get("cat")||"";
render=()=>{let r=filter({q:$("#q").value,cat:$("#cat").value,region:$("#reg").value,max:+$("#mx").value,cal:+$("#cl").value,org:$("#og").checked,stock:$("#st").checked,rating:+$("#rt").value});
if(location.hash=="#fav")r=r.filter(p=>fav.includes(p.id));
const s=$("#so").value;r.sort((a,b)=>s=="p"?a.price-b.price:s=="r"?b.rating-a.rating:s=="n"?b.date.localeCompare(a.date):b.reviews-a.reviews);
$("#res").innerHTML=r.length?r.map(card).join(""):'<p class="empty">No foods match these filters. Try clearing them.</p>'};
$$(".bar input,.bar select").forEach(e=>e.oninput=render);$("#clr").onclick=()=>{$$(".bar input,.bar select").forEach(e=>e.type=="checkbox"?e.checked=false:e.value=e.id=="so"?"":"");render()};window.onhashchange=render;render()}
if(page=="product"){const p=P.find(x=>x.id==new URLSearchParams(location.search).get("id"));
render=()=>{$("#pd").innerHTML=p?`<div class="flex"><div class="col"><div class="ph card" style="background:${hue(p.id)};height:300px;font-size:6rem" aria-hidden="true">${esc(p.name[0])}</div></div>
<div class="col"><h1>${esc(p.name)}</h1><p class="muted">${esc(p.region)} · sold by ${esc(p.seller)}</p><p><span class="tag">Vegetarian</span>${p.organic?'<span class="tag org">Organic claim, certification not verified</span>':''}</p>
<p><b style="font-size:1.4rem">${rs(p.price)}</b> per serving</p><p><b>Ingredients:</b> ${p.ing.map(esc).join(", ")}</p>
<table><tr><th>Per serving (sample estimate)</th><th></th></tr><tr><td>Calories</td><td>~${p.cal} kcal</td></tr><tr><td>Protein</td><td>~${p.protein} g</td></tr><tr><td>Fiber</td><td>~${p.fiber} g</td></tr></table>
<p class="note">Sample data. Confirm allergens with the seller before ordering.</p>
<p><input id="qty" type="number" min="1" max="10" value="1" aria-label="Quantity" style="width:80px"> <button class="btn" onclick="addCart(${p.id},Math.max(1,+$('#qty').value||1))">Add to cart</button> <button class="btn alt" onclick="toggleFav(${p.id})">${fav.includes(p.id)?"♥ Saved":"♡ Save"}</button></p></div></div>
<h2 style="margin-top:40px">Related dishes</h2><div class="grid">${P.filter(x=>x.id!=p.id&&(x.region==p.region||x.cat==p.cat)).slice(0,4).map(card).join("")}</div>`:'<p class="empty">Dish not found. <a href="shop.html">Browse foods</a></p>'};render()}
if(page=="cart"){render=()=>{const ids=Object.keys(cart);if(!ids.length){$("#ct").innerHTML='<div class="empty"><h2>Your cart is empty</h2><a class="btn" href="shop.html">Continue shopping</a></div>';return}
const t=totals();$("#ct").innerHTML=`<table><tr><th>Dish</th><th>Qty</th><th>Subtotal</th><th></th></tr>${ids.map(id=>{const p=P.find(x=>x.id==id);return `<tr><td>${esc(p.name)}</td><td><input type="number" min="1" max="${p.stock}" value="${cart[id]}" style="width:70px" aria-label="Quantity for ${esc(p.name)}" onchange="cart[${id}]=Math.max(1,Math.min(${p.stock},+this.value||1));save('rns_cart',cart);count();render()"></td><td>${rs(p.price*cart[id])}</td><td><button class="btn sm alt" onclick="delete cart[${id}];save('rns_cart',cart);count();render()">Remove</button></td></tr>`}).join("")}</table>
<p>Subtotal ${rs(t.s)}<br>Delivery ${rs(t.fee)} (free from ₹500)<br>Discount −${rs(t.disc)} (5% from ₹800)<br><b>Payable ${rs(t.total)}</b></p><a class="btn alt" href="shop.html">Continue shopping</a> <a class="btn" href="checkout.html">Proceed to checkout</a>`};render()}
if(page=="checkout"){const t=totals();$("#sm").textContent=`Total payable: ${rs(t.total)} (delivery ${rs(t.fee)}, discount ${rs(t.disc)})`;
$("#cf").onsubmit=e=>{e.preventDefault();const f=e.target,er=[];if(!Object.keys(cart).length)er.push("Your cart is empty.");
if(!/^[6-9]\d{9}$/.test(f.phone.value))er.push("Enter a valid 10-digit Indian mobile number.");if(!/^\d{6}$/.test(f.pin.value))er.push("PIN code must be 6 digits.");
$("#er").innerHTML=er.map(x=>`<p role="alert" style="color:#a02020">${x}</p>`).join("");if(er.length)return;
const n="RNS-"+Date.now().toString(36).toUpperCase(),o=ls("rns_orders",[]);o.push({n,total:totals().total});save("rns_orders",o);cart={};save("rns_cart",cart);count();
$("#cf").outerHTML=`<div class="note"><h2>Demo order placed</h2><p>Order number <b>${n}</b>. No payment was taken and nothing will be delivered; this is a demonstration.</p><a class="btn" href="shop.html">Back to shop</a></div>`}}
