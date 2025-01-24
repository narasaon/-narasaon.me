const API_URL = 'http://localhost:3000';

// Fetch payment data and populate the table
async function fetchPayments() {
  const response = await fetch(`${API_URL}/payments`);
  const data = await response.json();

  const tableBody = document.getElementById('payment-table-body');
  tableBody.innerHTML = ''; // Clear table before adding new data

  if (data.success) {
    data.data.forEach((payment) => {
      const row = document.createElement('tr');
      row.classList.add('border-t');

      row.innerHTML = `
            <td class="px-6 py-4 border border-gray-300 text-sm text-gray-700">${payment.payment_id}</td>
            <td class="px-6 py-4 border border-gray-300 text-sm text-gray-700">${payment.user_id}</td>
            <td class="px-6 py-4 border border-gray-300 text-sm text-gray-700">${payment.checkout_id}</td>
            <td class="px-6 py-4 border border-gray-300 text-sm font-semibold ${getStatusClass(payment.payment_status)}">
                ${payment.payment_status}
            </td>
            <td class="px-6 py-4 border border-gray-300">
                <a href="${payment.payment_image}" target="_blank" class="text-blue-500 hover:underline">View</a>
            </td>
            <td class="px-6 py-4 border border-gray-300">
                <div class="flex items-center gap-2">
                    <button onclick="updatePaymentStatus('${payment.payment_id}', 'Verified')" 
                            class="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 text-sm">
                        Verify
                    </button>
                    <button onclick="updatePaymentStatus('${payment.payment_id}', 'Pending')" 
                            class="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 text-sm">
                        Pending
                    </button>
                </div>
            </td>
            `;

      tableBody.appendChild(row);
    });
  } else {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-gray-500 py-4">No payment data found.</td></tr>';
  }
}

// Update payment status
async function updatePaymentStatus(paymentID, status) {
  const response = await fetch(`${API_URL}/${paymentID}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  const result = await response.json();
  if (result.success) {
    alert(`Payment status updated to ${status}`);
    fetchPayments(); // Refresh table
  } else {
    alert(`Failed to update status: ${result.error}`);
  }
}

// Get status class for styling
function getStatusClass(status) {
  if (status === 'Pending') return 'text-yellow-500';
  if (status === 'Verified') return 'text-green-500';
  return 'text-gray-500';
}

// Fetch payments on page load
fetchPayments();
