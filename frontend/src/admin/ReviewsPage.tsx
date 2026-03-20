import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RatingStars } from '../components/RatingStars';
import { SectionHeader } from '../components/SectionHeader';
import { Review } from '../types';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setReviews(await adminApi.getReviews());
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <SectionHeader title="评分与评论审核" description="支持垃圾评论标记、审核开关与优质评论置顶。" />
      <div className="space-y-4">
        {reviews.map((review) => {
          const game = typeof review.gameId === 'string' ? undefined : review.gameId;
          return (
            <div key={review._id} className="glass-panel rounded-3xl p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-400">{game?.name ?? 'Unknown game'} · {review.authorName}</p>
                  <div className="mt-2"><RatingStars rating={review.rating} /></div>
                  <p className="mt-3 text-slate-300">{review.comment}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={async () => { await adminApi.updateReview(review._id, { ...review, approved: !review.approved }); await load(); }} className="rounded-full border border-white/10 px-4 py-2 text-sm">{review.approved ? '取消审核' : '通过审核'}</button>
                  <button onClick={async () => { await adminApi.updateReview(review._id, { ...review, pinned: !review.pinned }); await load(); }} className="rounded-full border border-white/10 px-4 py-2 text-sm">{review.pinned ? '取消置顶' : '置顶'}</button>
                  <button onClick={async () => { await adminApi.updateReview(review._id, { ...review, spam: !review.spam }); await load(); }} className="rounded-full border border-white/10 px-4 py-2 text-sm">{review.spam ? '取消垃圾' : '标记垃圾'}</button>
                  <button onClick={async () => { await adminApi.deleteReview(review._id); await load(); }} className="rounded-full bg-rose-500/20 px-4 py-2 text-sm text-rose-200">删除</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
