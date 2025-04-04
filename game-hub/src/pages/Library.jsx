import { useSelector, useDispatch } from 'react-redux';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { removeFavorite } from '../redux/slices/favoritesSlice';
import GameCard from '../components/GameCard';

const Library = () => {
  const { isSignedIn } = useUser();
  const favorites = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();

  const handleRemoveFavorite = (game) => {
    dispatch(removeFavorite(game.id));
  };

  if (!isSignedIn) {
    return (
      <Container className="py-5 text-center">
        <h2>Please sign in to view your library</h2>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your library is empty</h2>
        <p className="text-muted">Start adding games to your library!</p>
        <Button as={Link} to="/" variant="primary">
          Browse Games
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Library</h2>
      <div className="game-grid">
        {favorites.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isFavorite={true}
            onToggleFavorite={handleRemoveFavorite}
          />
        ))}
      </div>
    </Container>
  );
};

export default Library; 