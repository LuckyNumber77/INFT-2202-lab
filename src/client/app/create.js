document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("product-form");
    const productService = new ProductService();
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get("edit");

    if (editIndex !== null) {
        document.querySelector("h2").textContent = "Edit Product";
        document.getElementById("submit-btn").textContent = "Update Product";

        const products = productService.getProducts();
        const product = products[editIndex];

        if (product) {
            document.getElementById("product-name").value = product.name;
            document.getElementById("product-price").value = Math.abs(parseFloat(product.price.replace("$", ""))).toFixed(2); 
            document.getElementById("product-stock").value = product.stock;
            document.getElementById("product-desc").value = product.description;
            document.getElementById("product-image").value = product.image;
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const productName = document.getElementById("product-name").value.trim();
        let productPrice = document.getElementById("product-price").value;
        const productStock = document.getElementById("product-stock").value;
        const productDesc = document.getElementById("product-desc").value.trim();
        const productImage = document.getElementById("product-image").value.trim();

        // Ensure price is a valid number, positive, and formatted correctly
        productPrice = parseFloat(productPrice);
        if (isNaN(productPrice) || productPrice <= 0) {
            document.getElementById("error-message").innerHTML = "Price must be a valid positive number.";
            document.getElementById("error-message").style.color = "red";
            return;
        }
        productPrice = `$${productPrice.toFixed(2)}`;

        if (!productName || !productPrice || !productStock || !productDesc) {
            document.getElementById("error-message").innerHTML = "Please fill out all required fields.";
            document.getElementById("error-message").style.color = "red";
            return;
        }

        const newProduct = new Product(
            productName,
            productPrice,
            productStock,
            productDesc,
            productImage || "img/default.png"
        );

        if (editIndex !== null) {
            productService.updateProduct(editIndex, newProduct);
        } else {
            productService.addProduct(newProduct);
        }

        window.location.href = "search.html";
    });
});
