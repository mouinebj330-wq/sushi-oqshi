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
function openCheckout() {
    document.getElementById("checkout-modal").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}
document.addEventListener("change", function(event) {
    if (event.target.name === "delivery") {
        const isPickup = event.target.value === "pickup";

        document.getElementById("pickup-address").style.display =
            isPickup ? "block" : "none"

        document.getElementById("delivery-address").style.display =
            isPickup ? "none" : "block"
    }
});

document.addEventListener("DOMContentLoaded", function (){
    const phone = document.getElementById("customer-phone");

    if (phone) {
        phone.addEventListener("input", function () {
            let digits = this.value.replace(/\D/g, "");

            if (digits.startsWith("7")) {
                digits = digits.slice(1);
            }
            if (digits.startsWith("8")) {
                digits = digits.slice(1);
            }
            this.value = digits.slice(0, 10);
        });
    }

    const name = document.getElementById("customer-name");

    if (name) {
        name.addEventListener("input", function () {
            let value = this.value.replace(/[^А-Яа-яЁёA-Za-z\s-]/g, "");

            if (value.length > 0) {
                value = value.charAt(0).toLocaleUpperCase() + value.slice(1);
            }
            this.value = value;
        });
    }
});

function confirmOrder() {
    const nameInput = document.getElementById("customer-name")
    const phoneInput = document.getElementById("customer-phone")
    const addressInput = document.getElementById("customer-address")
    const commentInput = document.getElementById("customer-comment")

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const comment = commentInput ? commentInput.value.trim() : "";

    const deliveryOption = document.querySelector(
        `input[name="delivery"]:checked`
    );
    if (!name) {
        alert("Пожалуйста, введите ваше имя");
        nameInput.focus();
        return;
    }
    if (!/^[А-Яа-яЁёA-Za-z\s-]+$/.test(name)) {
        alert("Имя должно содержать только русские или английские буквы");
        nameInput.focus();
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        alert("Введите 10 цифр номера телефона");
        phoneInput.focus();
        return;
    }
    if (!deliveryOption) {
        alert("Выберите способ получения заказа");
        return;
    }

    const isDelivery = deliveryOption.value === "delivery";
    const address = isDelivery
        ? (addressInput ? addressInput.value.trim() : "")
        : "Самовывоз: Г. Киров, УЛ. Воровского, Д. 55, 610027"

    if (isDelivery && !address) {
        alert("Пожалуйста, введите адрес доставки");
        addressInput.focus();
        return;
    }
    const cart = getCart();
    
    if (!cart || cart.length === 0) {
        alert("Ваша корзина пуста");
        return;
    }

    let total = 0;
    let orderDetails = "";

    cart.forEach(function (item) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        orderDetails +=
            item.name + " × " + item.quantity + 
            " = " + itemTotal + " ₽\n";
    });

    const fullPhone = "+7" + phone;

    const orderMessage = 
        "НОВЫЙ ЗАКАЗ — СУШИ ОЙШИ\n\n" +
        "Имя: " + name + "\n" +
        "Телефон: " + fullPhone + "\n" +
        "Получение: " + (isDelivery ? "Доставка" : "Самыовывоз") + "\n" +
        "Адрес: " + address + "\n\n" +
        "ЗАКАЗ:\n" + orderDetails +
        "\nИТОГО: " + total + "₽\n\n" +
        "Комментарий: " + (comment || "Нет");
        window.pendingOrderMessage = orderMessage;

        document.getElementById("checkout-modal").style.display = "none";
        document.getElementById("contact-choice").style.display = "flex";
}

function sendOrder(platform) {

    const message = window.pendingOrderMessage;

    if (!message) {
        alert("Не удалось найти данные заказа");
        return;
    }

    const encodedMessage =emcodeURIComponent(message);
        
    const links ={
        telegram:"https://t.me/moxamedxamadi",
        vk:"https://vk.ru/id1097241074",
        max:"https://max.ru/u/f9LHodD0cOJhJaNks5Np6praoIlp3Y6nnxXb6mEKbeoBLgNhwgggdQ9ETCk"
    };
    //  copy order details 
    if (platform === "telegram") {
        window.open(links.telegram, "_balank");
    } else {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(message).then(function (){
                window.open(links[platform], "_blank");
                alert("Заказ скопирован! Вставьте его в чат с нами.");
            }).catch(function () {
                alert("Не удалось скопировать заказ. ПОпробуйте ещё раз.");
            });
        } else {
            window.open(links[platform], "_blank");
            alert("Скупируйте текст заказа из окна оформления заказа и отправьте его нам.");
        }
    }
}