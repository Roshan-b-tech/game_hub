import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Badge, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchGames, setCurrentPage } from '../redux/slices/gamesSlice';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import { useUser } from '@clerk/clerk-react';

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

const GameGrid = () => {
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();
  const { items: games, status, currentPage, totalPages } = useSelector((state) => state.games);
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    const page = parseInt(currentPage, 10) || 1;
    dispatch(fetchGames({ page }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    const pageNumber = parseInt(page, 10) || 1;
    
    dispatch(setCurrentPage(pageNumber));
    
    dispatch(fetchGames({ page: pageNumber }));
  };

  const handleToggleFavorite = (game) => {
    if (!isSignedIn) {
      alert('Please sign in to add games to your library');
      return;
    }

    const isFavorite = favorites.some((fav) => fav.id === game.id);
    if (isFavorite) {
      dispatch(removeFavorite(game.id));
    } else {
      dispatch(addFavorite(game));
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading games</div>;
  }

  return (
    <div>
      <div className="game-grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isFavorite={favorites.some((fav) => fav.id === game.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="pagination">
          <Pagination.First 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1}
          />
          <Pagination.Prev 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          />
          
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // Show first page, last page, current page, and pages around current page
            if (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              );
            } else if (
              (page === currentPage - 2 && currentPage > 3) || 
              (page === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return <Pagination.Ellipsis key={page} />;
            }
            return null;
          })}
          
          <Pagination.Next 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
          />
          <Pagination.Last 
            onClick={() => handlePageChange(totalPages)} 
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </div>
  );
};

export default GameGrid; 