let token = localStorage.getItem('token');
const loginDiv = document.getElementById('login');
const appDiv = document.getElementById('app');

async function request(url, options={}) {
  options.headers = options.headers || {};
  if (token) options.headers['Authorization'] = 'Bearer ' + token;
  if (options.body && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Request error');
  }
  return res.json();
}

function showApp() {
  loginDiv.classList.add('hidden');
  appDiv.classList.remove('hidden');
  loadDashboard();
  loadItems();
  loadCustomers();
  loadEmployees();
}

if (token) showApp();

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const res = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    token = res.token;
    localStorage.setItem('token', token);
    showApp();
  } catch (err) {
    document.getElementById('loginError').textContent = err.message;
  }
});

document.getElementById('logout').addEventListener('click', () => {
  token = null;
  localStorage.removeItem('token');
  appDiv.classList.add('hidden');
  loginDiv.classList.remove('hidden');
});

// Tabs
const buttons = document.querySelectorAll('nav button[data-tab]');
buttons.forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
  document.getElementById(btn.dataset.tab).classList.remove('hidden');
  if (btn.dataset.tab === 'panel') loadDashboard();
  if (btn.dataset.tab === 'items') loadItems();
  if (btn.dataset.tab === 'customers') loadCustomers();
  if (btn.dataset.tab === 'employees') loadEmployees();
  if (btn.dataset.tab === 'payroll') loadPayroll();
}));

// Dashboard
async function loadDashboard() {
  const d = await request('/api/reports/dashboard');
  document.getElementById('dashboard').innerHTML = `Günlük Satış: ${d.daily_sales}<br>Stok Değeri: ${d.stock_value}`;
}

// Items
async function loadItems() {
  const items = await request('/api/items');
  const tbl = document.getElementById('itemsTable');
  tbl.innerHTML = '<tr><th>SKU</th><th>Ad</th><th>Alış</th><th>Satış</th><th>Stok</th></tr>' +
    items.map(i => `<tr><td>${i.sku}</td><td>${i.name}</td><td>${i.buy_price}</td><td>${i.sell_price}</td><td>${i.stock}</td></tr>`).join('');
  const select = document.getElementById('saleItem');
  select.innerHTML = items.map(i => `<option value="${i.id}" data-price="${i.sell_price}">${i.name}</option>`).join('');
}

document.getElementById('itemForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    sku: document.getElementById('itemSku').value,
    name: document.getElementById('itemName').value,
    buy_price: +document.getElementById('itemBuy').value,
    sell_price: +document.getElementById('itemSell').value,
    stock: +document.getElementById('itemStock').value,
    supplier: document.getElementById('itemSupplier').value
  };
  await request('/api/items', { method: 'POST', body: JSON.stringify(body) });
  loadItems();
});

// Sales
let cart = [];

document.getElementById('addToCart').addEventListener('click', () => {
  const select = document.getElementById('saleItem');
  const itemId = select.value;
  const price = parseFloat(select.options[select.selectedIndex].dataset.price);
  const qty = parseInt(document.getElementById('saleQty').value, 10);
  if (!qty) return;
  cart.push({ item_id: itemId, qty, price });
  renderCart();
});

function renderCart() {
  const tbl = document.getElementById('cartTable');
  tbl.innerHTML = '<tr><th>Ürün</th><th>Adet</th><th>Fiyat</th></tr>' +
    cart.map(c => `<tr><td>${c.item_id}</td><td>${c.qty}</td><td>${c.price}</td></tr>`).join('');
}

document.getElementById('saleForm').addEventListener('submit', async e => {
  e.preventDefault();
  if (!cart.length) return;
  const payment_method = document.getElementById('paymentMethod').value;
  await request('/api/sales', { method: 'POST', body: JSON.stringify({ items: cart, payment_method }) });
  cart = [];
  renderCart();
  loadItems();
});

// Customers
async function loadCustomers() {
  const customers = await request('/api/customers');
  const tbl = document.getElementById('customersTable');
  tbl.innerHTML = '<tr><th>Ad</th><th>Telefon</th><th>Email</th></tr>' +
    customers.map(c => `<tr><td>${c.name}</td><td>${c.phone||''}</td><td>${c.email||''}</td></tr>`).join('');
}

document.getElementById('customerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    name: document.getElementById('custName').value,
    phone: document.getElementById('custPhone').value,
    email: document.getElementById('custEmail').value,
    address: document.getElementById('custAddress').value
  };
  await request('/api/customers', { method: 'POST', body: JSON.stringify(body) });
  loadCustomers();
});

// Employees
async function loadEmployees() {
  const employees = await request('/api/employees');
  const tbl = document.getElementById('employeesTable');
  tbl.innerHTML = '<tr><th>Ad</th><th>Telefon</th><th>Maaş</th></tr>' +
    employees.map(e => `<tr><td>${e.name}</td><td>${e.phone||''}</td><td>${e.salary||''}</td></tr>`).join('');
  const select = document.getElementById('payEmployee');
  select.innerHTML = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
}

document.getElementById('empForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    name: document.getElementById('empName').value,
    phone: document.getElementById('empPhone').value,
    salary: +document.getElementById('empSalary').value,
    start_date: document.getElementById('empStart').value,
    end_date: document.getElementById('empEnd').value
  };
  await request('/api/employees', { method: 'POST', body: JSON.stringify(body) });
  loadEmployees();
});

// Payroll
async function loadPayroll() {
  await loadEmployees();
  const empId = document.getElementById('payEmployee').value;
  if (empId) loadPayHistory(empId);
}

async function loadPayHistory(empId) {
  const rows = await request('/api/payroll/history/' + empId);
  const tbl = document.getElementById('payHistory');
  tbl.innerHTML = '<tr><th>Tutar</th><th>Not</th><th>Tarih</th></tr>' +
    rows.map(r => `<tr><td>${r.amount}</td><td>${r.note||''}</td><td>${r.paid_at}</td></tr>`).join('');
}

document.getElementById('payEmployee').addEventListener('change', e => {
  loadPayHistory(e.target.value);
});

document.getElementById('payForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    employee_id: document.getElementById('payEmployee').value,
    amount: +document.getElementById('payAmount').value,
    note: document.getElementById('payNote').value
  };
  await request('/api/payroll/pay', { method: 'POST', body: JSON.stringify(body) });
  loadPayHistory(body.employee_id);
});
