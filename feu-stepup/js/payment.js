const token = localStorage.getItem('token');

function toggleLoginLogout() {
  const loginBtn = document.getElementById('login-btn');
  if (token) {
    localStorage.removeItem('token');
    loginBtn.innerText = 'Login';
    window.location.href = '../../login.html';
  } else {
    loginBtn.innerText = 'Logout';
  }
}

async function submitPayment(event) {
  event.preventDefault();
  const formData = new FormData();
  const checkoutId = document.getElementById('checkout_id').value;
  const paymentImage = document.getElementById('payment_image').files[0];

  if (!checkoutId) {
    alert('Silakan masukkan Checkout ID.');
    return;
  }

  formData.append('payment_image', paymentImage);

  try {
    const response = await fetch(`http://localhost:3000/api/payment/${checkoutId}`, {
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

      // Redirect to order table page after 3 seconds
      setTimeout(() => {
        window.location.href = '../view/orders.html';
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
  if (token) {
    document.getElementById('login-btn').innerText = 'Logout';
  } else {
    document.getElementById('login-btn').innerText = 'Login';
  }

  document.getElementById('payment-form').addEventListener('submit', submitPayment);
});
