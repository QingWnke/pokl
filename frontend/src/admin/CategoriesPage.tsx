import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { adminApi } from '../api/admin';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionHeader } from '../components/SectionHeader';
import { Category } from '../types';

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  icon: z.string().min(1),
  displayOrder: z.coerce.number().int().min(0),
  parentId: z.string().optional(),
  visible: z.boolean().default(true)
});

type FormValues = z.infer<typeof schema>;

export const AdminCategoriesPage = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { icon: '🎮', displayOrder: 0, visible: true } });

  const load = async () => {
    setLoading(true);
    setItems(await adminApi.getCategories());
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <SectionHeader title="分类管理" description="支持层级分类、展示顺序和前台可见性控制。" />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="glass-panel rounded-3xl p-5 space-y-4" onSubmit={handleSubmit(async (values) => {
          const payload = { ...values, parentId: values.parentId || null };
          if (editingId) await adminApi.updateCategory(editingId, payload); else await adminApi.createCategory(payload);
          setEditingId(null);
          reset({ icon: '🎮', displayOrder: 0, visible: true, name: '', slug: '', parentId: '' });
          await load();
        })}>
          <h3 className="text-xl font-semibold text-white">{editingId ? '编辑分类' : '新增分类'}</h3>
          <input {...register('name')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="分类名称" />
          <input {...register('slug')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="slug" />
          <div className="grid gap-4 md:grid-cols-2">
            <input {...register('icon')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="图标" />
            <input type="number" {...register('displayOrder')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="排序" />
          </div>
          <select {...register('parentId')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
            <option value="">无父级</option>
            {items.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
          </select>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300"><input type="checkbox" {...register('visible')} /> 前台显示</label>
          <button className="rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">保存分类</button>
        </form>
        <div className="glass-panel rounded-3xl p-5 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
              <div>
                <h4 className="font-semibold text-white">{item.icon} {item.name}</h4>
                <p className="text-sm text-slate-400">slug: {item.slug} · 排序 {item.displayOrder} · {item.visible ? '显示' : '隐藏'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(item._id); reset({ name: item.name, slug: item.slug, icon: item.icon, displayOrder: item.displayOrder, parentId: item.parentId ?? '', visible: item.visible }); }} className="rounded-full border border-white/10 px-4 py-2 text-sm">编辑</button>
                <button onClick={async () => { await adminApi.deleteCategory(item._id); await load(); }} className="rounded-full bg-rose-500/20 px-4 py-2 text-sm text-rose-200">删除</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
