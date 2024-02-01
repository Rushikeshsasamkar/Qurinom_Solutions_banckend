const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://rushikeshsasamakar94:y2C56KAAK4mSJc7D@productware.ezpyhlp.mongodb.net/');
        console.log("Connected to mongoDB");
    }

    catch (err) {
        console.log(err);
    }

}

module.exports = connectDB;