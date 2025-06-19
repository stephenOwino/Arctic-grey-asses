document.addEventListener('DOMContentLoaded', function() {
  // Cart Drawer Elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartToggleButtons = document.querySelectorAll('.header__icon--cart');
  const cartCloseButton = document.querySelector('.cart-drawer__close');
  
  // Cart quantity elements
  const quantityButtons = document.querySelectorAll('.cart-drawer__quantity-btn');
  const quantityInputs = document.querySelectorAll('.cart-drawer__quantity-input');
  
  // Recommendation carousel
  const recommendationPrevBtn = document.querySelector('.cart-drawer__recommendation-prev');
  const recommendationNextBtn = document.querySelector('.cart-drawer__recommendation-next');
  const recommendationsList = document.querySelector('.cart-drawer__recommendations-list');
  
  // Toggle cart drawer
  function toggleCartDrawer() {
    cartDrawer.classList.toggle('active');
    cartDrawerOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }
  
  // Close cart drawer
  function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    cartDrawerOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  
  // Update cart item quantity
  function updateCartItemQuantity(key, quantity) {
    const formData = {
      'id': key,
      'quantity': quantity
    };
  
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      // Update cart count and subtotal
      document.querySelectorAll('.cart-count-bubble span').forEach(el => {
        el.textContent = data.item_count;
      });
      
      document.querySelector('.cart-drawer__subtotal-price').textContent = formatMoney(data.total_price);
      
      // Hide/show cart count bubble
      const cartCountBubbles = document.querySelectorAll('.cart-count-bubble');
      cartCountBubbles.forEach(bubble => {
        if (data.item_count === 0) {
          bubble.style.display = 'none';
        } else {
          bubble.style.display = 'flex';
        }
      });
      
      // Update shipping progress
      updateShippingProgress(data.total_price);
    })
    .catch(error => console.error('Error updating cart:', error));
  }
  
  // Format money (simple implementation)
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }
  
  // Update shipping progress bar
  function updateShippingProgress(cartTotal) {
    const freeShippingThreshold = 8000; // $80.00 in cents
    const progressBar = document.querySelector('.cart-drawer__shipping-progress-bar');
    const shippingMessage = document.querySelector('.cart-drawer__shipping-message');
    
    if (!progressBar || !shippingMessage) return;
    
    let progressPercentage = (cartTotal / freeShippingThreshold) * 100;
    if (progressPercentage > 100) progressPercentage = 100;
    
    progressBar.style.width = progressPercentage + '%';
    
    const remainingForFreeShipping = (freeShippingThreshold - cartTotal) / 100;
    
    if (remainingForFreeShipping > 0) {
      shippingMessage.textContent = `You are $${remainingForFreeShipping.toFixed(2)} away from eligible for free shipping`;
    } else {
      shippingMessage.textContent = `You're eligible for free shipping!`;
    }
  }
  
  // Add event listeners
  cartToggleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      toggleCartDrawer();
    });
  });
  
  if (cartCloseButton) {
    cartCloseButton.addEventListener('click', closeCartDrawer);
  }
  
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', closeCartDrawer);
  }
  
  // Quantity buttons
  quantityButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = button.parentNode.querySelector('.cart-drawer__quantity-input');
      const action = button.getAttribute('data-action');
      const key = input.getAttribute('data-key');
      let quantity = parseInt(input.value);
      
      if (action === 'increase') {
        quantity += 1;
      } else if (action === 'decrease' && quantity > 1) {
        quantity -= 1;
      }
      
      input.value = quantity;
      updateCartItemQuantity(key, quantity);
    });
  });
  
  // Quantity inputs
  quantityInputs.forEach(input => {
    input.addEventListener('change', function() {
      const key = input.getAttribute('data-key');
      const quantity = parseInt(input.value);
      
      if (quantity < 1) {
        input.value = 1;
        updateCartItemQuantity(key, 1);
      } else {
        updateCartItemQuantity(key, quantity);
      }
    });
  });
  
  // Recommendation carousel
  if (recommendationsList && recommendationPrevBtn && recommendationNextBtn) {
    recommendationPrevBtn.addEventListener('click', function() {
      recommendationsList.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    recommendationNextBtn.addEventListener('click', function() {
      recommendationsList.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }
  
  // Add to cart buttons for recommendations
  const addToCartButtons = document.querySelectorAll('.cart-drawer__recommendation-add');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = button.getAttribute('data-product-id');
      if (!productId) return;
      
      // Add to cart animation
      button.textContent = 'Adding...';
      
      const formData = {
        'items': [{
          'id': productId,
          'quantity': 1
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
        // Refresh cart
        fetch('/cart.js')
          .then(response => response.json())
          .then(cart => {
            // Update cart count
            document.querySelectorAll('.cart-count-bubble span').forEach(el => {
              el.textContent = cart.item_count;
            });
            
            // Update cart subtotal
            document.querySelector('.cart-drawer__subtotal-price').textContent = formatMoney(cart.total_price);
            
            // Show success state
            button.textContent = 'Added ✓';
            setTimeout(() => {
              button.textContent = 'Add to Cart +';
            }, 2000);
            
            // Refresh cart contents
            window.location.reload();
          });
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
        button.textContent = 'Error';
        setTimeout(() => {
          button.textContent = 'Add to Cart +';
        }, 2000);
      });
    });
  });
});
