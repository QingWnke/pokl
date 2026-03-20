import { buildStars } from '../utils/format';

export const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 text-amber-300">
    {buildStars(rating).map((filled, index) => (
      <span key={index}>{filled ? '★' : '☆'}</span>
    ))}
    <span className="ml-2 text-sm text-slate-300">{rating.toFixed(1)}</span>
  </div>
);
