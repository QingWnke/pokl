import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { adminApi } from '../api/admin';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionHeader } from '../components/SectionHeader';
import { Game } from '../types';

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  coverImage: z.string().url(),
  description: z.string().min(10),
  categoryLabels: z.string().min(2),
  categories: z.string().min(2),
  embedUrl: z.string().url(),
  developerName: z.string().min(2),
  githubRepo: z.string().url().or(z.literal('')),
  licenseName: z.string().min(2),
  licenseUrl: z.string().url(),
  launchMode: z.enum(['PAGE', 'MODAL']).default('PAGE'),
  published: z.boolean().default(true),
  featured: z.boolean().default(false)
});

type FormValues = z.infer<typeof schema>;

export const AdminGamesPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { launchMode: 'PAGE', published: true, featured: false }
  });

  const load = async () => {
    setLoading(true);
    const [gameData, categoryData] = await Promise.all([adminApi.getGames(), adminApi.getCategories()]);
    setGames(gameData);
    setCategories(categoryData);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <SectionHeader title="游戏管理" description="支持游戏 CRUD、发布状态控制与 GitHub 仓库元数据预导入。" />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          className="glass-panel rounded-3xl p-5 space-y-4"
          onSubmit={handleSubmit(async (values) => {
            const payload = {
              ...values,
              categories: values.categories.split(',').map((item) => item.trim()),
              categoryLabels: values.categoryLabels.split(',').map((item) => item.trim()),
              localEmbedPath: ''
            };
            if (editingId) {
              await adminApi.updateGame(editingId, payload);
            } else {
              await adminApi.createGame(payload);
            }
            setEditingId(null);
            reset({ launchMode: 'PAGE', published: true, featured: false } as Partial<FormValues>);
            await load();
          })}
        >
          <h3 className="text-xl font-semibold text-white">{editingId ? '编辑游戏' : '新增游戏'}</h3>
          <input {...register('name')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="游戏名称" />
          <input {...register('slug')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="slug" />
          <input {...register('coverImage')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="封面图 URL" />
          <textarea {...register('description')} rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="描述" />
          <input {...register('categoryLabels')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="分类名称，以英文逗号分隔" />
          <input {...register('categories')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder={`分类 ID，示例：${categories[0]?._id ?? ''}`} />
          <input {...register('embedUrl')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="嵌入链接" />
          <input {...register('developerName')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="开发者" />
          <input {...register('githubRepo')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="GitHub 仓库 URL" />
          <div className="grid gap-4 md:grid-cols-2">
            <input {...register('licenseName')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="许可证名称" />
            <input {...register('licenseUrl')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="许可证链接" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <select {...register('launchMode')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
              <option value="PAGE">页面内播放</option>
              <option value="MODAL">全屏弹窗</option>
            </select>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300">
              <label><input type="checkbox" {...register('published')} /> 发布</label>
              <label><input type="checkbox" {...register('featured')} /> 推荐</label>
            </div>
          </div>
          {Object.values(errors)[0] ? <p className="text-sm text-rose-300">请检查表单字段是否完整。</p> : null}
          <button disabled={isSubmitting} className="rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">{isSubmitting ? '保存中...' : editingId ? '更新游戏' : '创建游戏'}</button>
        </form>

        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">当前游戏</h3>
            <button
              onClick={async () => {
                const repo = prompt('输入 GitHub 仓库，例如 owner/repo');
                if (repo) {
                  const result = await adminApi.importGithub(repo);
                  alert(`已获取仓库元数据：${result.data.name || result.message}`);
                }
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-sm"
            >
              GitHub 导入
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {games.map((game) => (
              <div key={game._id} className="rounded-2xl border border-white/10 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{game.name}</h4>
                    <p className="text-sm text-slate-400">{game.categoryLabels.join(' • ')} · {game.playCount} plays · {game.ratingAverage}★</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingId(game._id);
                      reset({
                        name: game.name,
                        slug: game.slug,
                        coverImage: game.coverImage,
                        description: game.description,
                        categoryLabels: game.categoryLabels.join(', '),
                        categories: game.categories.join(', '),
                        embedUrl: game.embedUrl,
                        developerName: game.developerName,
                        githubRepo: game.githubRepo,
                        licenseName: game.licenseName,
                        licenseUrl: game.licenseUrl,
                        launchMode: game.launchMode,
                        published: game.published,
                        featured: Boolean(game.featured)
                      });
                    }} className="rounded-full border border-white/10 px-4 py-2 text-sm">编辑</button>
                    <button onClick={async () => { await adminApi.deleteGame(game._id); await load(); }} className="rounded-full bg-rose-500/20 px-4 py-2 text-sm text-rose-200">删除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
