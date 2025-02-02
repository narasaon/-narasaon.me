const token = localStorage.getItem('token');
const loginBtn = document.getElementById('login-btn');
const userNameElement = document.getElementById('userName');

// Handle Login/Logout
if (!token) {
  loginBtn.innerText = 'Login';
  loginBtn.href = 'https://narasaon.me/login';
} else {
  loginBtn.innerText = 'Logout';
  loginBtn.href = '#';
  loginBtn.onclick = () => {
    localStorage.clear(); // Menghapus semua item di localStorage (token, cart, name, dll.)
    window.location.href = 'https://narasaon.me/login';
  };
}

// Display Username
const userName = localStorage.getItem('name');
userNameElement.textContent = userName ? `Hi, ${userName}` : 'Hi, User';

let products = [];

async function loadProducts() {
  try {
    const response = await fetch('https://api.narasaon.me/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    products = await response.json();
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    products.forEach((product) => {
      const productItem = `
        <div class="bg-white p-4 rounded-lg shadow-lg">
            <img src="${product.image_url}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-4">
            <h3 class="text-lg font-semibold text-purple-600">${product.name}</h3>
            <p class="text-gray-600 mb-2">Brand: ${product.brand}</p>
            <p class="text-gray-800 mb-2">IDR ${product.price.toLocaleString()}</p>
            <button class="add-to-cart bg-purple-600 text-white px-4 py-2 rounded-md mt-2 w-full" data-id="${product.product_id}">
                Add to Cart
            </button>
        </div>
      `;
      productGrid.innerHTML += productItem;
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  updateCartCount();
}

async function addToCart(productId) {
  try {
    const response = await fetch('https://api.narasaon.me/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error adding to cart:', errorData);
      alert(errorData.error || 'Gagal menambahkan produk ke keranjang.');
      return;
    }

    alert('Produk berhasil ditambahkan ke keranjang!');
    updateCartCount();
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

async function updateCartCount() {
  try {
    const response = await fetch('https://api.narasaon.me/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Error fetching cart:', await response.json());
      return;
    }

    const cart = await response.json();
    const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
