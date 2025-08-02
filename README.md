# QuickDesk - Help Desk Management System

A modern, responsive help desk management system built with React.js and Bootstrap. QuickDesk provides a comprehensive solution for managing support tickets, users, and categories with role-based access control.

## 🚀 Features

### User Management
- **Role-based Access Control**: Three user roles (User, Support Agent, Admin)
- **User Registration & Authentication**: Secure login/register system
- **Admin Approval System**: New users require admin approval
- **Role Upgrade Requests**: Users can request role upgrades (admin approval required)

### Ticket Management
- **Create & Track Tickets**: Users can create tickets with subject, description, category, and priority
- **File Attachments**: Support for file uploads (PDF, DOC, DOCX, TXT, JPG, PNG, GIF)
- **Status Tracking**: Ticket statuses (Open → In Progress → Resolved → Closed)
- **Priority Levels**: Low, Medium, High, Urgent
- **Comments System**: Internal and public comments with user attribution

### Advanced Features
- **Search & Filtering**: Advanced search with multiple filter options
- **Category Management**: Admin can create and manage ticket categories
- **Dashboard Analytics**: Role-specific dashboards with statistics
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live data updates using localStorage

## 🛠️ Technology Stack

- **Frontend**: React.js 18 with TypeScript
- **UI Framework**: Bootstrap 5 with React Bootstrap
- **Icons**: React Icons (Font Awesome)
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Storage**: LocalStorage (for demo purposes)

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quick-desk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 👥 User Roles & Access

### Demo Accounts
The system comes with pre-configured demo accounts:

- **Admin**: `admin@company.com` (any password)
- **Support Agent**: `support@company.com` (any password)

### Role Permissions

#### End User
- Create and view their own tickets
- Add comments to tickets
- Request role upgrades
- View ticket status and updates

#### Support Agent
- All user permissions
- View and manage assigned tickets
- Update ticket status and priority
- Add internal comments
- Assign tickets to themselves

#### Admin
- All support agent permissions
- Manage all users and their roles
- Approve/reject user registrations
- Approve/reject role upgrade requests
- Create and manage ticket categories
- View system-wide statistics

## 📱 Features Overview

### Authentication System
- Elegant login/register pages with modern design
- Form validation and error handling
- Automatic login after registration
- Session persistence using localStorage

### Dashboard
- **User Dashboard**: Personal ticket statistics and recent activity
- **Support Dashboard**: Assigned tickets and urgent items
- **Admin Dashboard**: System-wide statistics and pending approvals

### Ticket Management
- **Create Tickets**: Comprehensive form with all necessary fields
- **Ticket List**: Advanced filtering and search capabilities
- **Ticket Details**: Full ticket view with comments and history
- **Status Updates**: Easy status and priority management

### Admin Features
- **User Management**: View, edit, and approve users
- **Category Management**: Create, edit, and delete ticket categories
- **Upgrade Requests**: Review and approve role upgrade requests
- **System Statistics**: Comprehensive analytics and reporting

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient backgrounds
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Subtle animations and transitions
- **Color-coded Elements**: Status badges, priority indicators, and category colors
- **Accessibility**: Proper focus states and keyboard navigation

## 📊 Data Structure

### Ticket Status Flow
```
Open → In Progress → Resolved → Closed
```

### Priority Levels
- **Low**: Green badge
- **Medium**: Yellow badge  
- **High**: Red badge
- **Urgent**: Dark badge with special highlighting

### Categories
- **Technical Support**: Blue (#007bff)
- **General Inquiry**: Green (#28a745)
- **Bug Report**: Red (#dc3545)
- **Feature Request**: Yellow (#ffc107)

## 🔧 Customization

### Adding New Categories
1. Login as admin
2. Navigate to "Categories" in the admin menu
3. Click "Add Category"
4. Set name, description, and color

### Modifying User Roles
1. Login as admin
2. Navigate to "Manage Users"
3. Click "Edit" on any user
4. Change role and approval status

### Styling Customization
The application uses CSS custom properties and Bootstrap classes. Main style files:
- `src/App.css` - Global styles
- `src/components/auth/Auth.css` - Authentication pages
- `src/components/dashboard/Dashboard.css` - Dashboard components
- `src/components/tickets/Tickets.css` - Ticket management
- `src/components/admin/Admin.css` - Admin interface

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Build the project
2. Upload the `build` folder to your hosting platform
3. Configure routing to handle React Router (redirect all routes to index.html)

## 🔒 Security Notes

This is a demo application using localStorage for data persistence. For production use:

- Implement proper backend API with authentication
- Use secure session management
- Add input validation and sanitization
- Implement proper error handling
- Add rate limiting and security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

Future enhancements planned:
- Real-time notifications
- Email integration
- Advanced reporting
- API integration
- Mobile app
- Multi-language support

---

**QuickDesk** - Streamlining support ticket management with modern web technologies.
