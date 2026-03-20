import LazyLoad from 'react-lazy-load';
import { Link } from 'react-router-dom';
import { Game } from '../types';
import { RatingStars } from './RatingStars';

export const GameCard = ({ game }: { game: Game }) => (
  <Link
    to={`/game/${game.slug}`}
    className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-glow active:scale-[0.99]"
  >
    <LazyLoad height={200} offset={120}>
      <div className="aspect-video overflow-hidden">
        <img src={game.coverImage} alt={game.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      </div>
    </LazyLoad>
    <div className="space-y-3 p-4">
      <div>
        <h3 className="line-clamp-2 text-lg font-semibold text-white">{game.name}</h3>
        <p className="mt-1 text-sm text-slate-400">{game.categoryLabels.join(' • ')}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <RatingStars rating={game.ratingAverage || 0} />
        <span className="text-xs text-slate-400">{game.playCount} plays</span>
      </div>
    </div>
  </Link>
);
