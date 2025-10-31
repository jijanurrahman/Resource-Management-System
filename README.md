# 🏢 Resource Management System

> A modern, full-stack web application built with Django and vanilla JavaScript featuring JWT authentication, role-based access control, and a beautiful responsive UI.

![Django](https://img.shields.io/badge/Django-5.2.6-092E20?style=for-the-badge&logo=django&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

## 🎥 YouTube Demo Video

[![Project Demo Video](https://img.youtube.com/vi/AgASBsKbtDQ/0.jpg)](https://youtu.be/AgASBsKbtDQ)


## 📋 Table of Contents
- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 API Documentation](#-api-documentation)
- [🎨 UI/UX Features](#-uiux-features)
- [🔒 Security](#-security)
- [📱 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT Token Authentication** - Secure login/logout with automatic token refresh
- **Role-Based Access Control** - Three distinct user roles:
  - 👑 **Admin** - Full CRUD access + user management capabilities
  - 👨‍💼 **Staff** - Complete resource management (Create, Read, Update, Delete)
  - 👤 **User** - Read-only access to view resources
- **Secure Session Management** - Automatic token validation and refresh
- **Password Security** - Strong password validation and encryption

### 📦 Resource Management
- **Complete CRUD Operations** - Full resource lifecycle management
- **Real-time Search** - Instant search and filtering capabilities
- **Resource Categories** - Organized resource management with metadata
- **Audit Trail** - Track creation and modification timestamps
- **Bulk Operations** - Efficient handling of multiple resources

### 🎨 Modern User Interface
- **Responsive Design** - Seamless experience across all devices
- **Eye-catching Animations** - Smooth transitions and micro-interactions
- **Enhanced Alert System** - Vibrant notifications with sound effects
- **Dark Theme Elements** - Professional color scheme with gradients
- **Interactive Components** - Hover effects and loading states
- **Mobile-First Approach** - Optimized for mobile devices

### 🚀 Performance & UX
- **Fast Loading** - Optimized assets and efficient API calls
- **Progressive Enhancement** - Works without JavaScript (basic functionality)
- **Accessibility** - WCAG compliant design patterns
- **Cross-Browser Support** - Compatible with modern browsers

## 🛠️ Technology Stack

### Backend
- **Django 5.2.6** - High-level Python web framework
- **Django REST Framework 3.15.2** - Powerful toolkit for building Web APIs
- **Django REST Framework SimpleJWT 5.3.0** - JSON Web Token authentication
- **SQLite3** - Lightweight database for development
- **Python Decouple** - Environment variable management

### Frontend
- **HTML5** - Semantic markup with modern standards
- **CSS3** - Advanced styling with Grid, Flexbox, and animations
- **Vanilla JavaScript (ES6+)** - Modern JavaScript without frameworks
- **Font Awesome 6.0** - Professional icon library

### Development Tools
- **Django Admin** - Built-in administration interface
- **Django CORS Headers** - Cross-Origin Resource Sharing handling
- **Pillow** - Python Imaging Library for image processing

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jijanurrahman/Resource-Management-System.git
```

2. **Create and activate virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Navigate to project directory**
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
cd Resource-Management-System
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Set up the database**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create a superuser (optional)**
```bash
python manage.py createsuperuser
python manage.py fix_superuser_roles  # Assign admin role to superuser
```

7. **Load sample data (optional)**
```bash
python manage.py create_test_data
```

8. **Start the development server**
```bash
python manage.py runserver
```

9. **Open your browser**
```
http://127.0.0.1:8000/
```

## 📖 API Documentation

### Base URL
```
http://127.0.0.1:8000/api/
```

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register/` | Register new user | ❌ |
| `POST` | `/auth/login/` | User login | ❌ |
| `POST` | `/auth/logout/` | User logout | ✅ |
| `GET` | `/auth/profile/` | Get user profile | ✅ |
| `POST` | `/auth/token/refresh/` | Refresh JWT token | ✅ |

### 📦 Resource Endpoints

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| `GET` | `/resources/` | List resources (with search) | All users |
| `POST` | `/resources/` | Create new resource | Staff, Admin |
| `GET` | `/resources/{id}/` | Get specific resource | All users |
| `PUT` | `/resources/{id}/` | Update resource | Staff (own), Admin (all) |
| `DELETE` | `/resources/{id}/` | Delete resource | Staff (own), Admin (all) |

### 📝 Request/Response Examples

#### User Registration
```json
POST /api/auth/register/
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Create Resource
```json
POST /api/resources/
Authorization: Bearer <access_token>
{
  "name": "Django Documentation",
  "url": "https://docs.djangoproject.com/",
  "description": "Official Django documentation"
}
```

## 🎨 UI/UX Features

### 🎭 Enhanced Alert System
- **Vibrant Gradient Colors** - Eye-catching success, error, warning, and info alerts
- **Smooth Animations** - Slide-in effects with bounce and scale transitions
- **Sound Effects** - Different musical notes for each alert type
- **Interactive Elements** - Click to dismiss, hover effects, close buttons
- **Queue Management** - Multiple alerts are queued and displayed sequentially
- **Mobile Optimized** - Responsive positioning and sizing

### 🎨 Visual Design
- **Modern Color Palette**
  - Primary: `#667eea` (Blue gradient)
  - Secondary: `#764ba2` (Purple)
  - Success: `#10b981` (Green)
  - Error: `#ef4444` (Red)
  - Warning: `#f59e0b` (Orange)

### 📱 Responsive Features
- **Mobile-First Design** - Optimized for mobile devices
- **Breakpoints**: 768px (tablet), 480px (mobile)
- **Hamburger Menu** - Collapsible navigation for mobile
- **Touch-Friendly** - Large tap targets and gesture support
- **Flexible Layouts** - CSS Grid and Flexbox for adaptive layouts

### ⚡ Performance Optimizations
- **Lazy Loading** - Images and content loaded on demand
- **Minified Assets** - Compressed CSS and JavaScript
- **Efficient API Calls** - Optimized data fetching
- **Caching Strategy** - Browser and server-side caching

## 🎨 UI Features

### Responsive Design
- **Mobile-first approach** with breakpoints at 768px and 480px
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly buttons** and form elements

### Animations & Effects
- **Smooth transitions** on all interactive elements
- **Hover effects** on buttons and cards
- **Loading spinners** for async operations
- **Slide-in animations** for modals and forms
- **Floating animations** on hero section cards

### Color Scheme
- **Primary**: #667eea (Blue gradient)
- **Secondary**: #764ba2 (Purple)
- **Accent**: #f093fb (Pink)
- **Success**: #48bb78 (Green)
- **Error**: #f56565 (Red)

## 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password validation** (minimum 8 characters)
- **CSRF protection** enabled
- **Input sanitization** and validation
- **Role-based access control** at API level
- **Secure token storage** in localStorage

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🚀 Deployment

### Environment Variables
Create a `.env` file for production:
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
```

### Static Files
```bash
python manage.py collectstatic
```

### Production Settings
- Set `DEBUG = False`
- Configure `ALLOWED_HOSTS`
- Use a production database (PostgreSQL recommended)
- Configure HTTPS
- Set up proper static file serving

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Role-based access control
- [ ] Resource CRUD operations
- [ ] Search functionality
- [ ] Responsive design on different devices
- [ ] Form validation
- [ ] JWT token refresh
- [ ] Logout functionality

### Test Users
Use the management command to create test data:
```bash
python manage.py create_test_data
```

## 📁 Project Structure

```
resource_management/
├── authentication/          # User authentication app
│   ├── models.py           # Custom User model
│   ├── serializers.py      # API serializers
│   ├── views.py            # Authentication views
│   └── urls.py             # Authentication URLs
├── resources/              # Resource management app
│   ├── models.py           # Resource model
│   ├── serializers.py      # Resource serializers
│   ├── views.py            # Resource views
│   └── urls.py             # Resource URLs
├── static/                 # Static files
│   ├── css/
│   │   └── style.css       # Main stylesheet
│## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication with automatic refresh
- **Password Validation** - Strong password requirements (minimum 8 characters)
- **CSRF Protection** - Built-in Django CSRF protection enabled
- **Input Sanitization** - Server-side validation and sanitization
- **Role-Based Access Control** - Granular permissions at API level
- **Secure Headers** - Security headers for production deployment
- **Token Blacklisting** - Logout functionality with token invalidation

### 🔐 Authentication
- Clean login/register forms with validation
- Real-time error feedback
- Smooth transitions and animations

### 📦 Resource Management
- Card-based resource layout
- Real-time search functionality
- Role-based action buttons (Add/Edit/Delete)
- Modal forms for resource management

### 👤 User Profile
- Personal information display
- User statistics and activity
- Role-based content visibility

### Docker Deployment (Optional)
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## 🧪 Testing

### Run Tests
```bash
python manage.py test
```

### Test Coverage
- Authentication endpoints
- Resource CRUD operations
- Role-based permissions
- Form validations
- API responses

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Profile redirects to login page**
```bash
python manage.py fix_superuser_roles
```

**Static files not loading**
```bash
python manage.py collectstatic --clear
python manage.py collectstatic
```

**Database migration errors**
```bash
python manage.py makemigrations --empty authentication
python manage.py migrate
```

**CORS issues**
- Check `CORS_ALLOWED_ORIGINS` in settings.py
- Ensure frontend and backend URLs match

**JWT Token issues**
- Check token expiration settings
- Verify token storage in localStorage
- Clear browser storage and re-login

## 🌟 Key Highlights

- ✅ **Modern Full-Stack Application** - Built with Django and vanilla JavaScript
- ✅ **JWT Authentication** - Secure token-based authentication system
- ✅ **Role-Based Access Control** - Three user roles with different permissions
- ✅ **Responsive Design** - Mobile-first approach with modern UI/UX
- ✅ **Enhanced Alert System** - Eye-catching notifications with animations
- ✅ **RESTful API** - Well-documented API endpoints
- ✅ **Production Ready** - Includes deployment configurations

## 📞 Contact

**Jijanur Rahman**
- GitHub: [@jijanurrahman](https://github.com/jijanurrahman)
- Email: jijanurrahman22@gmail.com

---

**Made with ❤️ by [Jijanur Rahman](https://jijanurrahman.netlify.app) using Django and modern web technologies**
