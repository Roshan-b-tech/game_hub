import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GameCard = ({ game, isFavorite, onToggleFavorite }) => {
  return (
    <Card className="h-100 game-card">
      <Link to={`/game/${game.id}`} className="text-decoration-none">
        <Card.Img
          variant="top"
          src={game.background_image}
          alt={game.name}
        />
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-start">
            <span className="text-dark">{game.name}</span>
            <button
              className="btn btn-link p-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(game);
              }}
            >
              <i className={`bi bi-heart${isFavorite ? '-fill text-danger' : ''}`}></i>
            </button>
          </Card.Title>
          <Card.Text className="small text-muted">
            Released: {new Date(game.released).toLocaleDateString()}
          </Card.Text>
          <div className="mb-2">
            {game.genres?.slice(0, 2).map((genre) => (
              <Badge key={genre.id} bg="secondary" className="me-1">
                {genre.name}
              </Badge>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="success" className="me-2">
                ★ {game.rating}
              </Badge>
              <Badge bg="info">
                {game.metacritic || 'N/A'}
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default GameCard; 