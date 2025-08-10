# Mebius Client

This repository contains the frontend code for the **Mebius eCommerce** project. The project is built using React with modern web technologies to provide a seamless and secure shopping experience for users.

## Features

### **E-commerce Core**

- **Product Catalog**: Browse products with categories, search, and filtering
- **Shopping Cart**: Persistent cart with real-time quantity updates and management
- **Wishlist System**: Save favorite products for later purchase
- **Order Management**: Complete order lifecycle with tracking and history

### **Payment Gateway Integration**

- **Stripe Payment Processing**: Secure credit/debit card payments
- **COD (Cash on Delivery)**: Alternative payment method
- **Payment Success Flow**: Order confirmation and tracking
- **Secure Checkout**: PCI-compliant payment processing

### **User Experience**

- **Responsive Design**: Mobile-first design for all devices
- **Modern UI/UX**: Enhanced home page, shop page, and cart interface
- **User Authentication**: Clerk-based authentication system
- **Order Tracking**: Real-time order status and delivery updates

### **Advanced Features**

- **Product Reviews**: User-generated ratings and feedback system
- **Shipping Management**: Address collection and validation
- **Real-time Updates**: Live cart and order status changes
- **Search & Filtering**: Advanced product discovery

## Technologies Used

- **React 18** with modern hooks and functional components
- **Redux Toolkit** with RTK Query for state management
- **React Router v6** for navigation and routing
- **Tailwind CSS** for responsive and modern styling
- **Clerk** for authentication and user management
- **Stripe.js** for secure payment processing
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (see backend README)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/DLSNemsara/mebius-frontend.git
   ```

2. **Navigate to the project directory:**

   ```sh
   cd mebius-frontend
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_API_BASE_URL=https://mebius-backend-sinel.onrender.com/api
   ```

5. **Start the development server:**

   ```sh
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Environment Configuration

### Development

- Uses localhost backend for development
- Local Clerk and Stripe keys for testing

### Production

- Deployed on Netlify
- Connected to deployed backend on Render
- Production Clerk and Stripe keys

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── lib/                # Utilities and configurations
│   ├── features/       # Redux slices
│   └── api.js         # API configuration
├── hooks/              # Custom React hooks
└── styles/             # Global styles and CSS
```

## Authentication

The application uses **Clerk** for user authentication:

- Secure sign-up and sign-in
- Protected routes and API endpoints
- User session management
- Profile and account settings

## Payment Processing

**Stripe** integration provides:

- Secure payment processing
- Multiple payment methods
- PCI compliance
- Webhook handling for payment updates

## Deployment

The frontend is deployed on **Netlify**:

- Automatic deployments from main branch
- Environment variable configuration
- CDN distribution for global performance

## Backend Repository

The backend code for this project can be found in the [mebius-backend repository](https://github.com/DLSNemsara/mebius-backend).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

For any inquiries or feedback, please contact us at [sinelnemsara19@gmail.com](mailto:sinelnemsara19@gmail.com).

---

**Mebius** - Modern E-commerce Platform

