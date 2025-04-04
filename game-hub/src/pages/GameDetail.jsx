import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import '../styles/gameDetail.css';

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((fav) => fav.id === parseInt(id));

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/games/${id}`, {
          params: {
            key: RAWG_API_KEY,
          },
        });
        setGame(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load game details. Please try again later.');
        console.error('Error fetching game details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!isSignedIn) {
      alert('Please sign in to add games to your library');
      return;
    }

    if (isFavorite) {
      dispatch(removeFavorite(parseInt(id)));
    } else {
      dispatch(addFavorite(game));
    }
  };

  if (loading) {
    return (
      <div className="game-loader">
        <div className="game-loader-container">
          <div className="game-loader-circle"></div>
          <div className="game-loader-circle"></div>
          <div className="game-loader-circle"></div>
        </div>
        <div className="game-loader-text">Loading Game Details</div>
        <div className="game-loader-subtext">Preparing your gaming experience...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-danger mb-4">{error}</h3>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-danger mb-4">Game not found</h3>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container className="game-detail-container">
      <div className="game-detail-header">
        <h1 className="game-detail-title">{game.name}</h1>
        <Button
          variant={isFavorite ? 'danger' : 'outline-danger'}
          onClick={handleToggleFavorite}
          className="d-flex align-items-center gap-2"
        >
          <i className={`bi bi-heart${isFavorite ? '-fill' : ''}`}></i>
          {isFavorite ? 'Remove from Library' : 'Add to Library'}
        </Button>
      </div>
      
      <Row>
        <Col lg={8} md={7}>
          <div className="game-detail-image-container">
            <img
              src={game.background_image}
              alt={game.name}
              className="game-detail-image"
            />
            <div className="game-detail-rating">
              <Badge bg="success" className="fs-6">
                ★ {game.rating}
              </Badge>
              <Badge bg="info" className="fs-6">
                Metacritic: {game.metacritic || 'N/A'}
              </Badge>
            </div>
          </div>
          
          <div className="game-detail-section">
            <h4 className="game-detail-section-title">About</h4>
            <div 
              className="game-description"
              dangerouslySetInnerHTML={{ __html: game.description }} 
            />
          </div>
          
          {game.screenshots?.results && game.screenshots.results.length > 0 && (
            <div className="game-detail-section">
              <h4 className="game-detail-section-title">Screenshots</h4>
              <div className="game-detail-screenshots">
                {game.screenshots.results.map((screenshot) => (
                  <div key={screenshot.id} className="game-detail-screenshot">
                    <img
                      src={screenshot.image}
                      alt={`${game.name} screenshot`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Col>
        
        <Col lg={4} md={5}>
          <div className="game-detail-info-card">
            <h5 className="game-detail-info-title">Game Info</h5>
            
            <div className="game-detail-info-item">
              <div className="game-detail-info-label">Release Date</div>
              <div className="game-detail-info-value">
                {new Date(game.released).toLocaleDateString()}
              </div>
            </div>
            
            <div className="game-detail-info-item">
              <div className="game-detail-info-label">Genres</div>
              <div className="game-detail-badges">
                {game.genres?.map((genre) => (
                  <Badge key={genre.id} bg="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="game-detail-info-item">
              <div className="game-detail-info-label">Platforms</div>
              <div className="game-detail-badges">
                {game.platforms?.map(({ platform }) => (
                  <Badge key={platform.id} bg="info">
                    {platform.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="game-detail-info-item">
              <div className="game-detail-info-label">Developer</div>
              <div className="game-detail-info-value">
                {game.developers?.map(dev => dev.name).join(', ') || 'N/A'}
              </div>
            </div>
            
            <div className="game-detail-info-item">
              <div className="game-detail-info-label">Publisher</div>
              <div className="game-detail-info-value">
                {game.publishers?.map(pub => pub.name).join(', ') || 'N/A'}
              </div>
            </div>
            
            {game.website && (
              <div className="game-detail-info-item">
                <div className="game-detail-info-label">Website</div>
                <div className="game-detail-info-value">
                  <a href={game.website} target="_blank" rel="noopener noreferrer">
                    {game.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default GameDetail; 