document.addEventListener("DOMContentLoaded", () => {
	// Mobile Menu Toggle
	const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
	const mobileNav = document.querySelector(".mobile-nav");

	if (mobileMenuToggle && mobileNav) {
		mobileMenuToggle.addEventListener("click", () => {
			mobileMenuToggle.classList.toggle("active");
			mobileNav.classList.toggle("active");
		});
	}

	// Cart Functionality
	const cartDrawer = document.getElementById("cart-drawer");
	const cartOverlay = document.getElementById("cart-overlay");
	const cartIcons = document.querySelectorAll(".cart-icon");
	const closeCartButton = document.querySelector(".cart-drawer-close");
	const cartItemsContainer = document.querySelector(".cart-items-container");
	const cartCountElements = document.querySelectorAll(".cart-count");
	const subtotalPriceElement = document.querySelector(".subtotal-price");
	const cartItemCountDisplay = document.querySelector(
		".cart-item-count-display"
	);
	const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
	const shippingAmountAwayEl = document.querySelector(".shipping-amount-away");
	const shippingProgressBar = document.querySelector(".progress-bar");

	let cartItems = [];
	const FREE_SHIPPING_THRESHOLD = 80;

	const openCart = () => {
		cartDrawer.classList.add("active");
		cartOverlay.classList.add("active");
		document.body.style.overflow = "hidden";
	};

	const closeCart = () => {
		cartDrawer.classList.remove("active");
		cartOverlay.classList.remove("active");
		document.body.style.overflow = "";
	};

	const renderCart = () => {
		cartItemsContainer.innerHTML = "";
		if (cartItems.length === 0) {
			cartItemsContainer.innerHTML =
				'<p style="text-align:center; padding: 40px 0; font-family: Rubik;">Your bag is empty.</p>';
		} else {
			cartItems.forEach((item) => {
				const cartItemElement = document.createElement("div");
				cartItemElement.classList.add("cart-item");
				cartItemElement.dataset.id = item.id;
				cartItemElement.innerHTML = `
          <img src="${item.image}" alt="${
					item.name
				}" class="cart-item-image" onerror="this.onerror=null;this.src='https://placehold.co/80x80/f0f0f0/333?text=Image';">
          <div class="cart-item-details">
            <p class="cart-item-title">${item.name}</p>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <div class="cart-item-actions">
              <div class="quantity-selector">
                <button class="quantity-btn" data-action="decrease" aria-label="Decrease quantity">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" aria-label="Increase quantity">+</button>
              </div>
              <button class="remove-item-btn" aria-label="Remove ${
								item.name
							}">Remove</button>
            </div>
          </div>
        `;
				cartItemsContainer.appendChild(cartItemElement);
			});
		}
		updateCartSummary();
	};

	const updateCartSummary = () => {
		const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
		const subtotal = cartItems.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		);

		cartCountElements.forEach((el) => {
			el.textContent = totalItems;
			el.style.display = totalItems > 0 ? "flex" : "none";
		});
		cartItemCountDisplay.textContent = totalItems;
		subtotalPriceElement.textContent = `$${subtotal.toFixed(2)}`;

		const amountAway = FREE_SHIPPING_THRESHOLD - subtotal;
		if (subtotal >= FREE_SHIPPING_THRESHOLD) {
			if (shippingAmountAwayEl) {
				const parent = shippingAmountAwayEl.parentElement;
				parent.innerHTML =
					'<p style="font-weight: 500; color: #000;">You have free shipping!</p>';
				if (shippingProgressBar) shippingProgressBar.style.width = "100%";
			}
		} else if (shippingAmountAwayEl) {
			const parent = shippingAmountAwayEl.parentElement;
			if (!parent.querySelector(".shipping-amount-away")) {
				parent.innerHTML = `<p>You are <span class="shipping-amount-away">$${amountAway.toFixed(
					2
				)}</span> away from free shipping.</p>
                           <div class="progress-bar-container">
                             <div class="progress-bar" style="width: ${
																(subtotal / FREE_SHIPPING_THRESHOLD) * 100
															}%;"></div>
                           </div>`;
			} else {
				shippingAmountAwayEl.textContent = `$${amountAway.toFixed(2)}`;
				if (shippingProgressBar)
					shippingProgressBar.style.width = `${
						(subtotal / FREE_SHIPPING_THRESHOLD) * 100
					}%`;
			}
		}
	};

	const addItemToCart = (product) => {
		const existingItem = cartItems.find((item) => item.id === product.id);
		if (existingItem) {
			existingItem.quantity++;
		} else {
			cartItems.push({ ...product, quantity: 1 });
		}
		renderCart();
		openCart();
	};

	const updateQuantity = (productId, action) => {
		const itemIndex = cartItems.findIndex((item) => item.id === productId);
		if (itemIndex === -1) return;

		if (action === "increase") {
			cartItems[itemIndex].quantity++;
		} else if (action === "decrease") {
			cartItems[itemIndex].quantity--;
			if (cartItems[itemIndex].quantity <= 0) {
				cartItems.splice(itemIndex, 1);
			}
		}
		renderCart();
	};

	const removeItem = (productId) => {
		cartItems = cartItems.filter((item) => item.id !== productId);
		renderCart();
	};

	cartIcons.forEach((icon) => {
		icon.addEventListener("click", (e) => {
			e.preventDefault();
			openCart();
		});
	});

	if (closeCartButton) closeCartButton.addEventListener("click", closeCart);
	if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

	addToCartButtons.forEach((button) => {
		button.addEventListener("click", (e) => {
			const card = e.target.closest(".product-card, .bundle-card");
			if (!card) return;

			const product = {
				id: card.dataset.productId || card.dataset.id,
				name: card.dataset.productTitle || card.dataset.name,
				price: parseFloat(card.dataset.price || card.dataset.productPrice),
				image: card.dataset.productImage || card.dataset.image,
			};
			addItemToCart(product);
		});
	});

	if (cartItemsContainer) {
		cartItemsContainer.addEventListener("click", (e) => {
			const target = e.target;
			const cartItem = target.closest(".cart-item");
			if (!cartItem) return;

			const productId = cartItem.dataset.id;

			if (target.matches(".quantity-btn")) {
				updateQuantity(productId, target.dataset.action);
			} else if (target.matches(".remove-item-btn")) {
				removeItem(productId);
			}
		});
	}

	renderCart();

	// Search Modal
	const searchModal = document.getElementById("predictive-search-modal");
	if (!searchModal) return;

	const searchToggles = document.querySelectorAll(".search-toggle");
	const searchCloseBtn = document.getElementById("predictive-search-close-btn");
	const searchOverlay = document.getElementById("predictive-search-overlay");
	const searchInput = document.getElementById("predictive-search-input");

	const openSearch = () => {
		searchModal.classList.add("active");
		searchModal.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";
		setTimeout(() => {
			searchInput.focus();
		}, 50);
	};

	const closeSearch = () => {
		searchModal.classList.remove("active");
		searchModal.setAttribute("aria-hidden", "true");
		document.body.style.overflow = "";
	};

	searchToggles.forEach((toggle) => {
		toggle.addEventListener("click", (event) => {
			event.preventDefault();
			openSearch();
		});
	});

	searchCloseBtn.addEventListener("click", closeSearch);
	searchOverlay.addEventListener("click", closeSearch);

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && searchModal.classList.contains("active")) {
			closeSearch();
		}
	});
});
