// Simulated API request to get admin details (replace with actual API endpoint)
function getAdminDetails() {
  fetch('http://localhost:3000/api/admin') // Ganti URL sesuai dengan API yang sesuai untuk mengambil info admin
    .then((response) => response.json())
    .then((data) => {
      const welcomeMessage = document.getElementById('welcome-message');
      welcomeMessage.textContent = `Welcome, ${data.name}`; // Gantilah `data.name` sesuai dengan respons API
    })
    .catch((error) => console.error('Error fetching admin data:', error));
}

function fetchProducts() {
  fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector('#productTable');
      tableBody.innerHTML = '';
      data.forEach((product) => {
        const row = document.createElement('tr');
        row.classList.add('border-b');

        // Format harga ke Rupiah
        const priceInRupiah = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(product.price);

        row.innerHTML = `
            <td class="py-3 px-4 text-center">${product.code}</td>
            <td class="py-3 px-4 text-center">${product.name}</td>
            <td class="py-3 px-4 text-center">${product.brand}</td>
            <td class="py-3 px-4 text-center">${product.category}</td>
            <td class="py-3 px-4 text-center">${product.color}</td>
            <td class="py-3 px-4 text-center">${priceInRupiah}</td>
            <td class="py-3 px-4 text-center">${product.stock}</td>
            <td class="py-3 px-4 text-center">
              <img src="${product.image_url}" alt="Product Image" class="w-16 h-16 object-cover rounded-md mx-auto">
            </td>
            <td class="py-3 px-4 text-center flex gap-2 justify-center">
              <a href="edit-products.html?id=${product.id}" class="px-4 py-2 bg-[#4527a0] text-white rounded-md hover:bg-[#5c38a1] transition duration-300">Edit</a>
              <button onclick="deleteProduct('${product.id}')" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">Delete</button>
            </td>
          `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error('Error fetching products:', error));
}

// Delete product
function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' })
      .then(() => {
        alert('Product deleted successfully');
        fetchProducts();
      })
      .catch((error) => console.error('Error deleting product:', error));
  }
}

// Call functions to fetch admin details and products
getAdminDetails();
fetchProducts();
