# REVORAFIT — E-Commerce Platform

> **Recover • Rehab • Perform**

A complete premium D2C e-commerce platform for fitness, physiotherapy & medical equipment.

## 🚀 Quick Start

### 1. Configure Environment Variables

Edit `.env.local` and fill in your actual credentials:

```env
# MongoDB Atlas — Create a free cluster at mongodb.com/atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/revorafit

# NextAuth secret — Any random string
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# Razorpay — Get from razorpay.com/dashboard
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx

# Cloudinary — Get from cloudinary.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 2. Install Dependencies & Run

```bash
npm install
npm run dev
```

### 3. Seed Database

Visit: http://localhost:3000/api/seed

This creates:
- **8 sample products** (fitness, physiotherapy, medical)
- **Admin user**: `admin@revorafit.com` / `Admin@123456`

### 4. Admin Panel

Visit: http://localhost:3000/admin

Login with admin credentials to manage:
- Products (add/edit/delete + image upload)
- Orders (view/update status)
- Coupons (create discount codes)
- Banners (homepage banners)
- Users (block/unblock)
- Analytics dashboard

## 📁 Project Structure

```
revorafit/
├── app/
│   ├── page.js              # Home page
│   ├── shop/                # Shop pages
│   ├── product/[slug]/      # Product detail
│   ├── cart/                # Cart page
│   ├── checkout/            # Checkout + Razorpay
│   ├── order/[id]/          # Order confirmation
│   ├── wishlist/            # Wishlist page
│   ├── auth/                # Login/Register
│   ├── admin/               # Admin panel
│   └── api/                 # All API routes
├── components/              # Reusable UI components
├── context/                 # Cart & Wishlist state
├── lib/
│   ├── mongodb.js           # DB connection
│   └── models/              # Mongoose models
└── public/                  # Static assets
```

## 💳 Payment

- **Razorpay** for UPI, Cards, NetBanking, Wallets
- **Cash on Delivery** (COD)
- Test mode — use Razorpay test cards

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import to vercel.com
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🔑 Default Admin

- Email: `admin@revorafit.com`
- Password: `Admin@123456`
- **Change this immediately in production!**
