const token = localStorage.getItem('token');
const userNameElement = document.getElementById('userName');

function toggleLoginLogout() {
  const loginBtn = document.getElementById('login-btn');
  if (token) {
    localStorage.removeItem('token');
    loginBtn.innerText = 'Login';
    window.location.href = 'narasaon.me/login';
  } else {
    loginBtn.innerText = 'Logout';
  }
}

// Display Username
const userName = localStorage.getItem('name');
userNameElement.textContent = userName ? `Hi, ${userName}` : 'Hi, User';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
}

async function loadCheckoutItems() {
  try {
    const response = await fetch('https://api.narasaon.me/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const checkoutItems = document.getElementById('checkout-items');
    const totalPriceElement = document.getElementById('total-price');

    checkoutItems.innerHTML = '';
    let total = 0;

    data.items.forEach((item) => {
      total += item.price * item.quantity;
      const checkoutItem = `
              <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                <div class="flex items-center">
                  <img src="${item.image_url}" alt="${item.product_name}" class="w-20 h-20 object-cover rounded-md mr-4">
                  <div>
                    <h3 class="text-lg font-semibold text-purple-600">${item.product_name}</h3>
                    <p class="text-gray-600">Price: ${formatRupiah(item.price)}</p>
                    <p class="text-gray-600">Quantity: ${item.quantity}</p>
                  </div>
                </div>
              </div>
            `;
      checkoutItems.innerHTML += checkoutItem;
    });

    totalPriceElement.innerText = `Total: ${formatRupiah(total)}`;
  } catch (error) {
    console.error('Error loading checkout items:', error);
  }
}

async function submitCheckout(event) {
  event.preventDefault();
  const address = document.getElementById('address').value;
  const phoneNumber = document.getElementById('phone_number').value;

  try {
    const response = await fetch('https://api.narasaon.me/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address, phone_number: phoneNumber }),
    });

    const result = await response.json();
    if (response.ok) {
      // Ambil data dari respons
      const checkoutData = result.data;
      const checkoutId = checkoutData.checkout_id;

      // Menampilkan informasi checkout
      document.getElementById('order-code').innerText = checkoutId;
      document.getElementById('success-message').classList.remove('hidden');
      document.getElementById('checkout-form').classList.add('hidden');
    } else {
      console.error('Checkout error:', result.message);
      alert('Terjadi kesalahan saat checkout.');
    }
  } catch (error) {
    console.error('Error submitting checkout:', error);
    alert('Terjadi kesalahan jaringan.');
  }
}

function copyOrderCode() {
  const orderCode = document.getElementById('order-code').innerText;
  navigator.clipboard
    .writeText(orderCode)
    .then(() => {
      alert('Kode pesanan berhasil disalin!');
    })
    .catch((error) => {
      console.error('Error copying text: ', error);
      alert('Gagal menyalin kode pesanan.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    document.getElementById('login-btn').innerText = 'Logout';
  } else {
    document.getElementById('login-btn').innerText = 'Login';
  }

  loadCheckoutItems();
  document.getElementById('checkout-form').addEventListener('submit', submitCheckout);
});
