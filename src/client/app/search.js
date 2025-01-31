// Developer: Darren Billy
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const resultsList = document.getElementById("search-results");
    const cartSummary = document.getElementById("cart-summary");
    const errorDiv = document.getElementById("error-message");
    const productService = new ProductService();

    const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
    const modalMessage = document.getElementById("modal-message");
    const confirmActionBtn = document.getElementById("confirm-action-btn");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let actionType = ""; // "delete" or "edit"
    let actionIndex = null; // Stores product index for actions

    function displayProducts(products) {
        resultsList.innerHTML = "";

        if (products.length === 0) {
            resultsList.innerHTML = "<p class='text-center text-muted'>No products found.</p>";
            return;
        }

        products.forEach((product, index) => {
            const listItem = document.createElement("div");
            listItem.classList.add("card", "p-3", "mb-3", "shadow-sm");

            let formattedPrice = parseFloat(product.price.replace("$", ""));
            formattedPrice = isNaN(formattedPrice) || formattedPrice < 0 ? 0 : `$${formattedPrice.toFixed(2)}`;

            listItem.innerHTML = `
                <h5 class="fw-bold">${product.name}</h5>
                <p class="mb-1">Price: <strong>${formattedPrice}</strong></p>
                <p class="text-muted">${product.description}</p>
                <button class="add-to-cart btn btn-success btn-sm w-100 mt-2" data-index="${index}">Add to Cart</button>
                <button class="edit-btn btn btn-warning btn-sm w-100 mt-2" data-index="${index}">Edit</button>
                <button class="delete-btn btn btn-danger btn-sm w-100 mt-2" data-index="${index}">Delete</button>
            `;

            resultsList.appendChild(listItem);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll(".add-to-cart").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                addToCart(productService.getProducts()[index]);
            });
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                actionIndex = e.target.getAttribute("data-index");
                actionType = "edit";
                modalMessage.textContent = `Are you sure you want to edit "${productService.getProducts()[actionIndex].name}"?`;
                confirmModal.show();
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                actionIndex = e.target.getAttribute("data-index");
                actionType = "delete";
                modalMessage.textContent = `Are you sure you want to delete "${productService.getProducts()[actionIndex].name}"?`;
                confirmModal.show();
            });
        });
    }

    function addToCart(product) {
        if (!product) return;

        let existingProduct = cart.find(p => p.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
        updateCartDisplay();
    }

    function updateCartDisplay() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            cartSummary.innerHTML = "<p class='text-muted text-center'>No items in cart.</p>";
            return;
        }

        let total = 0;
        cartSummary.innerHTML = `<ul class="list-group">`;

        cart.forEach(product => {
            let productTotal = parseFloat(product.price.replace("$", "")) * product.quantity;
            total += productTotal;

            cartSummary.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${product.name}</strong> (x${product.quantity})
                        <br>
                        <small class="text-muted">$${parseFloat(product.price.replace("$", "")).toFixed(2)} each</small>
                    </div>
                    <button class="remove-from-cart btn btn-outline-danger btn-sm" data-name="${product.name}">❌ Remove</button>
                </li>
            `;
        });

        cartSummary.innerHTML += `</ul>
            <div class="mt-3 text-center">
                <h5><strong>Total: $${total.toFixed(2)}</strong></h5>
                <button class="btn btn-primary w-100 mt-2" id="checkout-btn">Checkout</button>
            </div>
        `;

        document.querySelectorAll(".remove-from-cart").forEach(btn => {
            btn.addEventListener("click", (e) => {
                removeFromCart(e.target.getAttribute("data-name"));
            });
        });

        document.getElementById("checkout-btn").addEventListener("click", () => {
            alert("Checkout functionality coming soon!");
        });
    }

    function removeFromCart(productName) {
        cart = cart.filter(product => product.name !== productName);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    }

    confirmActionBtn.addEventListener("click", () => {
        if (actionType === "delete" && actionIndex !== null) {
            productService.deleteProduct(actionIndex);
            displayProducts(productService.getProducts());
            alert("Product successfully deleted!");
        } else if (actionType === "edit" && actionIndex !== null) {
            window.location.href = `create.html?edit=${actionIndex}`;
        }
        confirmModal.hide();
    });

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query === "") {
            errorDiv.innerHTML = "Please enter a product name to search.";
            errorDiv.style.color = "red";
            return;
        }
        const results = productService.getProducts().filter(product =>
            product.name.toLowerCase().includes(query)
        );
        displayProducts(results);
    });

    displayProducts(productService.getProducts());
    updateCartDisplay();
});
