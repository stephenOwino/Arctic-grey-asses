function addToCart(variantId, quantity) {
  let formData = {
    'items': [{
      'id': variantId,
      'quantity': quantity || 1
    }]
  };
  
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    // Update cart count or show confirmation
    updateCartCount();
    showAddedToCartNotification();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCountElement = document.querySelector('.cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = cart.item_count;
      }
    });
}

function showAddedToCartNotification() {
  const notification = document.createElement('div');
  notification.className = 'added-to-cart-notification';
  notification.textContent = 'Product added to cart!';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2000);
  }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
  // Setup click listeners for add buttons
  const addButtons = document.querySelectorAll('.js-add-to-cart');
  
  addButtons.forEach(button => {
    button.addEventListener('click', function() {
      const variantId = this.getAttribute('data-variant-id');
      addToCart(variantId);
    });
  });
});