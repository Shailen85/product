let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let checkoutForm = document.getElementById('checkoutForm');
let products = [];
let cart = [];

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Close cart
checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    body.classList.toggle('showCart');
});

// Add product data to HTML
const addDataToHTML = () => {
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
                `<div class="product" onclick="showDetails('${product.id}')">
                    <img src="${product.image}" alt="">
                    <h2>${product.name}</h2>
                    <p>R${product.price}</p>
                </div>
                <div class="product-details" id='${product.id}'>
                    <h4>Item:${product.items}</h4>
                    <p>Color:${product.color}</p>
                    <p>Size:${product.size}</p>
                    <p style="font-size: smaller;">${product.info}</p>
                </div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Add product to cart
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Add product to cart logic
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
};

// Add cart data to local storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Update cart display
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="cartTab">
            <h1>Shopping Cart</h1>
            <form id="checkoutForm" target="_blank" action="https://formsubmit.co/your@email.com" method="POST">
                <!-- Include input fields for name, email, address, etc. -->
                <input type="text" name="name" placeholder="Name">
                <input type="email" name="email" placeholder="Email">
                <input type="text" name="address" placeholder="Address">
                <!-- Hidden input field to store cart details -->
                <input type="hidden" name="cart_data" id="cartData">
                <div class="listCart">
                    <div class="item">
                        <div class="image">
                            <img src="${info.image}" alt="">
                        </div>
                        <div class="name">
                        ${info.name}
                        </div>
                        <div class="totalPrice">
                        ${info.price * item.quantity}
                        </div>
                        <div class="quantity">
                            <span class=${type.minus}"><</span>
                            <span>${item.quantity}</span>
                            <span class="${type.plus}">></span>
                        </div>
                    </div>
                </div>
                <div class="btn">
                    <button class="close">CLOSE</button>
                    <button type="submit" class="checkOut">Submit</button>
                </div>
            </form>
        </div>
                // <div class="image">
                //     <img src="${info.image}">
                // </div>
                // <div class="name">
                //     ${info.name}
                // </div>
                // <div class="totalPrice">$${info.price * item.quantity}</div>
                // <div class="quantity">
                //     <span class="${type.minus}"><</span>
                //     <span>${item.quantity}</span>
                //     <span class="${type.plus}">></span>
                // </div>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

// Change quantity of items in cart
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
});

// Change quantity of items in cart logic
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// Initialize the application
const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
};

initApp();
