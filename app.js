// Selecting necessary elements
const listProductHTML = document.querySelector('.listProduct');
const listCartHTML = document.querySelector('.listCart');
const iconCart = document.querySelector('.icon-cart');
const iconCartSpan = document.querySelector('.icon-cart span');
const body = document.querySelector('body');
const checkoutForm = document.getElementById('checkoutForm');
let products = [];
let cart = [];

// Function to toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Function to close cart
checkoutForm.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Function to add product data to HTML
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

// Function to add product to cart
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Function to add product to cart logic
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

// Function to add cart data to local storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Function to update cart display
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

// Function to change quantity of items in cart
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

// Function to change quantity of items in cart logic
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

// Function to initialize the application
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

// Event listener for form submission
checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Get form data
    const formData = {
        name: checkoutForm.elements['name'].value,
        email: checkoutForm.elements['email'].value,
        address: checkoutForm.elements['address'].value,
        cartData: cart.map(item => {
            const product = products.find(prod => prod.id === item.product_id);
            return {
                name: product ? product.name : "Product Name Not Found", // Handle potential undefined product
                price: product ? product.price : 0, // Handle potential undefined product
                quantity: item.quantity
            };
        })
    };
    // Send email with form data
    sendEmail(formData);
});

// Function to send email with form data
const sendEmail = (formData) => {
    // Example of sending email using fetch API
    fetch('https://formsubmit.co/3cdb01eb17a7bba740571f146ae9b9c0', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        console.log('Email sent successfully');
        // Optionally, you can perform additional actions after successful email sending
    })
    .catch(error => {
        console.error('Error sending email:', error.message);
        // Optionally, you can handle errors or display error messages to the user
    });
};


// Initialize the application
initApp();
