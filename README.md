# Mr. Saffa Ecommerce Website

A full-stack ecommerce website for Mr. Saffa cleaning products built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

### Frontend
- **React.js** with modern hooks and context API
- **Tailwind CSS** for responsive design
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js + Express.js** REST API
- **MongoDB** with Mongoose ODM
- **JWT** authentication for admin
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **Rate limiting** for API protection

### Core Features
- 🛒 **Shopping Cart** with localStorage persistence
- 📱 **Responsive Design** - mobile-first approach
- 🔍 **Product Search & Filtering**
- 📖 **Digital Catalogue** with book-style animation
- 📦 **Order Tracking** system
- 👨‍💼 **Admin Panel** for order management
- 💳 **Payment Options** - COD & Online
- 🚚 **Delivery Management** - Free above ₹300

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React.js, Tailwind CSS, React Router |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Authentication | JWT, Bcrypt |
| State Management | React Context API |
| Styling | Tailwind CSS with custom animations |
| Icons | Lucide React |

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd mr-saffa-ecommerce
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install root dependencies
npm install

# Install server and client dependencies
npm run install-deps
\`\`\`

### 3. Environment Setup
\`\`\`bash
cd server
cp .env.example .env
\`\`\`

Edit the `.env` file with your configuration:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mrsaffa
JWT_SECRET=your_super_secure_jwt_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
\`\`\`

### 4. Database Setup
\`\`\`bash
# Start MongoDB service (if running locally)
# Then seed the database
cd server
npm run seed
\`\`\`

### 5. Create Admin User
\`\`\`bash
# Make a POST request to create admin
curl -X POST http://localhost:5000/api/auth/admin/create \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
\`\`\`

### 6. Start Development Servers
\`\`\`bash
# From root directory - starts both client and server
npm run dev
\`\`\`

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

\`\`\`
mr-saffa-ecommerce/
├── client/                 # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── ProductCard.js
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── OrderTracking.js
│   │   │   ├── Admin.js
│   │   │   └── Catalogue.js
│   │   ├── context/       # React Context
│   │   │   └── CartContext.js
│   │   ├── App.js         # Main App component
│   │   ├── index.js       # Entry point
│   │   ├── App.css        # Custom styles
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Admin.js
│   ├── routes/           # API routes
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── auth.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── seedProducts.js   # Database seeding
│   ├── server.js         # Express server
│   ├── package.json
│   └── .env.example
├── package.json          # Root package.json
└── README.md
\`\`\`

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/meta/categories` - Get product categories

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:orderNumber` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin only)
- `GET /api/orders/stats/dashboard` - Get order statistics (admin only)

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/create` - Create admin user
- `GET /api/auth/admin/verify` - Verify admin token
- `PUT /api/auth/admin/change-password` - Change admin password

## 🏪 Business Information

- **Service Area**: Hanumangarh (PIN: 335513, 335512)
- **Delivery**: Free delivery on orders above ₹300, ₹40 below
- **Payment Methods**: Cash on Delivery (COD) + Online Payment
- **Operating Hours**: 9 AM - 8 PM
- **Contact**: +91 98765 43210

## 🧹 Product Categories

1. **Bathroom Care** - Toilet cleaner, Bathroom cleaner, Tile cleaner
2. **Kitchen Care** - Dish wash, Dish wash 5L
3. **Floor Care** - Phenyl, Floor disinfectant, Black floor disinfectant, Floor cleaner
4. **Hand Care** - Hand wash, Hand wash refill
5. **General Cleaning** - Namak tejab, Lisapol, Glass cleaner, Liquid detergent

## 👨‍💼 Admin Panel

Access the admin panel at `/admin` with default credentials:
- **Username**: admin
- **Password**: admin123

### Admin Features:
- 📊 Dashboard with order statistics
- 📋 View and manage all orders
- 🔄 Update order status
- 👥 Customer information management
- 📈 Revenue tracking

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the build folder to your hosting service

### Backend (Railway/Heroku)
1. Set environment variables in your hosting service
2. Deploy the server folder

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Whitelist your server IP addresses

## 🔒 Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **JWT** authentication for admin routes
- **Password hashing** with bcrypt
- **Input validation** and sanitization
- **CORS** configuration

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages
- **Accessibility** - ARIA labels and keyboard navigation
- **Animations** - Smooth transitions and hover effects
- **Toast Notifications** - Real-time feedback

## 🧪 Testing

\`\`\`bash
# Run client tests
cd client
npm test

# Run server tests (if implemented)
cd server
npm test
\`\`\`

## 📝 Scripts

\`\`\`bash
# Development
npm run dev          # Start both client and server
npm run client       # Start only client
npm run server       # Start only server

# Production
npm run build        # Build client for production
npm start           # Start production server

# Database
npm run seed        # Seed products database

# Dependencies
npm run install-deps # Install all dependencies
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:
- **Email**: info@mrsaffa.com
- **Phone**: +91 98765 43210
- **Address**: Hanumangarh, Rajasthan

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the flexible database
- **Express.js** for the web framework
- **Lucide** for the beautiful icons

---

**Made with ❤️ for Mr. Saffa Cleaning Products**
