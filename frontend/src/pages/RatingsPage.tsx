import { publicApi } from '../api/public';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RatingStars } from '../components/RatingStars';
import { SectionHeader } from '../components/SectionHeader';
import { useFetch } from '../hooks/useFetch';
import { formatDate } from '../utils/format';

export const RatingsPage = () => {
  const { data, loading, error } = useFetch(publicApi.getRatings);
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <div>{error}</div>;

  return (
    <div className="space-y-8">
      <SectionHeader title="评分与评论" description="展示高分榜单、最新用户评论与口碑内容。" />
      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-white">高分榜单</h3>
          <div className="mt-5 space-y-4">
            {data.topRatedGames.map((game, index) => (
              <div key={game._id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-200">#{index + 1}</p>
                  <h4 className="text-lg font-semibold text-white">{game.name}</h4>
                  <p className="text-sm text-slate-400">{game.categoryLabels.join(' • ')}</p>
                </div>
                <RatingStars rating={game.ratingAverage} />
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-white">最新评论</h3>
          <div className="mt-5 space-y-4">
            {data.latestReviews.map((review) => (
              <article key={review._id} className="rounded-2xl border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">{review.authorName}</h4>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{review.comment}</p>
                <p className="mt-3 text-xs text-slate-500">{formatDate(review.createdAt)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
