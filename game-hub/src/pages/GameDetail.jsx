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
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">{game.name}</h1>
            <Button
              variant={isFavorite ? 'danger' : 'outline-danger'}
              onClick={handleToggleFavorite}
              className="d-flex align-items-center gap-2"
            >
              <i className={`bi bi-heart${isFavorite ? '-fill' : ''}`}></i>
              {isFavorite ? 'Remove from Library' : 'Add to Library'}
            </Button>
          </div>
          <div className="mb-4 position-relative">
            <img
              src={game.background_image}
              alt={game.name}
              className="img-fluid rounded shadow"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
            />
            <div className="position-absolute bottom-0 start-0 p-3 bg-dark bg-opacity-75 rounded-bottom">
              <div className="d-flex gap-3">
                <Badge bg="success" className="fs-6">
                  ★ {game.rating}
                </Badge>
                <Badge bg="info" className="fs-6">
                  Metacritic: {game.metacritic || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="mb-3">About</h4>
            <div 
              className="game-description"
              dangerouslySetInnerHTML={{ __html: game.description }} 
            />
          </div>
          {game.screenshots?.results && game.screenshots.results.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-3">Screenshots</h4>
              <Row>
                {game.screenshots.results.map((screenshot) => (
                  <Col key={screenshot.id} xs={6} md={4} className="mb-3">
                    <img
                      src={screenshot.image}
                      alt={`${game.name} screenshot`}
                      className="img-fluid rounded shadow-sm"
                      style={{ cursor: 'pointer' }}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Game Info</h5>
              <div className="mb-3">
                <strong>Release Date:</strong>
                <div>{new Date(game.released).toLocaleDateString()}</div>
              </div>
              <div className="mb-3">
                <strong>Genres:</strong>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {game.genres?.map((genre) => (
                    <Badge key={genre.id} bg="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <strong>Platforms:</strong>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {game.platforms?.map(({ platform }) => (
                    <Badge key={platform.id} bg="info">
                      {platform.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <strong>Developer:</strong>
                <div>{game.developers?.map(dev => dev.name).join(', ') || 'N/A'}</div>
              </div>
              <div className="mb-3">
                <strong>Publisher:</strong>
                <div>{game.publishers?.map(pub => pub.name).join(', ') || 'N/A'}</div>
              </div>
              <div className="mb-3">
                <strong>Website:</strong>
                <div>
                  <a href={game.website} target="_blank" rel="noopener noreferrer">
                    {game.website || 'N/A'}
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GameDetail; 