// ============================================================
// KONFIGURASI SUPABASE
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ftjqcowiwsfmznaemnny.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0anFjb3dpd3NmbXpuYWVtbm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MTk4MTYsImV4cCI6MjA5NTA5NTgxNn0.SLyZHn8dZ1LV5Er70GGYfg6A7Xv0-D9eUnCP_UZabZE';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// DATA PRODUK
// ============================================================
const PRODUCTS = [
  { id:1, category:'watch', brand:'Rolex', name:'Submariner Date', desc:'Jam selam ikonik dengan bezel keramik hitam dan kaca safir anti gores.', price:125000000, tag:'Bestseller', stars:'★★★★★', rating:4.9, img:'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80' },
  { id:2, category:'watch', brand:'Omega', name:'Seamaster 300M', desc:'Pilihan profesional dengan ketahanan air 300m dan helium escape valve.', price:85000000, tag:'NEW', stars:'★★★★★', rating:4.8, img:'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&q=80' },
  { id:3, category:'watch', brand:'Tag Heuer', name:'Carrera Chronograph', desc:'Kronograf Swiss dengan presisi tinggi untuk jiwa petualang modern.', price:48000000, tag:null, stars:'★★★★☆', rating:4.6, img:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80' },
  { id:4, category:'watch', brand:'Casio', name:'G-Shock GA-2100', desc:'Jam tangan tangguh struktur karbon tipis tahan guncangan dan air 200m.', price:1800000, tag:'Populer', stars:'★★★★★', rating:4.7, img: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80' },
  { id:5, category:'laptop', brand:'Apple', name:'MacBook Pro 14" M3 Pro', desc:'Performa luar biasa dengan chip M3 Pro, layar Liquid Retina XDR 120Hz.', price:32000000, tag:'NEW', stars:'★★★★★', rating:4.9, img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
  { id:6, category:'laptop', brand:'Dell', name:'XPS 15 OLED', desc:'Layar OLED 3.5K memukau dengan Intel Core i9 dan RTX 4060 dalam bodi tipis.', price:28500000, tag:'Bestseller', stars:'★★★★☆', rating:4.7, img:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
  { id:7, category:'laptop', brand:'ASUS', name:'ROG Zephyrus G16', desc:'Gaming laptop premium dengan RTX 4080, layar QHD 240Hz dan desain ultra-slim.', price:35000000, tag:'Gaming', stars:'★★★★★', rating:4.8, img:'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80' },
  { id:8, category:'laptop', brand:'Lenovo', name:'ThinkPad X1 Carbon', desc:'Ultrabook bisnis legendaris, hanya 1.12kg dengan baterai tahan 15 jam.', price:22000000, tag:null, stars:'★★★★☆', rating:4.6, img:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80' }
];

// ADMIN EMAIL — ganti dengan email admin kamu
const ADMIN_EMAIL = 'admin@techlux.id';

// ============================================================
// STATE
// ============================================================
let cart = [];
let orders = [];
let currentUser = null;
let isAdmin = false;

// ============================================================
// HELPER
// ============================================================
function fmt(n) { return 'Rp ' + n.toLocaleString('id-ID'); }
function genOrderId() { return 'TLX-' + Date.now().toString(36).toUpperCase(); }

function showLoading(msg = 'Memproses...') {
  document.getElementById('loading-overlay').style.display = 'flex';
  document.getElementById('loading-msg').textContent = msg;
}
function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}

// ============================================================
// AUTH — CEK SESSION
// ============================================================
async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    isAdmin = currentUser.email === ADMIN_EMAIL;
    updateNavAuth();
    if (isAdmin) showPage('admin');
    else showPage('shop');
  } else {
    showPage('login');
  }
}

function updateNavAuth() {
  const navLinks = document.getElementById('nav-links');
  const navRight = document.getElementById('nav-right');
  if (currentUser) {
    navLinks.style.display = 'flex';
    if (isAdmin) {
      navLinks.innerHTML = `
        <a onclick="showPage('admin')" id="nav-admin" class="active">Dashboard Admin</a>
      `;
      navRight.innerHTML = `
        <span style="color:var(--muted);font-size:13px">👑 ${currentUser.email}</span>
        <button class="cart-btn" style="background:transparent;border:1px solid rgba(201,168,76,.3);color:var(--gold)" onclick="logout()">Keluar</button>
      `;
    } else {
      navLinks.innerHTML = `
        <a onclick="showPage('shop')" id="nav-shop" class="active">Toko</a>
        <a onclick="showPage('about')" id="nav-about">Tentang Kami</a>
        <a onclick="showPage('history')" id="nav-history">Riwayat Pesanan</a>
        <a onclick="showPage('contact')" id="nav-contact">Kontak</a>
        <a href="pokemon.html" style="color:var(--gold);font-weight:600">🃏 PokéStore</a>
      `;
      navRight.innerHTML = `
        <span style="color:var(--muted);font-size:13px">👤 ${currentUser.email}</span>
        <button class="cart-btn" onclick="toggleCart()">🛒 Keranjang <span class="badge" id="cart-count">0</span></button>
        <button class="cart-btn" style="background:transparent;border:1px solid rgba(201,168,76,.3);color:var(--gold)" onclick="logout()">Keluar</button>
      `;
    }
  } else {
    navLinks.style.display = 'none';
    navRight.innerHTML = `
      <button class="cart-btn" onclick="showPage('login')">Masuk</button>
    `;
  }
}

// ============================================================
// LOGIN
// ============================================================
async function login() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const err   = document.getElementById('login-error');
  if (!email || !pass) { err.textContent = 'Email dan password wajib diisi!'; return; }
  err.textContent = '';
  showLoading('Masuk...');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  hideLoading();
  if (error) { err.textContent = 'Email atau password salah!'; return; }
  currentUser = data.user;
  isAdmin = currentUser.email === ADMIN_EMAIL;
  updateNavAuth();
  if (isAdmin) showPage('admin');
  else showPage('shop');
}

// ============================================================
// REGISTER
// ============================================================
async function register() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  const err   = document.getElementById('reg-error');
  if (!name || !email || !pass) { err.textContent = 'Semua kolom wajib diisi!'; return; }
  if (pass !== pass2) { err.textContent = 'Password tidak cocok!'; return; }
  if (pass.length < 6) { err.textContent = 'Password minimal 6 karakter!'; return; }
  err.textContent = '';
  showLoading('Mendaftar...');
  const { data, error } = await supabase.auth.signUp({
    email, password: pass,
    options: { data: { full_name: name } }
  });
  hideLoading();
  if (error) { err.textContent = error.message; return; }
  showToast('Pendaftaran berhasil! Silakan login.');
  showAuthTab('login');
  document.getElementById('login-email').value = email;
}

// ============================================================
// LOGOUT
// ============================================================
async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
  isAdmin = false;
  cart = [];
  updateNavAuth();
  showPage('login');
}

// ============================================================
// AUTH TAB SWITCHER
// ============================================================
function showAuthTab(tab) {
  document.getElementById('login-form').style.display  = tab === 'login'    ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
}

// ============================================================
// RENDER PRODUK
// ============================================================
function renderProducts(filter) {
  const grid = document.getElementById('product-grid');
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="openProductDetail(${p.id})">
      ${p.tag ? `<div class="product-tag ${p.tag==='NEW'?'new':''}">${p.tag}</div>` : ''}
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.background='#2a2a2a';this.src=''">
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="stars">${p.stars} <span style="color:var(--muted);font-size:11px">(${p.rating})</span></div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">${fmt(p.price)}</div>
          <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">+ Keranjang</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ============================================================
// CART
// ============================================================
function addToCart(id) {
  if (!currentUser) { showPage('login'); showToast('Login dulu untuk belanja!'); return; }
  const p = PRODUCTS.find(x => x.id === id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartCount();
  showToast(`${p.name} ditambahkan ke keranjang`);
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
  const body = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!cart.length) {
    body.innerHTML = `<div class="empty-cart"><div class="empty-icon">🛒</div><p>Keranjang masih kosong.</p></div>`;
    footer.innerHTML = ''; return;
  }
  body.innerHTML = cart.map(item => `
    <div class="cart-item" onclick="openProductDetail(${item.id})">
      <div class="cart-thumb">
        <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.brand}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="event.stopPropagation();changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="event.stopPropagation();changeQty(${item.id},1)">+</button>
          <span class="cart-item-price">${fmt(item.price * item.qty)}</span>
          <button class="remove-item" onclick="event.stopPropagation();removeFromCart(${item.id})">🗑</button>
        </div>
      </div>
    </div>
  `).join('');
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  footer.innerHTML = `
    <div class="total-row"><span class="total-label">Subtotal</span><span style="font-size:14px;font-weight:500">${fmt(sub)}</span></div>
    <div class="total-row"><span class="total-label">Ongkos Kirim</span><span style="font-size:14px;color:var(--muted)">${fmt(50000)}</span></div>
    <div class="total-row" style="border-top:1px solid rgba(255,255,255,.07);padding-top:.75rem;margin-top:.25rem">
      <span class="total-label" style="font-size:15px;color:var(--white)">Total</span>
      <span class="total-value">${fmt(sub+50000)}</span>
    </div>
    <button class="checkout-btn" onclick="openCheckout()">Lanjut ke Pemesanan →</button>
  `;
}

function changeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCartCount(); renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartCount(); renderCart();
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('overlay');
  renderCart();
  panel.classList.toggle('open');
  overlay.classList.toggle('show');
}

function closeAll() {
  document.getElementById('cart-panel').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ============================================================
// CHECKOUT
// ============================================================
function openCheckout() {
  if (!cart.length) return;
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  // Prefill nama & email dari akun
  if (currentUser) {
    const name = currentUser.user_metadata?.full_name || '';
    document.getElementById('cust-name').value = name;
    document.getElementById('cust-email').value = currentUser.email;
  }
  document.getElementById('checkout-summary').innerHTML = `
    <div class="order-summary-title">Ringkasan Pesanan</div>
    ${cart.map(i => `<div class="summary-item"><span>${i.brand} ${i.name} ×${i.qty}</span><span>${fmt(i.price*i.qty)}</span></div>`).join('')}
    <div class="summary-total"><span>Total Pembayaran</span><span>${fmt(sub+50000)}</span></div>
  `;
  closeAll();
  document.getElementById('checkout-modal').classList.add('show');
}

async function placeOrder() {
  const name     = document.getElementById('cust-name').value.trim();
  const phone    = document.getElementById('cust-phone').value.trim();
  const email    = document.getElementById('cust-email').value.trim();
  const address  = document.getElementById('cust-address').value.trim();
  const payment  = document.getElementById('payment-method').value;
  const shipping = document.getElementById('shipping-method').value;
  const note     = document.getElementById('order-note').value;
  if (!name || !phone || !address || !payment) { showToast('Lengkapi semua data yang wajib diisi!'); return; }

  const orderId = genOrderId();
  const sub     = cart.reduce((s, i) => s + i.price * i.qty, 0);
  showLoading('Menyimpan pesanan...');

  try {
    const { error: orderError } = await supabase.from('orders').insert([{
      id: orderId,
      user_id: currentUser.id,
      customer_name: name, customer_phone: phone,
      customer_email: email || null, customer_address: address,
      payment_method: payment, shipping_method: shipping,
      subtotal: sub, total: sub + 50000,
      status: 'Diproses', note: note || null
    }]);
    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from('order_items').insert(
      cart.map(item => ({
        order_id: orderId, product_id: item.id,
        product_name: item.name, brand: item.brand,
        price: item.price, qty: item.qty, image_url: item.img
      }))
    );
    if (itemsError) throw itemsError;

    cart = []; updateCartCount();
    hideLoading();
    closeModal('checkout-modal');
    document.getElementById('success-order-id').textContent = 'ID Pesanan: ' + orderId;
    document.getElementById('success-modal').classList.add('show');
    ['cust-name','cust-phone','cust-email','cust-address','order-note'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('payment-method').selectedIndex = 0;
  } catch (err) {
    hideLoading();
    console.error(err);
    showToast('Gagal menyimpan pesanan. ' + err.message);
  }
}

// ============================================================
// RIWAYAT PESANAN (hanya milik user yg login)
// ============================================================
async function renderHistory() {
  const cont = document.getElementById('history-content');
  cont.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--muted)">⏳ Memuat riwayat...</div>`;
  try {
    const { data, error } = await supabase
      .from('orders').select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    orders = data || [];
    if (!orders.length) {
      cont.innerHTML = `
        <div style="text-align:center;padding:4rem 1rem;color:var(--muted)">
          <div style="font-size:48px;margin-bottom:1rem">📋</div>
          <p>Belum ada riwayat transaksi.</p>
          <button class="btn-primary" style="margin-top:1.5rem" onclick="showPage('shop')">Belanja Sekarang</button>
        </div>`;
      return;
    }
    const sc = { 'Diproses':'processing','Dikirim':'shipped','Terkirim':'delivered','Dibatalkan':'cancelled' };
    cont.innerHTML = `
      <div style="overflow-x:auto">
        <table class="history-table">
          <thead><tr><th>ID Pesanan</th><th>Tanggal</th><th>Nama</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            ${orders.map(o => `
              <tr onclick="viewOrderDetail('${o.id}')">
                <td><span class="order-id">${o.id}</span></td>
                <td style="color:var(--muted);font-size:13px">${new Date(o.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'})}</td>
                <td style="font-size:13px">${o.customer_name}</td>
                <td style="color:var(--gold);font-weight:600">${fmt(o.total)}</td>
                <td><span class="status-badge status-${sc[o.status]||'processing'}">${o.status}</span></td>
                <td><button class="view-detail-btn" onclick="event.stopPropagation();viewOrderDetail('${o.id}')">Detail</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } catch (err) {
    cont.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--muted)"><p>⚠️ Gagal memuat data. ${err.message}</p></div>`;
  }
}

// ============================================================
// DASHBOARD ADMIN
// ============================================================
async function renderAdmin() {
  const cont = document.getElementById('admin-content');
  cont.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--muted)">⏳ Memuat semua pesanan...</div>`;
  try {
    const { data, error } = await supabase
      .from('orders').select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    orders = data || [];

    // Stats
    const total = orders.length;
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const diproses = orders.filter(o => o.status === 'Diproses').length;
    const terkirim = orders.filter(o => o.status === 'Terkirim').length;

    const sc = { 'Diproses':'processing','Dikirim':'shipped','Terkirim':'delivered','Dibatalkan':'cancelled' };
    cont.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:2rem">
        ${[
          ['📦', 'Total Pesanan', total],
          ['💰', 'Total Revenue', fmt(revenue)],
          ['⏳', 'Diproses', diproses],
          ['✅', 'Terkirim', terkirim]
        ].map(([icon, label, val]) => `
          <div style="background:var(--dark2);border:1px solid rgba(201,168,76,.15);border-radius:12px;padding:1.25rem">
            <div style="font-size:28px;margin-bottom:.5rem">${icon}</div>
            <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:.25rem">${label}</div>
            <div style="font-size:22px;font-weight:600;color:var(--gold)">${val}</div>
          </div>`).join('')}
      </div>
      ${!orders.length ? '<p style="color:var(--muted);text-align:center;padding:2rem">Belum ada pesanan masuk.</p>' : `
      <div style="overflow-x:auto">
        <table class="history-table">
          <thead><tr><th>ID Pesanan</th><th>Tanggal</th><th>Pembeli</th><th>Total</th><th>Status</th><th>Ubah Status</th></tr></thead>
          <tbody>
            ${orders.map(o => `
              <tr onclick="viewOrderDetail('${o.id}')">
                <td><span class="order-id">${o.id}</span></td>
                <td style="color:var(--muted);font-size:13px">${new Date(o.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'})}</td>
                <td style="font-size:13px">${o.customer_name}<br><span style="color:var(--muted);font-size:11px">${o.customer_phone}</span></td>
                <td style="color:var(--gold);font-weight:600">${fmt(o.total)}</td>
                <td><span class="status-badge status-${sc[o.status]||'processing'}">${o.status}</span></td>
                <td onclick="event.stopPropagation()">
                  <select onchange="updateStatus('${o.id}',this.value)"
                    style="background:var(--dark3);border:1px solid rgba(255,255,255,.1);color:var(--white);padding:5px 8px;border-radius:4px;font-size:12px;cursor:pointer">
                    ${['Diproses','Dikirim','Terkirim','Dibatalkan'].map(s =>
                      `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`
                    ).join('')}
                  </select>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`}
    `;
  } catch (err) {
    cont.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--muted)"><p>⚠️ ${err.message}</p></div>`;
  }
}

async function updateStatus(orderId, newStatus) {
  showLoading('Memperbarui status...');
  const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  hideLoading();
  if (error) { showToast('Gagal update status!'); return; }
  showToast(`Status diperbarui: ${newStatus}`);
  renderAdmin();
}

// ============================================================
// DETAIL PESANAN
// ============================================================
async function viewOrderDetail(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  showLoading('Memuat detail...');
  try {
    const { data: items, error } = await supabase.from('order_items').select('*').eq('order_id', id);
    if (error) throw error;
    hideLoading();
    const sc = { 'Diproses':'processing','Dikirim':'shipped','Terkirim':'delivered','Dibatalkan':'cancelled' };
    document.getElementById('detail-modal-content').innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
        <h3 style="font-family:'Playfair Display',serif;font-size:20px;margin:0">Detail Pesanan</h3>
        <button class="close-btn" onclick="closeModal('detail-modal')">✕</button>
      </div>
      <div style="background:var(--dark3);border-radius:8px;padding:1rem;margin-bottom:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
          <span style="color:var(--gold);font-weight:600">${o.id}</span>
          <span class="status-badge status-${sc[o.status]||'processing'}">${o.status}</span>
        </div>
        <div class="detail-row"><span class="label">Tanggal</span><span class="val">${new Date(o.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'})}</span></div>
        <div class="detail-row"><span class="label">Metode Bayar</span><span class="val">${o.payment_method}</span></div>
        <div class="detail-row"><span class="label">Ekspedisi</span><span class="val">${o.shipping_method}</span></div>
      </div>
      <div style="margin-bottom:1.25rem">
        <div style="font-size:12px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:.75rem">Produk Dipesan</div>
        ${(items||[]).map(item => `
          <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid rgba(255,255,255,.05)">
            <div style="width:56px;height:56px;border-radius:8px;overflow:hidden;flex-shrink:0">
              <img src="${item.image_url}" alt="${item.product_name}" style="width:100%;height:100%;object-fit:cover">
            </div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:500">${item.brand} ${item.product_name}</div>
              <div style="font-size:12px;color:var(--muted)">Qty: ${item.qty} × ${fmt(item.price)}</div>
            </div>
            <div style="color:var(--gold);font-weight:600;font-size:13px">${fmt(item.price*item.qty)}</div>
          </div>`).join('')}
      </div>
      <div style="background:var(--dark3);border-radius:8px;padding:1rem;margin-bottom:1.25rem">
        <div style="font-size:12px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:.75rem">Info Pengiriman</div>
        <div class="detail-row"><span class="label">Nama</span><span class="val">${o.customer_name}</span></div>
        <div class="detail-row"><span class="label">Telepon</span><span class="val">${o.customer_phone}</span></div>
        ${o.customer_email?`<div class="detail-row"><span class="label">Email</span><span class="val">${o.customer_email}</span></div>`:''}
        <div class="detail-row" style="border:none"><span class="label">Alamat</span><span class="val" style="max-width:60%;text-align:right;font-size:12px">${o.customer_address}</span></div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,.07);padding-top:1rem">
        <div class="detail-row"><span class="label">Subtotal</span><span>${fmt(o.subtotal)}</span></div>
        <div class="detail-row"><span class="label">Ongkos Kirim</span><span>${fmt(50000)}</span></div>
        <div class="detail-row" style="font-size:16px;font-weight:600">
          <span style="color:var(--white)">Total</span><span style="color:var(--gold)">${fmt(o.total)}</span>
        </div>
      </div>
      ${o.note?`<div style="margin-top:1rem;padding:.75rem;background:var(--dark3);border-radius:8px;font-size:13px;color:var(--muted)"><span style="color:var(--white)">Catatan: </span>${o.note}</div>`:''}
    `;
    document.getElementById('detail-modal').classList.add('show');
  } catch (err) {
    hideLoading();
    showToast('Gagal memuat detail.');
  }
}

// ============================================================
// DETAIL PRODUK
// ============================================================
function openProductDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  document.getElementById('detail-modal-content').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
      <h3 style="font-family:'Playfair Display',serif;font-size:20px;margin:0">Detail Produk</h3>
      <button class="close-btn" onclick="closeModal('detail-modal')">✕</button>
    </div>
    <div style="border-radius:12px;overflow:hidden;margin-bottom:1.25rem;background:var(--dark3);height:260px">
      <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">
    </div>
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:.75rem">
      <div>
        <div style="font-size:11px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;margin-bottom:.3rem">${p.brand}</div>
        <h4 style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:.3rem">${p.name}</h4>
        <div class="stars">${p.stars} <span style="color:var(--muted);font-size:12px">${p.rating}/5</span></div>
      </div>
      ${p.tag?`<div class="product-tag ${p.tag==='NEW'?'new':''}">${p.tag}</div>`:''}
    </div>
    <p style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:1.5rem">${p.desc}</p>
    <div class="detail-row"><span class="label">Kategori</span><span class="val">${p.category==='watch'?'⌚ Jam Tangan':'💻 Laptop'}</span></div>
    <div class="detail-row" style="border:none;margin-bottom:1.5rem">
      <span class="label">Harga</span>
      <span style="font-size:22px;color:var(--gold);font-weight:700">${fmt(p.price)}</span>
    </div>
    <button class="btn-primary" style="width:100%;padding:14px;font-size:15px"
      onclick="addToCart(${p.id});closeModal('detail-modal')">+ Tambah ke Keranjang</button>
  `;
  document.getElementById('detail-modal').classList.add('show');
}

// ============================================================
// MODAL & HALAMAN
// ============================================================
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + name);
  if (navEl) navEl.classList.add('active');
  if (name === 'history') renderHistory();
  if (name === 'admin') renderAdmin();
  window.scrollTo(0, 0);
}

function scrollTop() { showPage(isAdmin ? 'admin' : currentUser ? 'shop' : 'login'); }

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ============================================================
// KONTAK
// ============================================================
function sendContact() {
  const name = document.getElementById('contact-name').value.trim();
  const msg  = document.getElementById('contact-message').value.trim();
  if (!name || !msg) { showToast('Lengkapi nama dan pesan!'); return; }
  showToast('Pesan berhasil dikirim!');
  ['contact-name','contact-email','contact-subject','contact-message'].forEach(id => document.getElementById(id).value = '');
}

// ============================================================
// EXPOSE KE WINDOW
// ============================================================
Object.assign(window, {
  login, register, logout, showAuthTab,
  renderProducts, filterProducts,
  addToCart, toggleCart, closeAll, changeQty, removeFromCart,
  openCheckout, placeOrder,
  openProductDetail, closeModal, showPage, scrollTop,
  viewOrderDetail, updateStatus, sendContact
});

// ============================================================
// INIT
// ============================================================
initAuth();