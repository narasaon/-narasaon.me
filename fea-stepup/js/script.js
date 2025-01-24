// URL API backend
const API_URL_PRODUCTS = 'http://localhost:3000/api/count/products';
const API_URL_USERS = 'http://localhost:3000/api/count/users';

// Fungsi untuk mengambil data dari API
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Fungsi untuk menampilkan jumlah produk
async function displayProductCount() {
  const productData = await fetchData(API_URL_PRODUCTS);
  if (productData && productData.product_count !== undefined) {
    document.getElementById('productCount').textContent = productData.product_count;
  }
}

// Fungsi untuk menampilkan jumlah pengguna
async function displayUserCount() {
  const userData = await fetchData(API_URL_USERS);
  if (userData && userData.user_count !== undefined) {
    document.getElementById('userCount').textContent = userData.user_count;
  }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  displayProductCount();
  displayUserCount();
});

// Tangani aksi tombol logout di sidebar
document.getElementById('sidebar-logout-btn').addEventListener('click', function () {
  // Konfirmasi logout
  const confirmed = confirm('Are you sure you want to log out?');
  if (confirmed) {
    // Redirect ke halaman login (atau lakukan aksi logout lainnya)
    window.location.href = '../../login.html';
  }
});
