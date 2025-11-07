import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from "./store/store";
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import CreateProject from './pages/CreateProject.jsx';
import Blogs from './pages/Blogs.jsx';
import CreateBlog from './pages/CreateBlog.jsx';
import Media from './pages/Media.jsx';
import Login from './pages/Login.jsx';
import RequireAuth from './components/RequireAuth.jsx';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          {/* Full-screen Blog Editor Route */}
          <Route
            path="/create-blog"
            element={<RequireAuth><CreateBlog /></RequireAuth>}
          />
          <Route
            path="*"
            element={
              <div className="h-screen flex flex-col">
                {/* Full-width Navbar */}
                <Navbar />
                {/* Main content: Sidebar + Page */}
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <div className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
                      <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
                      <Route path="/projects/new" element={<RequireAuth><CreateProject /></RequireAuth>} />
                      <Route path="/blogs" element={<RequireAuth><Blogs /></RequireAuth>} />
                      <Route path="/media" element={<RequireAuth><Media /></RequireAuth>} />
                    </Routes>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;