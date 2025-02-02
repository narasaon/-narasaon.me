function checkLoginStatus() {
  const authBtn = document.getElementById('auth-btn');
  const token = localStorage.getItem('token');
  if (token) {
    authBtn.textContent = 'Logout';
    authBtn.onclick = handleLogout;
  } else {
    authBtn.textContent = 'Login';
    authBtn.onclick = () => (window.location.href = '/login');
  }
}

// Fungsi logout
function handleLogout() {
  localStorage.removeItem('token');
  alert('Anda telah logout.');
  checkLoginStatus();
  window.location.replace = 'https://narasaon.me/login'; // Redirect ke halaman login
}

// Ambil data checkout dari API
async function fetchCheckoutData() {
  const response = await fetch('https://api.narasaon.me/checkouts', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });

  if (response.ok) {
    const data = await response.json();
    const checkouts = data.data;
    const table = document.getElementById('checkout-table');
    table.innerHTML = '';

    checkouts.forEach((checkout) => {
      const row = `
          <tr>
            <td class="px-6 py-4">${checkout.checkout_id}</td>
            <td class="px-6 py-4">${checkout.user_name}</td>
            <td class="px-6 py-4">${checkout.total_price.toLocaleString()}</td>
            <td class="px-6 py-4">${checkout.address}</td>
            <td class="px-6 py-4">${checkout.phone_number}</td>
            <td class="px-6 py-4">
              <span class="inline-block py-1 px-2 text-xs font-semibold rounded-full ${checkout.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}">
                ${checkout.status}
              </span>
            </td>
            <td class="px-6 py-4">${new Date(checkout.created_at).toLocaleString()}</td>
            <td class="px-6 py-4">${new Date(checkout.modified_at).toLocaleString()}</td>
          </tr>
        `;
      table.innerHTML += row;
    });
  } else {
    alert('Gagal mengambil data checkout');
  }
}

function filterOrders() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const rows = document.querySelectorAll('#checkout-table > tr');
  rows.forEach((row) => {
    const id = row.cells[0].textContent.toLowerCase();
    row.style.display = id.includes(searchTerm) ? '' : 'none';
  });
}

function refreshTable() {
  fetchCheckoutData();
  document.getElementById('search').value = '';
}

window.onload = () => {
  checkLoginStatus();
  fetchCheckoutData();
};
