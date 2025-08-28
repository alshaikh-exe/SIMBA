# 🔧 Smart Inventory Management and Booking Application (SIMBA)

A comprehensive web application for managing item bookings, inventory, and maintenance in engineering labs, workshops, and makerspaces.

<img width="700" height="700" alt="SIMBA" src="https://github.com/user-attachments/assets/12b6e9d3-c021-4fa9-b947-8b7c126114db" />

## 👥 Team Roles

- **Project Manager & GitHub Manager**: Abdulla Alshaikh - Owned the repository, managed releases, and coordinated merges.
- **Back-End Developer**: Sakeena Sayed Kadhem - Developed core API endpoints and server-side logic.
- **Back-End Developer**: Mohammed Ali Ahmed - Implemented database schemas and authentication services.
- **Front-End Developer**: Fatima Alzaki - Built user interface components and responsive layouts.
- **Front-End Developer & Tester**: Zahraa Busuhail - Conducted quality assurance testing and wrote technical documentation.
- **Front-End & Back-End Developer**: Hamza Mohammed - Created full-stack features integrating front-end and back-end systems.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Role-based access control** (Student, Admin)
- JWT token authentication
- Secure login/logout functionality
- Separate admin and user portals
- Complete item catalog with detailed information
- Item status tracking (Available, Reserved, Maintenance, Out of Order)
- Image upload and display
- Technical specifications management
- Location-based item organization

### 📅 Booking System
- Interactive calendar for availability checking
- Multi-item booking cart
- Approval workflow for restricted item

### 👥 User Management
- Student registration and profile management
- Admin user management
- Department-based user organization
- Booking history and analytics

### 📊 Analytics & Reporting
- Equipment utilization statistics
- Peak time analysis
- Maintenance scheduling and tracking

### 🛠️ Admin Features
- Equipment CRUD operations
- Booking approval/rejection system
- User management
- System configuration
- Advanced analytics dashboard

## 🚀 Tech Stack

### Frontend
- **React** with Vite
- **SCSS Modules** for styling
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing

### Development Tools
- **ESLint** for code quality
- **Vite** for fast development builds
- **Nodemon** for server auto-restart

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIMBA

## 👤 User Roles

### 🎓 Student/User
- Browse item catalog
- Book available item
- View booking history
- Manage personal profile

### 👨‍💻 Admin
- Approve/reject booking requests
- Manage item status
- View analytics and reports
- Handle maintenance scheduling
- Full system access
- User management
- Equipment CRUD operations
- System configuration

## Project Structure
```text
SIMBA/
├── config/
│   ├── aIService.js
│   ├── checkToken.js
│   ├── db.js
│   ├── ensureLoggedIn.js
│   ├── requireRoles.js
│   ├── seedItem.js
│   └── seedLocation.js
├── controllers/
│   └── api/
│       ├── analytics.js
│       ├── calender.js
│       ├── items.js
│       ├── locations.js
│       ├── management.js
│       ├── message.js
│       ├── orders.js
│       └── users.js
├── models/
│   ├── item.js
│   ├── location.js
│   ├── message.js
│   ├── order.js
│   ├── report.js
│   ├── semester.js
│   └── user.js
├── public/
│   ├── vite.svg
│   ├── 80s Computer Gif.gif
│   ├── cccccccc.png
│   ├── react.svg
│   ├── SIMBA.png
│   ├── try.gif
│   └── xxxx.gif
├── routes/
│   └── api/
│       ├── admin.js
│       ├── analytics.js
│       ├── items.js
│       ├── locations.js
│       ├── management.js
│       ├── orders.js
│       ├── roleRoutes.js
│       └── users.js
├── src/
│   ├── assets/
│   │   ├── 80s Computer Gif.gif
│   │   ├── cccccccc.png
│   │   ├── react.svg
│   │   ├── SIMBA.png
│   │   ├── try.gif
│   │   └── xxxx.gif
│   ├── components/
│   │   ├── Alert/
│   │   │   ├── Alert.jsx
│   │   │   └── Alert.module.scss
│   │   ├── Analytics/
│   │   │   ├── Analytics.jsx
│   │   │   └── Analytics.module.scss
│   │   ├── Auth/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminLoginForm/
│   │   │   │   │   ├── AdminLoginForm.jsx
│   │   │   │   │   └── AdminLoginForm.module.scss
│   │   │   │   └── AdminSignupForm/
│   │   │   │       ├── AdminSignupForm.jsx
│   │   │   │       └── AdminSignupForm.module.scss
│   │   │   └── User/
│   │   │       ├── UserLoginForm/
│   │   │       │   ├── UserLoginForm.jsx
│   │   │       │   └── UserLoginForm.module.scss
│   │   │       └── UserSignupForm/
│   │   │           ├── UserSignupForm.jsx
│   │   │           └── UserSignupForm.module.scss
│   │   ├── Booking/
│   │   │   ├── Cart/
│   │   │   │   ├── Cart.jsx
│   │   │   │   └── Cart.module.scss
│   │   │   ├── Orders/
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── Orders.module.scss
│   │   │   └── StudentRequests/
│   │   │       ├── StudentRequests.jsx
│   │   │       └── StudentRequests.module.scss
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.module.scss
│   │   ├── Calendar/
│   │   │   ├── Calendar.jsx
│   │   │   └── Calendar.module.scss
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.module.scss
│   │   ├── Items/
│   │   │   ├── ItemCard.jsx
│   │   │   └── ItemCard.module.scss
│   │   ├── Logo/
│   │   │   ├── Logo.jsx
│   │   │   └── Equipment.module.scss
│   │   ├── Management/
│   │   │   ├── Management.jsx
│   │   │   └── Management.module.scss
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.module.scss
│   │   └── Profile/
│   │       ├── AdminProfile.jsx
│   │       ├── AdminProfile.module.scss
│   │       ├── UserProfile.jsx
│   │       └── UserProfile.module.scss
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Analytics/
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── AnalyticsPage.module.scss
│   │   ├── Auth/
│   │   │   ├── AdminLoginPage/
│   │   │   │   ├── AdminLoginPage.jsx
│   │   │   │   └── AdminLoginPage.module.scss
│   │   │   ├── AdminSignupPage/
│   │   │   │   ├── AdminSignupPage.jsx
│   │   │   │   └── AdminSignupPage.module.scss
│   │   │   └── UserAuthPage/
│   │   │       ├── UserAuthPage.jsx
│   │   │       └── UserAuthPage.module.scss
│   │   ├── Booking/
│   │   │   ├── CartPage/
│   │   │   │   ├── CartPage.jsx
│   │   │   │   └── CartPage.module.scss
│   │   │   ├── OrdersPage/
│   │   │   │   ├── OrdersPage.jsx
│   │   │   │   └── OrdersPage.module.scss
│   │   │   ├── StudentRequestsPage/
│   │   │   │   ├── StudentRequestsPage.jsx
│   │   │   │   └── StudentRequestsPage.module.scss
│   │   │   └── Calendar/
│   │   │       ├── adminCalendar.jsx
│   │   │       └── userCalendar.jsx
│   │   ├── Items/
│   │   │   ├── ItemsCreate/
│   │   │   │   ├── ItemsCreate.jsx
│   │   │   │   └── ItemsCreate.module.scss
│   │   │   ├── ItemsEditPage/
│   │   │   │   ├── ItemsEditPage.jsx
│   │   │   │   └── Items.module.scss
│   │   │   ├── ItemsPage/
│   │   │   │   ├── ItemsPage.jsx
│   │   │   │   └── Items.module.scss
│   │   │   └── ItemsShowPage/
│   │   │       ├── ItemsShow.jsx
│   │   │       └── Items.module.scss
│   │   ├── Management/
│   │   │   └── StockRequest/
│   │   │       ├── StockRequestPage.jsx
│   │   │       └── StockRequestPage.module.scss
│   │   └── Profile/
│   │       └── ProfilePage/
│   │           ├── ProfilePage.jsx
│   │           └── ProfilePage.module.scss
│   ├── router/
│   │   ├── app.jsx
│   │   ├── AppRouter.module.scss
│   │   └── routes.js
│   ├── utilities/
│   │   ├── items-api.js
│   │   ├── location-api.js
│   │   ├── orders-api.js
│   │   ├── requests-api.js
│   │   ├── send-request.js
│   │   ├── users-api.js
│   │   └── users-service.js
│   ├── index.module.scss
│   └── main.jsx
├── .env
├── .gitignore
├── app-server.js
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── server.js
└── vite.config.js
```

## 🎯 Key Components
## Authentication
- `AuthContext.jsx` - Authentication state management
- Admin/User login forms with validation
- Protected route components

## Equipment Management
- `ItemsPage.jsx` - Equipment catalog
- `ItemsEditPage.jsx` - Equipment creation/editing
- `ItemCard.jsx` - Individual item display

## Booking System
- `Calendar.jsx` - Interactive booking calendar
- `CartPage.jsx` - Booking cart management
- `OrdersPage.jsx` - Booking history and management

## Admin Features
- `Management.jsx` - Admin dashboard
- `AnalyticsPage.jsx` - System analytics
- `StudentRequestsPage.jsx` - Request management

🚦 API Endpoints
## Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Token verification

## Equipment
- `GET /api/items` - Get all item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Bookings
- `GET /api/orders` - Get user bookings
- `POST /api/orders` - Create new booking
- `PUT /api/orders/:id` - Update booking status
- `GET /api/orders/availability` - Check item availability

## Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user role
- `GET /api/admin/analytics` - Get system analytics

## 🎨 Styling
The application uses SCSS Modules for component-level styling with:
- Consistent color scheme and design system
- Responsive design for mobile/tablet/desktop
- Accessible UI components
- Modern, clean interface

## 🚀 Deployment

### Render Deployment Setup

#### Connect your repository to Render
1. Link your GitHub repository to Render
2. Set up automatic deployments on push to main branch

#### Environment Variables in Render
- Set `NODE_ENV=production`
- Configure production MongoDB Atlas connection string
- Set up proper JWT secret for production
- Configure CORS for your production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify MongoDB connection string
- Check if MongoDB instance is running

#### Authentication Problems
- Ensure JWT secret is set
- Verify token expiration settings

#### CORS Errors
- Check CORS configuration in server setup
- Verify frontend URL is included in allowed origins

#### Build Failures
- Ensure all dependencies are installed
- Check for environment variable requirements

## Links
1. Repo: [SIMBA](https://github.com/alshaikh-exe/SIMBA)
2. Trello: [Trello](https://trello.com/b/2l6n4cfR/simba)
3. Wireframe: [Wireframe](https://excalidraw.com/#json=paggr5vhldLd96GkyxZ_x,DKIrxC_pR74QODhPxWcXAw)


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the robust database solution
- Vite for the fast build tooling
- All contributors and testers

**SIMBA** - Making equipment management smarter and more efficient for educational institutions and makerspaces worldwide. 🚀
