import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { adminApi } from '../api/admin';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionHeader } from '../components/SectionHeader';
import { AdSlot } from '../types';

const schema = z.object({
  name: z.string().min(2),
  placement: z.enum(['HEADER_BANNER', 'SIDEBAR_VERTICAL', 'PRE_ROLL', 'IN_GAME_TOP', 'IN_GAME_BOTTOM', 'GRID_INLINE_4', 'GRID_INLINE_8']),
  type: z.enum(['IMAGE', 'VIDEO', 'HTML']),
  mediaUrl: z.string().url(),
  redirectUrl: z.string().url(),
  pageScope: z.string().min(1),
  frequency: z.coerce.number().int().min(1),
  skipDuration: z.coerce.number().int().min(0),
  active: z.boolean().default(true)
});

type FormValues = z.infer<typeof schema>;

export const AdminAdsPage = () => {
  const [ads, setAds] = useState<AdSlot[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { placement: 'HEADER_BANNER', type: 'IMAGE', pageScope: '*', frequency: 1, skipDuration: 5, active: true }
  });

  const load = async () => {
    setLoading(true);
    setAds(await adminApi.getAds());
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <SectionHeader title="广告管理" description="管理保留广告位、素材、跳转链接、展示频次与统计数据。" />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form className="glass-panel rounded-3xl p-5 space-y-4" onSubmit={handleSubmit(async (values) => {
          const payload = { ...values, pageScope: values.pageScope.split(',').map((item) => item.trim()) };
          if (editingId) await adminApi.updateAd(editingId, payload); else await adminApi.createAd(payload);
          setEditingId(null);
          reset({ placement: 'HEADER_BANNER', type: 'IMAGE', pageScope: '*', frequency: 1, skipDuration: 5, active: true } as Partial<FormValues>);
          await load();
        })}>
          <h3 className="text-xl font-semibold text-white">{editingId ? '编辑广告' : '新增广告'}</h3>
          <input {...register('name')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="广告名称" />
          <select {...register('placement')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
            {['HEADER_BANNER', 'SIDEBAR_VERTICAL', 'PRE_ROLL', 'IN_GAME_TOP', 'IN_GAME_BOTTOM', 'GRID_INLINE_4', 'GRID_INLINE_8'].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <select {...register('type')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
            <option value="IMAGE">IMAGE</option>
            <option value="VIDEO">VIDEO</option>
            <option value="HTML">HTML</option>
          </select>
          <input {...register('mediaUrl')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="素材 URL" />
          <input {...register('redirectUrl')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="跳转 URL" />
          <input {...register('pageScope')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="页面范围，以逗号分隔" />
          <div className="grid gap-4 md:grid-cols-2">
            <input type="number" {...register('frequency')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="频次" />
            <input type="number" {...register('skipDuration')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="跳过秒数" />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm"><input type="checkbox" {...register('active')} /> 启用广告</label>
          <button className="rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">保存广告</button>
        </form>
        <div className="glass-panel rounded-3xl p-5 space-y-4">
          {ads.map((ad) => (
            <div key={ad._id} className="rounded-2xl border border-white/10 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="font-semibold text-white">{ad.name}</h4>
                  <p className="text-sm text-slate-400">{ad.placement} · CTR {(ad.ctr ?? (ad.impressions ? ad.clicks / ad.impressions * 100 : 0)).toFixed(2)}%</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(ad._id); reset({ ...ad, pageScope: ad.pageScope.join(', ') } as any); }} className="rounded-full border border-white/10 px-4 py-2 text-sm">编辑</button>
                  <button onClick={async () => { await adminApi.deleteAd(ad._id); await load(); }} className="rounded-full bg-rose-500/20 px-4 py-2 text-sm text-rose-200">删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
