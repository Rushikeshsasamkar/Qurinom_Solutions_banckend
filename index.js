const express = require('express');
const app = express();
const port = 8000;
const connectDB = require('./db/dbConnection')
const User = require('./db/user');
const cors = require('cors');
const Product = require('./db/products');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });




// Middleware for parsing json

app.use('/uploads', express.static('uploads'));
app.use(express.json());
// registration

// Enable cord
app.use(cors());



const authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'Registration sucessful' })
    }
    catch (err) {
        res.status(500).json({ err: "registration failed" });
    }
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for storing uploaded images
    },
    filename: function (req, file, cb) {
      // Use the original name of the file as the new filename
      cb(null, file.originalname);
    },
  });
  
  
  
  app.post('/addproduct', upload.single('image'), async (req, res) => {
    try {
      const { title, description, price } = req.body;
      const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image
  
      const product = new Product({ title, description, price, image });
      await product.save();
  
      res.status(201).json({ message: 'Product Added!' });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.title) {
        // Duplicate key error (E11000) for 'title' field
        res.status(400).json({ err: 'Product with this title already exists.' });
      } else {
        // Other errors
        res.status(500).json({ err: 'Failed to add new Product' });
      }
    }
  });


app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Set the destination folder for temporary file storage

app.put('/editproduct/:id', upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, price } = req.body;
    const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    product.title = title;
    product.description = description;
    product.price = price;
    if (image) {
      product.image = image; // Update the image field only if a new image is uploaded
    }

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.put('/updateprofile/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const { username,password } = req.body;

        // Find the product by ID
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update product fields
        user.username = username;
        user.password = password;
      
        // Save the updated product
        await user.save();

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Add this route after your other routes
app.delete('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove the product
        await Product.deleteOne({ _id: productId });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
  

app.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    console.log('Fetching product with ID:', productId);
  
    try {
      // Your logic to fetch the product from the database
      const product = await Product.findById(productId);
      console.log('Product details:', product);
  
      // Send the product in the response
      res.json(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Update User Profile Route
  
  

  

connectDB();

app.listen(port, () => {
    console.log("Server is listening port no 8000");
});

// for login



app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check username and password in the database (replace this with your database logic)
  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });

  res.json({ success: true, token });
});




