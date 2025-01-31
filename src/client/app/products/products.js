// Product.js
class Product {
    constructor(name, price, stock, description, image) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.description = description;
        this.image = image || "img/default.png";
    }
}

// Make Product globally accessible
window.Product = Product;
