# 🚀 Codmin - Content Management System

[![Live Website](https://img.shields.io/badge/Live-codmin.codspot.com-blue?style=for-the-badge)](https://codmin.codspot.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A modern, feature-rich Content Management System built with React 19 and powered by Supabase. Codmin provides a comprehensive platform for managing blogs, projects, and media with a beautiful, responsive interface.

## 🌐 Live Demo

**Website:** [codmin.codspot.com](https://codmin.codspot.com)

## ✨ Features

### 📝 **Blog Management**

- **Rich Text Editor** - Advanced WYSIWYG editor powered by Lexical
- **Media Integration** - Seamless image upload and gallery integration
- **Draft & Publish** - Save drafts and publish when ready
- **SEO Optimization** - Built-in meta tags and SEO controls
- **Categories & Tags** - Organize content with flexible taxonomy
- **Markdown Export** - Convert content to markdown for versatility

### 🎨 **Project Showcase**

- **Portfolio Management** - Showcase your work and projects
- **Rich Media Support** - Images, descriptions, and project details
- **Responsive Gallery** - Beautiful, mobile-friendly project display

### 🖼️ **Media Gallery**

- **Centralized Storage** - All media in organized Supabase storage
- **Drag & Drop Upload** - Intuitive file upload experience
- **Media Selector** - Choose existing media for blog posts
- **Search & Filter** - Find media quickly with advanced filters

### 🔧 **Admin Dashboard**

- **Sidebar Navigation** - Clean, organized admin interface
- **Real-time Updates** - Live content management
- **Responsive Design** - Works perfectly on all devices
- **Dark Theme Ready** - Modern UI with professional styling

## 🛠️ Tech Stack

### **Frontend**

- **React 19** - Latest React with modern features
- **Lexical Editor** - Meta's powerful rich text editor
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Redux Toolkit** - State management

### **Backend & Services**

- **Supabase** - PostgreSQL database and authentication
- **Supabase Storage** - File storage and media management
- **Real-time API** - Live data synchronization

### **Development Tools**

- **Create React App** - Development environment
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Codspot/Codmin.git
   cd Codmin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the SQL files in your Supabase dashboard:

   ```bash
   # Execute these files in Supabase SQL Editor
   - blogs_table_setup.sql
   - projects_table_setup.sql
   ```

5. **Start Development Server**

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthRedirect.jsx    # Authentication routing
│   ├── BlogEditor.jsx      # Blog creation interface
│   ├── MediaSelector.jsx   # Media selection modal
│   ├── Navbar.jsx          # Navigation bar
│   ├── RequireAuth.jsx     # Protected route wrapper
│   ├── RichTextEditor.jsx  # Lexical-based text editor
│   └── Sidebar.jsx         # Admin sidebar navigation
├── pages/               # Main application pages
│   ├── Blogs.jsx           # Blog listing and management
│   ├── CreateBlog.jsx      # Blog creation page
│   ├── CreateProject.jsx   # Project creation page
│   ├── Dashboard.jsx       # Admin dashboard
│   ├── Login.jsx           # Authentication page
│   ├── Media.jsx           # Media gallery management
│   ├── NewBlogPost.jsx     # Alternative blog editor
│   └── Projects.jsx        # Project management
├── store/               # Redux state management
│   ├── authSlice.js        # Authentication state
│   ├── store.js            # Redux store configuration
│   └── uiSlice.js          # UI state management
├── utils/               # Utility functions
│   └── api.js              # API helper functions
├── App.jsx              # Main application component
├── index.js             # Application entry point
└── supabaseClient.js    # Supabase configuration
```

## 🎯 Key Features Explained

### **Rich Text Editor**

- Built with Meta's Lexical framework for maximum performance
- WYSIWYG editing with markdown support
- Image upload with drag & drop functionality
- Real-time content preview
- Export to markdown for flexibility

### **Media Management**

- Centralized media storage in Supabase
- Organized file structure: `/media/` for all content assets
- Advanced search and filtering capabilities
- Media selector integration in blog editor
- Optimized image delivery

### **Content Organization**

- Hierarchical category system
- Flexible tagging for content discovery
- SEO-friendly URL structure
- Draft/publish workflow
- Content scheduling capabilities

## 🔧 Available Scripts

### Development

```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Create production build
npm run eject      # Eject from Create React App (one-way operation)
```

### Deployment

```bash
npm run build      # Build for production
npm run preview    # Preview production build locally
```

## 🌐 Database Schema

### **Blogs Table**

```sql
- id (bigint, primary key)
- title (text)
- description (text)
- content (text)
- image_url (text)
- date (date)
- author (text)
- tags (text)
- category (text)
- status (text) - draft/published
```

### **Projects Table**

```sql
- id (bigint, primary key)
- title (text)
- description (text)
- image_url (text)
- project_url (text)
- technologies (text)
- date (date)
- status (text)
```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_public_anon_key

# Optional: Development Settings
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
```

### **Deploy to GitHub Pages**

```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

### **Deploy to Vercel/Netlify**

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**

- Follow React best practices
- Use Tailwind CSS for styling
- Write clear, documented code
- Test your changes thoroughly
- Follow the existing code structure

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Meta** - For the Lexical editor framework
- **Supabase** - For the powerful backend-as-a-service
- **Tailwind CSS** - For the beautiful utility-first CSS framework
- **Create React App** - For the excellent development setup

## 📞 Support & Contact

- **Website:** [codmin.codspot.com](https://codmin.codspot.com)
- **Portfolio:** [codspot.com](https://codspot.com)
- **Issues:** [GitHub Issues](https://github.com/Codspot/Codmin/issues)

---

**Built with ❤️ by [Codspot](https://codspot.com)**

_Codmin - Empowering content creators with modern technology_

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Codmin
