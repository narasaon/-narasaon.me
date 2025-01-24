document.getElementById('productForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const imageInput = document.getElementById('image');
  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('brand', document.getElementById('brand').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('color', document.getElementById('color').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('stock', document.getElementById('stock').value);

  if (imageInput.files[0]) {
    formData.append('image', imageInput.files[0]);
  }

  fetch('http://localhost:3000/api/products', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then(() => {
      alert('Product added successfully');
      resetForm();
      // Redirect to index.html after adding the product
      window.location.href = '../view/view-products.html'; // Change this path if needed
    })
    .catch((error) => {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    });
});

function resetForm() {
  document.getElementById('productForm').reset();
}
