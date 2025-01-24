const apiUrl = 'http://localhost:3000'; // Change to your API base URL

async function fetchCheckouts() {
  try {
    const response = await fetch(`${apiUrl}/checkouts`);
    const data = await response.json();
    const checkouts = data.data;
    const tableBody = document.getElementById('checkout-table-body');

    tableBody.innerHTML = '';
    checkouts.forEach((checkout) => {
      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-100');

      row.innerHTML = `
              <td class="py-2 px-4 border-b text-sm">${checkout.checkout_id}</td>
              <td class="py-2 px-4 border-b text-sm">${checkout.user_name}</td>
              <td class="py-2 px-4 border-b text-sm">${checkout.total_price}</td>
              <td class="py-2 px-4 border-b text-sm">${checkout.address}</td>
              <td class="py-2 px-4 border-b text-sm">${checkout.phone_number}</td>
              <td class="py-2 px-4 border-b text-sm">
                <select onchange="updateStatus('${checkout.checkout_id}', this.value)" class="border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
                  <option value="Pending" ${checkout.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Sedang Dikemas" ${checkout.status === 'Sedang Dikemas' ? 'selected' : ''}>Sedang Dikemas</option>
                  <option value="Sedang Dalam Perjalanan" ${checkout.status === 'Sedang Dalam Perjalanan' ? 'selected' : ''}>Sedang Dalam Perjalanan</option>
                  <option value="Completed" ${checkout.status === 'Completed' ? 'selected' : ''}>Completed</option>
                  <option value="Cancelled" ${checkout.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </td>
              <td class="py-2 px-4 border-b text-sm">
                <button onclick="deleteCheckout('${checkout.checkout_id}')" class="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                  Delete
                </button>
              </td>
            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching checkouts:', error);
  }
}

async function updateStatus(checkoutId, status) {
  try {
    await fetch(`${apiUrl}/api/checkout/${checkoutId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    alert('Status updated successfully');
    fetchCheckouts();
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status');
  }
}

async function deleteCheckout(checkoutId) {
  if (confirm('Are you sure you want to delete this checkout?')) {
    try {
      await fetch(`${apiUrl}/checkout/${checkoutId}`, {
        method: 'DELETE',
      });
      alert('Checkout deleted successfully');
      fetchCheckouts();
    } catch (error) {
      console.error('Error deleting checkout:', error);
      alert('Failed to delete checkout');
    }
  }
}

// Load checkouts on page load
fetchCheckouts();
