const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
  alert('Product ID is required!');
  window.location.href = 'product-list.html';
}

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((product) => {
    document.getElementById('productId').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('brand').value = product.brand;
    document.getElementById('category').value = product.category;
    document.getElementById('color').value = product.color;
    document.getElementById('price').value = product.price;
    document.getElementById('stock').value = product.stock;
    document.getElementById('imagePreview').src = product.image_url;
    document.getElementById('imagePreview').style.display = 'block';
  })
  .catch((error) => console.error('Error fetching product:', error));

document.getElementById('productForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const imageInput = document.getElementById('image');
  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('brand', document.getElementById('brand').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('color', document.getElementById('color').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('stock', document.getElementById('stock').value);

  const existingImage = document.getElementById('imagePreview').src;
  if (imageInput.files[0]) {
    formData.append('image', imageInput.files[0]);
  } else {
    formData.append('image_url', existingImage);
  }

  fetch(`http://localhost:3000/api/products/${productId}`, {
    method: 'PUT',
    body: formData,
  })
    .then((response) => response.json())
    .then(() => {
      alert('Product updated successfully');
      window.location.href = '../view/view-products.html';
    })
    .catch((error) => console.error('Error updating product:', error));
});

function resetForm() {
  document.getElementById('productForm').reset();
}
