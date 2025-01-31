// Developer: Darren Billy
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const resultsList = document.getElementById("search-results");

    function displayProducts(products) {
        resultsList.innerHTML = ""; // Clear previous results

        if (products.length > 0) {
            products.forEach((product, index) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <strong>${product.name}</strong> - ${product.price}<br>
                    ${product.description} <br>
                    <button class="edit-btn btn btn-warning btn-sm" data-index="${index}">Edit</button>
                    <button class="delete-btn btn btn-danger btn-sm" data-index="${index}">Delete</button>
                `;
                resultsList.appendChild(listItem);
            });
        } else {
            resultsList.innerHTML = "<li>No products found.</li>";
        }

        // Attach event listeners to edit & delete buttons
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                editProduct(index);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                deleteProduct(index);
            });
        });
    }

    function editProduct(index) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products[index];

        if (!product) return;

        // Redirect to the create page with product details
        window.location.href = `create.html?edit=${index}`;
    }

    function deleteProduct(index) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products.splice(index, 1); // Remove the selected product
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts(products); // Refresh the list
    }

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();

        if (query === "") {
            alert("Please enter a product name to search.");
            return;
        }

        let products = JSON.parse(localStorage.getItem("products")) || [];
        const results = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );

        displayProducts(results);
    });

    // Display all products on page load
    displayProducts(JSON.parse(localStorage.getItem("products")) || []);
});
