# AWS EC2 Ubuntu Deployment Guide: RevoraFit

This guide contains the step-by-step commands you need to execute on your AWS Ubuntu EC2 instance to deploy your Next.js frontend and Express backend.

## Prerequisites
1. An AWS EC2 instance running Ubuntu.
2. HTTP (Port 80) and HTTPS (Port 443) opened in your AWS Security Group.
3. SSH into your EC2 instance.

---

## Step 1: Install Node.js, NPM, PM2, and Nginx

Run these commands one by one to install the necessary software on your server:

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Node.js (Version 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager) globally
sudo npm install pm2 -g

# Install Nginx (Web Server / Reverse Proxy)
sudo apt install -y nginx
```

---

## Step 2: Clone Your Project and Install Dependencies

Assuming you have pushed your project to a Git repository (like GitHub):

```bash
# Clone your repository (replace with your actual repo URL)
git clone https://github.com/your-username/revorafit.git
cd revorafit

# Install Backend Dependencies
cd backend
npm install
cd ..

# Install Frontend Dependencies and Build Next.js
cd frontend
npm install
npm run build
cd ..
```

---

## Step 3: Setup Environment Variables

You must recreate your `.env` files on the server because they are typically ignored by Git.

```bash
# Create Backend .env
nano backend/.env
```
*Paste your backend environment variables (MONGODB_URI, RAZORPAY_KEY, JWT_SECRET, etc.) then press `Ctrl+X`, `Y`, and `Enter`.*

```bash
# Create Frontend .env.local
nano frontend/.env.local
```
*Paste your frontend environment variables (NEXT_PUBLIC_API_URL=http://localhost:5000, etc.) then save.*

---

## Step 4: Start the Servers with PM2

Because we created the `ecosystem.config.js` file, starting both servers is incredibly simple:

```bash
# Start both frontend and backend
pm2 start ecosystem.config.js

# Save the PM2 list so it automatically restarts on server reboot
pm2 save
pm2 startup
# (Run the command PM2 outputs after typing pm2 startup)
```

---

## Step 5: Configure Nginx Reverse Proxy

We need to configure Nginx so that when users visit your server's IP address (or domain name on Port 80), it correctly routes traffic to your Next.js app (Port 3000) and your API requests to your Express app (Port 5000).

```bash
# Open the default Nginx config file
sudo nano /etc/nginx/sites-available/default
```

**Replace the entire contents of that file with the following:**
*(Note: If you have a domain name, replace `_` with `yourdomain.com` in server_name)*

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _; # Replace with your domain name if you have one

    # Route /api/ traffic to the Express Backend (Port 5000)
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Route all other traffic to the Next.js Frontend (Port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit (`Ctrl+X`, `Y`, `Enter`).

```bash
# Test Nginx configuration for syntax errors
sudo nginx -t

# Restart Nginx to apply changes
sudo systemctl restart nginx
```

---

## Done! 🎉
Your application should now be live on your AWS EC2 Public IPv4 address!
If you ever need to view your server logs, you can run: `pm2 logs`
