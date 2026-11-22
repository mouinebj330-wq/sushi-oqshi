function getCart() {
    return JSON.parse(localStorage.getItem("sushiCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("sushiCart", JSON.stringify(cart));
}

function addToCart(name, price) {
    let cart = getCart();

    let item = cart.find(product => product.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);
    renderCart();
}

function changeQuantity(index, amount) {
    let cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}

function removeItem(index) {
    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);
    renderCart();
}

function renderCart() {
    let cart = getCart();

    let cartSection = document.querySelector(".cart-section");
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    if (!cartSection || !cartItems || !cartTotal) return;

    // إظهار السلة فقط عندما تحتوي على منتجات
    cartSection.style.display = cart.length > 0 ? "block" : "none";

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>${item.price} ₽ × ${item.quantity}</p>

                <button onclick="changeQuantity(${index}, -1)">−</button>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button onclick="removeItem(${index})">Удалить</button>
            </div>
        `;
    });

    cartTotal.textContent = total;
}


document.addEventListener("DOMContentLoaded", renderCart);

function changeProductQuantity(name, price, amount) {
    let cart = getCart();
    let item = cart.find(product => product.name === name);

    if (amount > 0) {
        if (item) {
            item.quantity++;
        } else {
            cart.push ({
                name: name,
                price: price,
                quantity: 1
            });
        }
    } else if (item) {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.name !== name);
        }
    }

    saveCart(cart);
    renderCart();
    
    let quantityElement = document.querySelector(
        `[data-product-name="${name}"]`
    );

    if (quantityElement) {
        let updatedCart = getCart();
        let updatedItem = updatedCart.find(product => product.name === name);
        quantityElement.textContent = updatedItem ? updatedItem.quantity : 0;
    }
}
