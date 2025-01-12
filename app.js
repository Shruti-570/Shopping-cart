function fetchProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            ProductUI.displayProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));
}


const ProductUI = {
    displayProducts(products) {
        const productList = document.querySelector('.productList');
        productList.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('item');

            productItem.innerHTML = `
                <img src="${product.Image}" alt="${product.Name}">
                <h3 class="productName">${product.Name}</h3>
                <p class="productDescription">${product.Description}</p>
                <div class="price">${product.Price}</div>
                <button onclick="Cart.addToCart(${product.id}, '${product.Name}', ${Number(product.Price.slice(1).replace(',', ''))})">Add to Cart</button>
            `;

            productList.appendChild(productItem);
        });
    }
};


const Cart = {
    items: [],
    promoCodes: {
        ostad10: 0.10,
        ostad5: 0.05
    },
    currentPromoCode: null,
    discount: 0,

    addToCart(productId, productName, productPrice) {
        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
        this.updateCartUI();
    },

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.items = this.items.filter(item => item.id !== productId);
            }
        }
        this.updateCartUI();
    },

    clearCart() {
        this.items = [];
        this.currentPromoCode = null;
        this.discount = 0;
        this.updateCartUI();
    },

    calculateSubtotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    applyPromoCode() {
        const promoCodeInput = document.getElementById('promoCode').value.trim();
        if (this.promoCodes[promoCodeInput]) {
            this.currentPromoCode = promoCodeInput;
            this.discount = this.calculateSubtotal() * this.promoCodes[promoCodeInput];
            this.updateCartUI();
            alert('Promo code applied successfully!');
        } else {
            alert('Invalid promo code!');
        }
    },

    calculateFinalTotal() {
        return this.calculateSubtotal() - this.discount;
    },

    updateCartUI() {
        const subtotalElement = document.getElementById('subtotal');
        const discountElement = document.getElementById('discountAmount');
        const finalTotalElement = document.getElementById('finalTotal');
        const discountSection = document.getElementById('discountSection');

        const subtotal = this.calculateSubtotal();
        subtotalElement.textContent = subtotal.toFixed(2);

        if (this.discount > 0) {
            discountSection.style.display = 'block';
            discountElement.textContent = this.discount.toFixed(2);
        } else {
            discountSection.style.display = 'none';
        }

        finalTotalElement.textContent = this.calculateFinalTotal().toFixed(2);
        CartUI.renderCart(this.items, subtotal);
    }
};


updateQuantity(productId, change) {
    const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.items = this.items.filter(item => item.id !== productId);
            }
        }
    this.updateCartUI();
},

// clear
clearCart() {
        this.items = [];
        this.updateCartUI();
    },


// total

calculateTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    updateCartUI() {
        CartUI.renderCart(this.items, this.calculateTotal());
    }
;


const CartUI = {
    renderCart(items, total) {
        const cartList = document.querySelector('.listCart');
        const totalQuantity = document.querySelector('.totalQ');
        cartList.innerHTML = '';

        items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('item');
            cartItem.innerHTML = `
                <div class="content">
                    <div class="name">${item.name}</div>
                    <div class="price">$${item.price.toFixed(2)} x ${item.quantity} product(s)</div>
                </div>
                <div class="quantity">
                    <button onclick="Cart.updateQuantity(${item.id}, -1)">-</button>
                    <span class="value">${item.quantity}</span>
                    <button onclick="Cart.updateQuantity(${item.id}, 1)">+</button>
                    <p>____________________________________________</p>
                </div>
            `;
            cartList.appendChild(cartItem);
        });

        

        totalQuantity.textContent = items.reduce((sum, item) => sum + item.quantity, 0);
        const checkoutSection = document.querySelector('.checkout');
        checkoutSection.innerHTML = `
            <h3>Total: $${total.toFixed(2)}</h3>
            <button onclick="Cart.clearCart()">Clear Cart</button>
            <button onclick="CartUI.checkoutSummary()">Checkout</button>
        `;
    },

    checkoutSummary() {
        const summary = Cart.items.map(item => `${item.name} x ${item.quantity}`).join('\n');
        const total = Cart.calculateTotal().toFixed(2);
        alert(`Order Summary:\n${summary}\n\nTotal: $${total}`);
    }
};


fetchProducts();
