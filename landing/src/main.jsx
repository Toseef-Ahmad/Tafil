import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Docs from './Docs.jsx'
import Privacy from './Privacy.jsx'
import Terms from './Terms.jsx'
import Blog from './Blog.jsx'
import BlogPost from './BlogPost.jsx'
import './index.css'

// Simple router based on URL path
const pathname = window.location.pathname;

function getAppComponent() {
  if (pathname === '/docs' || pathname === '/docs/' || pathname.startsWith('/docs/')) {
    return Docs;
  }
  if (pathname === '/privacy' || pathname === '/privacy/') {
    return Privacy;
  }
  if (pathname === '/terms' || pathname === '/terms/') {
    return Terms;
  }
  // Blog routes
  if (pathname === '/blog' || pathname === '/blog/') {
    return Blog;
  }
  if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
    return BlogPost;
  }
  return App;
}

const AppComponent = getAppComponent();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
)

