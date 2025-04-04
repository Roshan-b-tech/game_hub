import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { setFilters, fetchGames, setCurrentPage } from '../redux/slices/gamesSlice';
import axios from 'axios';

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

const Sidebar = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector((state) => state.games.filters);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [years, setYears] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    tags: '',
    releaseYear: '',
    ordering: '-rating'
  });

  // Initialize local filters from Redux state
  useEffect(() => {
    setLocalFilters({
      category: currentFilters.category || '',
      tags: currentFilters.tags || '',
      releaseYear: currentFilters.releaseYear || '',
      ordering: currentFilters.ordering || '-rating'
    });
  }, [currentFilters]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          axios.get(`${BASE_URL}/genres`, {
            params: { key: RAWG_API_KEY }
          }),
          axios.get(`${BASE_URL}/tags`, {
            params: { key: RAWG_API_KEY }
          })
        ]);

        setCategories(categoriesRes.data.results);
        setTags(tagsRes.data.results);
        
        // Generate years from 1990 to current year
        const currentYear = new Date().getFullYear();
        setYears(Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i));
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFilters = () => {
    // Convert filters to API format
    const apiFilters = {};
    
    if (localFilters.category) {
      apiFilters.genres = localFilters.category;
    }
    
    if (localFilters.tags) {
      apiFilters.tags = localFilters.tags;
    }
    
    if (localFilters.releaseYear) {
      apiFilters.dates = `${localFilters.releaseYear}-01-01,${localFilters.releaseYear}-12-31`;
    }
    
    if (localFilters.ordering) {
      apiFilters.ordering = localFilters.ordering;
    }
    
    // Update Redux state
    dispatch(setFilters(localFilters));
    
    // Reset to page 1 and fetch games with new filters
    dispatch(setCurrentPage(1));
    dispatch(fetchGames({ page: 1, filters: apiFilters }));
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      category: '',
      tags: '',
      releaseYear: '',
      ordering: '-rating'
    };
    
    setLocalFilters(defaultFilters);
    dispatch(setFilters(defaultFilters));
    
    // Reset to page 1 and fetch games without filters
    dispatch(setCurrentPage(1));
    dispatch(fetchGames({ page: 1, filters: {} }));
  };

  return (
    <div className="sidebar">
      <h5>
        <i className="bi bi-funnel-fill"></i> Filters
      </h5>
      
      <Form>
        <div className="form-group">
          <Form.Label>
            <i className="bi bi-grid-3x3-gap-fill"></i> Category
          </Form.Label>
          <Form.Select
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="form-group">
          <Form.Label>
            <i className="bi bi-tags-fill"></i> Tags
          </Form.Label>
          <Form.Select
            value={localFilters.tags}
            onChange={(e) => handleFilterChange('tags', e.target.value)}
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="form-group">
          <Form.Label>
            <i className="bi bi-calendar-event-fill"></i> Release Year
          </Form.Label>
          <Form.Select
            value={localFilters.releaseYear}
            onChange={(e) => handleFilterChange('releaseYear', e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="form-group">
          <Form.Label>
            <i className="bi bi-sort-down-alt-fill"></i> Sort By
          </Form.Label>
          <Form.Select
            value={localFilters.ordering}
            onChange={(e) => handleFilterChange('ordering', e.target.value)}
          >
            <option value="-rating">Rating (High to Low)</option>
            <option value="rating">Rating (Low to High)</option>
            <option value="-released">Release Date (Newest)</option>
            <option value="released">Release Date (Oldest)</option>
            <option value="name">Name (A-Z)</option>
            <option value="-name">Name (Z-A)</option>
          </Form.Select>
        </div>

        <div className="d-grid gap-2 mt-4">
          <Button variant="primary" onClick={handleApplyFilters}>
            <i className="bi bi-check-lg"></i> Apply Filters
          </Button>
          <Button variant="outline-secondary" onClick={handleResetFilters}>
            <i className="bi bi-x-lg"></i> Reset
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Sidebar; 