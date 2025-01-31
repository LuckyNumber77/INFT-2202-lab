// Developer: Darren Billy
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("product-form");
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get("edit");

    if (editIndex !== null) {
        // Load product details for editing
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products[editIndex];

        if (product) {
            document.getElementById("product-name").value = product.name;
            document.getElementById("product-price").value = product.price.replace("$", "");
            document.getElementById("product-desc").value = product.description;
            document.getElementById("product-image").value = product.image;
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const productName = document.getElementById("product-name").value.trim();
        const productPrice = document.getElementById("product-price").value;
        const productDesc = document.getElementById("product-desc").value.trim();
        const productImage = document.getElementById("product-image").value.trim();

        if (!productName || !productPrice || !productDesc) {
            alert("Please fill out all required fields.");
            return;
        }

        let products = JSON.parse(localStorage.getItem("products")) || [];
        const newProduct = {
            name: productName,
            price: `$${parseFloat(productPrice).toFixed(2)}`,
            description: productDesc,
            image: productImage || "img/default.png"
        };

        if (editIndex !== null) {
            // Update existing product
            products[editIndex] = newProduct;
            alert("Product updated successfully!");
        } else {
            // Add new product
            products.push(newProduct);
            alert("Product added successfully!");
        }

        localStorage.setItem("products", JSON.stringify(products));
        window.location.href = "search.html"; // Redirect after submission
    });
});
