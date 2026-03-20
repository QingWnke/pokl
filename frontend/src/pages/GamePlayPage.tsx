import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { publicApi } from '../api/public';
import { AdSlot } from '../components/AdSlot';
import { GameCard } from '../components/GameCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RatingStars } from '../components/RatingStars';
import { ReviewForm } from '../components/ReviewForm';
import { useFetch } from '../hooks/useFetch';
import { formatDate } from '../utils/format';

export const GamePlayPage = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch(() => publicApi.getGame(slug));
  const [showPreroll, setShowPreroll] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const prerollAd = useMemo(() => data?.ads.find((ad) => ad.placement === 'PRE_ROLL'), [data]);
  const topAd = useMemo(() => data?.ads.find((ad) => ad.placement === 'IN_GAME_TOP'), [data]);
  const bottomAd = useMemo(() => data?.ads.find((ad) => ad.placement === 'IN_GAME_BOTTOM'), [data]);

  useEffect(() => {
    if (!data?.game) return;
    const start = Date.now();
    return () => {
      const duration = Math.min(300, Math.round((Date.now() - start) / 1000));
      void publicApi.trackPlay(data.game.slug, duration);
    };
  }, [data?.game]);

  useEffect(() => {
    if (!prerollAd || !showPreroll) return;
    setCountdown(prerollAd.skipDuration ?? 5);
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setShowPreroll(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [prerollAd, showPreroll]);

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <div>{error}</div>;

  return (
    <div className="space-y-8">
      {showPreroll && prerollAd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900">
            <AdSlot ad={prerollAd} className="h-[70vh] rounded-none" />
            <button
              disabled={countdown > 0}
              onClick={() => setShowPreroll(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {countdown > 0 ? `${countdown}s 后可跳过` : '跳过广告'}
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => navigate('/')} className="rounded-full border border-white/10 px-4 py-2 text-sm">返回首页</button>
        <button onClick={() => window.location.reload()} className="rounded-full border border-white/10 px-4 py-2 text-sm">重启游戏</button>
        <button onClick={() => document.documentElement.requestFullscreen?.()} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold">全屏游玩</button>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <AdSlot ad={topAd} className="h-24" />
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-glow">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{data.game.name}</h2>
                <p className="text-sm text-slate-400">开发者：{data.game.developerName}</p>
              </div>
              <RatingStars rating={data.game.ratingAverage} />
            </div>
            <div className="aspect-video bg-black">
              <iframe src={data.game.localEmbedPath || data.game.embedUrl} title={data.game.name} className="h-full w-full" allowFullScreen loading="lazy" />
            </div>
          </div>
          <AdSlot ad={bottomAd} className="h-24" />
          <ReviewForm onSubmit={async (values) => { await publicApi.submitReview(slug, values); await refetch(); }} />
          <div className="glass-panel rounded-3xl p-5">
            <h3 className="text-xl font-semibold text-white">玩家评论</h3>
            <div className="mt-5 space-y-4">
              {data.reviews.map((review) => (
                <article key={review._id} className="rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{review.authorName}</p>
                      <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="mt-3 text-slate-300">{review.comment}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-6">
          <div className="glass-panel rounded-3xl p-5">
            <h3 className="text-xl font-semibold text-white">游戏信息</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>{data.game.description}</p>
              <p>类别：{data.game.categoryLabels.join(' • ')}</p>
              <p>游玩次数：{data.game.playCount}</p>
              <p>平均游玩时长：{data.game.avgPlayTime} 分钟</p>
              <p>
                开源仓库：<a className="text-brand-300 underline" href={data.game.githubRepo} target="_blank" rel="noreferrer">查看 GitHub</a>
              </p>
              <p>
                开源许可证：<a className="text-brand-300 underline" href={data.game.licenseUrl} target="_blank" rel="noreferrer">{data.game.licenseName}</a>
              </p>
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">相关推荐</h3>
              <Link to="/popular" className="text-sm text-brand-300">更多</Link>
            </div>
            <div className="mt-5 grid gap-4">
              {data.relatedGames.map((game) => <GameCard key={game._id} game={game} />)}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
