document.addEventListener('DOMContentLoaded', () => {
  const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
  const orderDetails = document.getElementById('order-details');

  if (checkoutData) {
    let orderHTML = `
      <div class="p-6 bg-white rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-purple-600">Delivery Information</h3>
        <p><strong>Address:</strong> ${checkoutData.address}</p>
        <p><strong>Phone Number:</strong> ${checkoutData.phoneNumber}</p>
        <h3 class="text-xl font-semibold text-purple-600 mt-4">Order Items</h3>
        <ul class="space-y-2">
    `;

    checkoutData.items.forEach((item) => {
      orderHTML += `
        <li class="flex justify-between">
          <span>${item.product_name} (x${item.quantity})</span>
          <span>${item.price}</span>
        </li>
      `;
    });

    orderHTML += `
        </ul>
        <p class="text-lg font-bold mt-4">Total: ${checkoutData.totalPrice}</p>
      </div>
    `;

    orderDetails.innerHTML = orderHTML;
  } else {
    orderDetails.innerHTML = '<p>No order details found.</p>';
  }
});
