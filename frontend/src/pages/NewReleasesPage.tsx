import { publicApi } from '../api/public';
import { GameCard } from '../components/GameCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionHeader } from '../components/SectionHeader';
import { useFetch } from '../hooks/useFetch';

export const NewReleasesPage = () => {
  const { data, loading, error } = useFetch(publicApi.getNewReleases);
  if (loading) return <LoadingSpinner />;
  if (error || !data) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <SectionHeader title="最新上线" description="展示最近 30 天上架的平台游戏，方便用户发现新内容。" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.map((game: any) => <GameCard key={game._id} game={game} />)}
      </div>
    </div>
  );
};
