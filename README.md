# Falcon Store - Modern E-commerce Frontend

A modern, responsive React-based e-commerce frontend built with cutting-edge technologies for an exceptional shopping experience.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse products with advanced filtering and pagination
- **Product Details**: Detailed product pages with image galleries and dynamic attributes
- **Shopping Cart**: Persistent cart with localStorage, real-time updates, and cross-tab synchronization
- **Category Management**: Dynamic category-based product filtering with toggle navigation
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices

### Advanced Features
- **Dynamic Product Variations**: Support for multiple product attributes (size, color, etc.)
- **Real-time Cart Updates**: Live cart count updates across all tabs
- **Toast Notifications**: User-friendly feedback for all actions
- **API Integration**: Full integration with backend REST APIs
- **Slug-based Routing**: SEO-friendly URLs for products and categories
- **Loading States**: Smooth loading indicators for better UX

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Icons**: React Icons (Feather Icons, Heroicons, etc.)
- **Notifications**: React Toastify
- **State Management**: React Hooks
- **Storage**: LocalStorage for cart persistence

## 📁 Project Structure

```
falcon-store/
├── public/
│   └── images/
│       └── logo.png
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation with cart & categories
│   │   └── Footer.jsx          # Footer with payment methods
│   ├── pages/
│   │   ├── Home.jsx           # Homepage
│   │   ├── About.jsx          # About page
│   │   ├── Products.jsx       # Product listing with filters
│   │   ├── ProductDetails.jsx # Individual product page
│   │   └── Cart.jsx           # Shopping cart page
│   ├── assets/
│   ├── App.jsx                # Main app component
│   ├── Layout.jsx             # Layout wrapper
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/falcon-store.git
   cd falcon-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔧 Configuration

### API Endpoints
The application connects to the following API endpoints:
- **Products**: `http://157.230.240.97:9999/api/v1/products`
- **Categories**: `http://157.230.240.97:9999/api/v1/categories`
- **Product Details**: `http://157.230.240.97:9999/api/v1/product/{slug}`

### Environment Variables
Create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_API_BASE_URL=http://157.230.240.97:9999/api/v1
VITE_APP_NAME=Falcon Store
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

## 🛒 Cart Functionality

### Features
- **Persistent Storage**: Cart data persists across browser sessions
- **Real-time Updates**: Cart count updates immediately across all tabs
- **Variation Support**: Handles product variations (size, color, etc.)
- **Stock Management**: Prevents adding out-of-stock items
- **Quantity Controls**: Easy increment/decrement controls

### Cart Data Structure
```javascript
{
  id: "product_variation_id",
  productId: "123",
  variationId: "456",
  name: "Product Name",
  price: "1999",
  quantity: 2,
  selectedAttributes: {
    "Color": "Blue",
    "Size": "Large"
  },
  thumbnail: "image_url",
  available_stock: 10
}
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Onest Font**: Custom typography for brand consistency
- **Toast Notifications**: Non-intrusive user feedback
- **Loading States**: Skeleton loaders and spinners
- **Hover Effects**: Interactive elements with smooth transitions
- **Accessibility**: Semantic HTML and keyboard navigation

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔍 Key Components

### Header Component
- Logo and branding
- Search functionality
- Category navigation with dropdown
- Cart icon with live count
- Mobile-responsive menu

### Product Components
- Product grid with pagination
- Product detail views
- Dynamic attribute selection
- Image galleries with thumbnails

### Cart Component
- Item management (add/remove/update)
- Coupon system
- Checkout integration
- Order summary

## 🌟 Best Practices

- **Component Structure**: Modular, reusable components
- **State Management**: Efficient use of React hooks
- **Performance**: Optimized rendering and lazy loading
- **Error Handling**: Comprehensive error boundaries
- **Code Quality**: ESLint configuration for consistency

## 🚀 Deployment

The application can be deployed to various platforms. **Important**: Since this is a Single Page Application (SPA) with client-side routing, you need to configure your server to serve `index.html` for all routes.

### Quick Deploy (Build First)
```bash
npm run build
```
This creates a `dist` folder with all production files.

### Vercel (Recommended - Zero Config)
```bash
npm install -g vercel
vercel
```
Vercel automatically handles SPA routing - no additional configuration needed.

### Netlify (Automatic SPA Support)
1. `npm run build`
2. Upload `dist` folder to Netlify
3. Netlify automatically detects it's a React app and configures routing

**Or create `public/_redirects` file:**
```
/*    /index.html   200
```

### Apache Server
Create `.htaccess` file in your `dist` folder:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

### Nginx Server
Add to your Nginx configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### GitHub Pages
**Note**: GitHub Pages doesn't support server-side redirects well for SPAs.
For GitHub Pages, consider using hash routing or a service like Vercel/Netlify instead.

### Generic Web Hosting
1. Upload `dist` folder contents to your web root
2. Configure server to serve `index.html` for 404 errors
3. Ensure all routes point to `index.html`

### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf for Docker:**
```nginx
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and Vite teams for excellent development tools
- Tailwind CSS for the utility-first CSS framework
- React Icons for comprehensive icon library
- The open-source community for inspiration and resources

## 📞 Support

For support, email support@falconstore.com or create an issue in this repository.

---

**Built with ❤️ for modern e-commerce experiences**
