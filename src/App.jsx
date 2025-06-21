import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import CreateProject from './pages/CreateProject.jsx';
import Blogs from './pages/Blogs.jsx';
import CreateBlog from './pages/CreateBlog.jsx';

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        {/* Full-width Navbar */}
        <Navbar />

        {/* Main content: Sidebar + Page */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/new" element={<CreateProject />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/new" element={<CreateBlog />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}


export default App;