// ===========================
// DATA PRODUK
// ===========================
const PRODUCTS = [
  {
    id: 1, category: 'watch', brand: 'Rolex', name: 'Submariner Date',
    desc: 'Jam selam ikonik dengan bezel keramik hitam dan kaca safir anti gores.',
    price: 125000000, tag: 'Bestseller', stars: '★★★★★', rating: 4.9,
    img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80'
  },
  {
    id: 2, category: 'watch', brand: 'Omega', name: 'Seamaster 300M',
    desc: 'Pilihan profesional dengan ketahanan air 300m dan helium escape valve.',
    price: 85000000, tag: 'NEW', stars: '★★★★★', rating: 4.8,
    img: 'https://images.unsplash.com/photo-1639699007849-a2d4e2cbfe90?w=600&q=80'
  },
  {
    id: 3, category: 'watch', brand: 'Tag Heuer', name: 'Carrera Chronograph',
    desc: 'Kronograf Swiss dengan presisi tinggi untuk jiwa petualang modern.',
    price: 48000000, tag: null, stars: '★★★★☆', rating: 4.6,
    img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80'
  },
  {
    id: 4, category: 'watch', brand: 'Casio', name: 'G-Shock GA-2100',
    desc: 'Jam tangan tangguh struktur karbon tipis tahan guncangan dan air 200m.',
    price: 1800000, tag: 'Populer', stars: '★★★★★', rating: 4.7,
    img: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80'
  },
  {
    id: 5, category: 'laptop', brand: 'Apple', name: 'MacBook Pro 14" M3 Pro',
    desc: 'Performa luar biasa dengan chip M3 Pro, layar Liquid Retina XDR 120Hz.',
    price: 32000000, tag: 'NEW', stars: '★★★★★', rating: 4.9,
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80'
  },
  {
    id: 6, category: 'laptop', brand: 'Dell', name: 'XPS 15 OLED',
    desc: 'Layar OLED 3.5K memukau dengan Intel Core i9 dan RTX 4060 dalam bodi tipis.',
    price: 28500000, tag: 'Bestseller', stars: '★★★★☆', rating: 4.7,
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80'
  },
  {
    id: 7, category: 'laptop', brand: 'ASUS', name: 'ROG Zephyrus G16',
    desc: 'Gaming laptop premium dengan RTX 4080, layar QHD 240Hz dan desain ultra-slim.',
    price: 35000000, tag: 'Gaming', stars: '★★★★★', rating: 4.8,
    img: 'https://images.unsplash.com/photo-1616084903985-1a00f7cce9b8?w=600&q=80'
  },
  {
    id: 8, category: 'laptop', brand: 'Lenovo', name: 'ThinkPad X1 Carbon',
    desc: 'Ultrabook bisnis legendaris, hanya 1.12kg dengan baterai tahan 15 jam.',
    price: 22000000, tag: null, stars: '★★★★☆', rating: 4.6,
    img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80'
  }
];

// ===========================
// STATE
// ===========================
let cart = [];
let orders = JSON.parse(localStorage.getItem('techlux_orders') || '[]');

// ===========================
// HELPER
// ===========================
function fmt(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function genOrderId() {
  return 'TLX-' + Date.now().toString(36).toUpperCase();
}

// ===========================
// RENDER PRODUK
// ===========================
function renderProducts(filter) {
  const grid = document.getElementById('product-grid');
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="openProductDetail(${p.id})">
      ${p.tag ? `<div class="product-tag ${p.tag === 'NEW' ? 'new' : ''}">${p.tag}</div>` : ''}
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

// ===========================
// CART
// ===========================
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartCount();
  showToast(`${p.name} ditambahkan ke keranjang`);
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
  const body = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!cart.length) {
    body.innerHTML = `<div class="empty-cart"><div class="empty-icon">🛒</div><p>Keranjang masih kosong.</p></div>`;
    footer.innerHTML = '';
    return;
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
      <span class="total-value">${fmt(sub + 50000)}</span>
    </div>
    <button class="checkout-btn" onclick="openCheckout()">Lanjut ke Pemesanan →</button>
  `;
}

function changeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartCount();
  renderCart();
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

// ===========================
// CHECKOUT
// ===========================
function openCheckout() {
  if (!cart.length) return;
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('checkout-summary').innerHTML = `
    <div class="order-summary-title">Ringkasan Pesanan</div>
    ${cart.map(i => `<div class="summary-item"><span>${i.brand} ${i.name} ×${i.qty}</span><span>${fmt(i.price * i.qty)}</span></div>`).join('')}
    <div class="summary-total"><span>Total Pembayaran</span><span>${fmt(sub + 50000)}</span></div>
  `;
  closeAll();
  document.getElementById('checkout-modal').classList.add('show');
}

function placeOrder() {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const email = document.getElementById('cust-email').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const payment = document.getElementById('payment-method').value;
  const shipping = document.getElementById('shipping-method').value;

  if (!name || !phone || !address || !payment) {
    showToast('Lengkapi semua data yang wajib diisi!');
    return;
  }

  const orderId = genOrderId();
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    items: [...cart],
    customer: { name, phone, email, address },
    payment, shipping,
    subtotal: sub,
    total: sub + 50000,
    status: 'Diproses',
    note: document.getElementById('order-note').value
  };

  orders.unshift(order);
  localStorage.setItem('techlux_orders', JSON.stringify(orders));
  cart = [];
  updateCartCount();
  closeModal('checkout-modal');
  document.getElementById('success-order-id').textContent = 'ID Pesanan: ' + orderId;
  document.getElementById('success-modal').classList.add('show');
  ['cust-name', 'cust-phone', 'cust-email', 'cust-address', 'order-note'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('payment-method').selectedIndex = 0;
}

// ===========================
// RIWAYAT PESANAN
// ===========================
function renderHistory() {
  const cont = document.getElementById('history-content');
  if (!orders.length) {
    cont.innerHTML = `
      <div style="text-align:center;padding:4rem 1rem;color:var(--muted)">
        <div style="font-size:48px;margin-bottom:1rem">📋</div>
        <p>Belum ada riwayat transaksi.</p>
        <button class="btn-primary" style="margin-top:1.5rem" onclick="showPage('shop')">Belanja Sekarang</button>
      </div>`;
    return;
  }
  const sc = { 'Diproses': 'processing', 'Dikirim': 'shipped', 'Terkirim': 'delivered', 'Dibatalkan': 'cancelled' };
  cont.innerHTML = `
    <div style="overflow-x:auto">
      <table class="history-table">
        <thead>
          <tr>
            <th>ID Pesanan</th><th>Tanggal</th><th>Produk</th>
            <th>Total</th><th>Status</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr onclick="viewOrderDetail('${o.id}')">
              <td><span class="order-id">${o.id}</span></td>
              <td style="color:var(--muted);font-size:13px">${o.date}</td>
              <td style="font-size:13px">${o.items.map(i => i.brand + ' ' + i.name).join(', ')}</td>
              <td style="color:var(--gold);font-weight:600">${fmt(o.total)}</td>
              <td><span class="status-badge status-${sc[o.status] || 'processing'}">${o.status}</span></td>
              <td><button class="view-detail-btn" onclick="event.stopPropagation();viewOrderDetail('${o.id}')">Detail</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

// ===========================
// DETAIL PESANAN
// ===========================
function viewOrderDetail(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const sc = { 'Diproses': 'processing', 'Dikirim': 'shipped', 'Terkirim': 'delivered', 'Dibatalkan': 'cancelled' };
  const cont = document.getElementById('detail-modal-content');
  cont.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
      <h3 style="font-family:'Playfair Display',serif;font-size:20px;margin:0">Detail Pesanan</h3>
      <button class="close-btn" onclick="closeModal('detail-modal')">✕</button>
    </div>
    <div style="background:var(--dark3);border-radius:8px;padding:1rem;margin-bottom:1.25rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
        <span style="color:var(--gold);font-weight:600">${o.id}</span>
        <span class="status-badge status-${sc[o.status] || 'processing'}">${o.status}</span>
      </div>
      <div class="detail-row"><span class="label">Tanggal</span><span class="val">${o.date}</span></div>
      <div class="detail-row"><span class="label">Metode Bayar</span><span class="val">${o.payment}</span></div>
      <div class="detail-row"><span class="label">Ekspedisi</span><span class="val">${o.shipping}</span></div>
    </div>
    <div style="margin-bottom:1.25rem">
      <div style="font-size:12px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:.75rem">Produk Dipesan</div>
      ${o.items.map(item => `
        <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid rgba(255,255,255,.05)">
          <div style="width:56px;height:56px;border-radius:8px;overflow:hidden;flex-shrink:0">
            <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover">
          </div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:500">${item.brand} ${item.name}</div>
            <div style="font-size:12px;color:var(--muted)">Qty: ${item.qty} × ${fmt(item.price)}</div>
          </div>
          <div style="color:var(--gold);font-weight:600;font-size:13px">${fmt(item.price * item.qty)}</div>
        </div>
      `).join('')}
    </div>
    <div style="background:var(--dark3);border-radius:8px;padding:1rem;margin-bottom:1.25rem">
      <div style="font-size:12px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:.75rem">Info Pengiriman</div>
      <div class="detail-row"><span class="label">Nama</span><span class="val">${o.customer.name}</span></div>
      <div class="detail-row"><span class="label">Telepon</span><span class="val">${o.customer.phone}</span></div>
      ${o.customer.email ? `<div class="detail-row"><span class="label">Email</span><span class="val">${o.customer.email}</span></div>` : ''}
      <div class="detail-row" style="border:none"><span class="label">Alamat</span><span class="val" style="max-width:60%;text-align:right;font-size:12px">${o.customer.address}</span></div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.07);padding-top:1rem">
      <div class="detail-row"><span class="label">Subtotal</span><span>${fmt(o.subtotal)}</span></div>
      <div class="detail-row"><span class="label">Ongkos Kirim</span><span>${fmt(50000)}</span></div>
      <div class="detail-row" style="font-size:16px;font-weight:600">
        <span style="color:var(--white)">Total</span>
        <span style="color:var(--gold)">${fmt(o.total)}</span>
      </div>
    </div>
    ${o.note ? `<div style="margin-top:1rem;padding:.75rem;background:var(--dark3);border-radius:8px;font-size:13px;color:var(--muted)"><span style="color:var(--white)">Catatan: </span>${o.note}</div>` : ''}
  `;
  document.getElementById('detail-modal').classList.add('show');
}

// ===========================
// DETAIL PRODUK
// ===========================
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
      ${p.tag ? `<div class="product-tag ${p.tag === 'NEW' ? 'new' : ''}">${p.tag}</div>` : ''}
    </div>
    <p style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:1.5rem">${p.desc}</p>
    <div class="detail-row"><span class="label">Kategori</span><span class="val">${p.category === 'watch' ? '⌚ Jam Tangan' : '💻 Laptop'}</span></div>
    <div class="detail-row" style="border:none;margin-bottom:1.5rem">
      <span class="label">Harga</span>
      <span style="font-size:22px;color:var(--gold);font-weight:700">${fmt(p.price)}</span>
    </div>
    <button class="btn-primary" style="width:100%;padding:14px;font-size:15px"
      onclick="addToCart(${p.id});closeModal('detail-modal')">+ Tambah ke Keranjang</button>
  `;
  document.getElementById('detail-modal').classList.add('show');
}

// ===========================
// MODAL & HALAMAN
// ===========================
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('nav-' + name).classList.add('active');
  if (name === 'history') renderHistory();
  window.scrollTo(0, 0);
}

function scrollTop() {
  showPage('shop');
  window.scrollTo(0, 0);
}

// ===========================
// TOAST NOTIFIKASI
// ===========================
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===========================
// KONTAK
// ===========================
function sendContact() {
  const name = document.getElementById('contact-name').value.trim();
  const msg = document.getElementById('contact-message').value.trim();
  if (!name || !msg) { showToast('Lengkapi nama dan pesan!'); return; }
  showToast('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
  ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach(id => document.getElementById(id).value = '');
}

// ===========================
// INIT
// ===========================
renderProducts('all');
