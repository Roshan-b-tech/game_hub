import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserButton, SignInButton, useUser } from '@clerk/clerk-react';
import { Form, InputGroup, Button, Navbar, Container } from 'react-bootstrap';
import { setFilters, fetchGames, setCurrentPage } from '../redux/slices/gamesSlice';
import '../styles/header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();
  const currentFilters = useSelector((state) => state.games.filters);

  // Initialize search query from Redux state if it exists
  useEffect(() => {
    if (currentFilters.search) {
      setSearchQuery(currentFilters.search);
    }
  }, [currentFilters.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update filters with search query
      dispatch(setFilters({ ...currentFilters, search: searchQuery }));
      
      // Reset to page 1 and fetch games with search query
      dispatch(setCurrentPage(1));
      dispatch(fetchGames({ 
        page: 1, 
        filters: { 
          ...currentFilters, 
          search: searchQuery 
        } 
      }));
      
      // If not on home page, navigate to home
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    
    // Remove search from filters
    const { search, ...otherFilters } = currentFilters;
    dispatch(setFilters(otherFilters));
    
    // Reset to page 1 and fetch games without search
    dispatch(setCurrentPage(1));
    dispatch(fetchGames({ page: 1, filters: otherFilters }));
  };

  return (
    <header className="header-container">
      <Navbar bg="dark" variant="dark" expand="lg" className="header-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-text">
            <i className="bi bi-controller me-2"></i>
            GameHub
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Form onSubmit={handleSearch} className="search-form mx-auto">
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <Button variant="primary" type="submit" className="search-button">
                  <i className="bi bi-search me-1"></i> Search
                </Button>
                {searchQuery && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleClearSearch}
                    className="clear-search-button"
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                )}
              </InputGroup>
            </Form>

            <div className="auth-buttons d-flex align-items-center">
              {isSignedIn ? (
                <>
                  <Link to="/library" className="library-link">
                    <i className="bi bi-bookmark-fill me-1"></i> My Library
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="outline-light" className="sign-in-button">
                    <i className="bi bi-person me-1"></i> Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 