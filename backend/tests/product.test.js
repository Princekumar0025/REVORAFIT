const request = require('supertest');
const express = require('express');
const Product = require('../models/Product');
const productRoutes = require('../routes/productRoutes');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Product Controller White-Box Tests', () => {
  const sampleProduct = {
    name: 'Test Dumbbell',
    slug: 'test-dumbbell',
    description: 'A dumbbell for testing',
    category: 'fitness',
    price: 1000,
    discountPrice: 800,
    stock: 50
  };

  it('should calculate discountPercent correctly via pre-save hook (White-Box DB Logic Test)', async () => {
    const product = new Product(sampleProduct);
    await product.save();
    
    // Testing the internal Mongoose pre-save hook logic
    expect(product.discountPercent).toBe(20); 
  });

  it('should handle pagination and default sort logic (Controller Logic Test)', async () => {
    await Product.create(sampleProduct);
    
    const res = await request(app).get('/api/products?page=1&limit=5');
    
    // Verify HTTP response
    expect(res.statusCode).toEqual(200);
    
    // Verify internal pagination state
    expect(res.body.products.length).toBe(1);
    expect(res.body.total).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.pages).toBe(1);
  });

  it('should route into the 404 block for non-existent product ID (Error Path Test)', async () => {
    const validButFakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/products/${validButFakeId}`);
    
    // Verifying it successfully hits the specific `if (!product)` branch
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Product not found');
  });

  it('should resolve product by slug (Dynamic Query Path Test)', async () => {
    await Product.create(sampleProduct);
    
    // The controller should detect this is not a 24-char hex string and query by slug
    const res = await request(app).get(`/api/products/${sampleProduct.slug}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.slug).toBe(sampleProduct.slug);
  });
});
