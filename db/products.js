const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Assuming you store the filename or URL of the image
        required: false, // Set to true if an image is required for each product
    },
});

const Product = mongoose.model('Product', ProductsSchema);

module.exports = Product;
