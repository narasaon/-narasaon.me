const token = localStorage.getItem('token');

// Update login/logout button based on token existence
function toggleLoginLogout() {
  const loginBtn = document.getElementById('login-btn');
  const userNameElement = document.getElementById('userName');

  if (token) {
    // Hapus token untuk logout
    localStorage.removeItem('token');
    localStorage.removeItem('name');

    // Update UI
    loginBtn.innerText = 'Login';
    userNameElement.textContent = '';

    // Redirect ke halaman login
    window.location.replace('https://narasaon.me/login');
  } else {
    // Jika belum login, langsung ke halaman login
    window.location.href = 'https://narasaon.me/login';
  }
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
}

async function loadCart() {
  try {
    const response = await fetch('https://api.narasaon.me/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    cartItems.innerHTML = '';
    let total = 0;

    data.items.forEach((item) => {
      total += item.price * item.quantity;
      const cartItem = `
              <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                <div class="flex items-center">
                  <img src="${item.image_url}" alt="${item.product_name}" class="w-20 h-20 object-cover rounded-md mr-4">
                  <div>
                    <h3 class="text-lg font-semibold text-purple-600">${item.product_name}</h3>
                    <p class="text-gray-600">Price: ${formatRupiah(item.price)}</p>
                    <p class="text-gray-600">Quantity: ${item.quantity}</p>
                  </div>
                </div>
                <button class="text-red-500 hover:text-red-700" onclick="removeFromCart('${item.product_id}')">
  <i class="fas fa-trash"></i> Remove
</button>
              </div>
            `;
      cartItems.innerHTML += cartItem;
    });

    totalPriceElement.innerText = `Total: ${formatRupiah(total)}`;
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

async function removeFromCart(productId) {
  try {
    const response = await fetch('https://api.narasaon.me/api/cart/remove-single', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      loadCart();
      window.location.reload(); // Refresh halaman setelah menghapus item
    } else {
      console.error('Error removing item:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const userNameElement = document.getElementById('userName');

  if (token) {
    loginBtn.innerText = 'Logout';
    const userName = localStorage.getItem('name');
    userNameElement.textContent = userName ? `Hi, ${userName}` : 'Hi, User';
  } else {
    loginBtn.innerText = 'Login';
    userNameElement.textContent = '';
  }

  loadCart();
});
