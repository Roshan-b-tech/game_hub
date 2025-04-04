import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/App.css';
import './styles/components.css';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GameGrid from './components/GameGrid';
import GameDetail from './pages/GameDetail';
import Library from './pages/Library';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Provider store={store}>
        <Router>
          <div className="app">
            <Header />
            <div className="main-content">
              <Sidebar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<GameGrid />} />
                  <Route path="/game/:id" element={<GameDetail />} />
                  <Route path="/library" element={<Library />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </Provider>
    </ClerkProvider>
  );
}

export default App;
