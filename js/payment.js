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
    localStorage.clear(); // Menghapus semua data di localStorage
    window.location.href = 'https://narasaon.me/login';
  };
}

// Display Username
const userName = localStorage.getItem('name');
userNameElement.textContent = userName ? `Hi, ${userName}` : 'Hi, User';

async function submitPayment(event) {
  event.preventDefault();
  const formData = new FormData();
  const checkoutId = document.getElementById('checkout_id').value;
  const paymentImage = document.getElementById('payment_image').files[0];

  if (!token) {
    alert('Silakan login terlebih dahulu untuk mengunggah pembayaran.');
    return;
  }

  if (!checkoutId) {
    alert('Silakan masukkan Checkout ID.');
    return;
  }

  formData.append('payment_image', paymentImage);

  try {
    const response = await fetch(`https://api.narasaon.me/api/payment/${checkoutId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      document.getElementById('payment-form').classList.add('hidden');
      document.getElementById('success-message').classList.remove('hidden');

      // Redirect ke halaman orders setelah 3 detik
      setTimeout(() => {
        window.location.href = 'https://narasaon.me/view/orders.html';
      }, 3000);
    } else {
      console.error('Error uploading payment:', result.message);
      alert('Gagal mengunggah bukti pembayaran. Silakan cek Checkout ID atau format file.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan jaringan.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('payment-form').addEventListener('submit', submitPayment);
});
