// product.mock.service.js
class ProductService {
    constructor() {
        this.products = JSON.parse(localStorage.getItem("products")) || [];
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        this.products.push(product);
        localStorage.setItem("products", JSON.stringify(this.products));
    }

    updateProduct(index, updatedProduct) {
        if (index >= 0 && index < this.products.length) {
            this.products[index] = updatedProduct;
            localStorage.setItem("products", JSON.stringify(this.products));
        }
    }

    deleteProduct(index) {
        this.products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(this.products));
    }
}

// Ensure ProductService is globally accessible
window.ProductService = ProductService;
