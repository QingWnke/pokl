import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { adminApi } from '../api/admin';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionHeader } from '../components/SectionHeader';

const settingsSchema = z.object({
  siteName: z.string().min(2),
  logoUrl: z.string().url().or(z.literal('')),
  copyright: z.string().min(2),
  seoTitle: z.string().min(2),
  seoDescription: z.string().min(10),
  supportEmail: z.string().email(),
  visitsDaily: z.coerce.number().int().min(0),
  visitsWeekly: z.coerce.number().int().min(0),
  visitsMonthly: z.coerce.number().int().min(0),
  uniqueVisitors: z.coerce.number().int().min(0)
});

const adminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['SUPER_ADMIN', 'EDITOR', 'ANALYST']),
  permissions: z.string().optional()
});

type SettingsValues = z.infer<typeof settingsSchema>;
type AdminValues = z.infer<typeof adminSchema>;

export const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<any[]>([]);
  const settingsForm = useForm<SettingsValues>({ resolver: zodResolver(settingsSchema) });
  const adminForm = useForm<AdminValues>({ resolver: zodResolver(adminSchema), defaultValues: { role: 'EDITOR' } });

  const load = async () => {
    setLoading(true);
    const [settings, adminList] = await Promise.all([adminApi.getSettings(), adminApi.getAdmins()]);
    settingsForm.reset({
      siteName: settings.siteName,
      logoUrl: settings.logoUrl,
      copyright: settings.copyright,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      supportEmail: settings.supportEmail,
      visitsDaily: settings.analytics.visitsDaily,
      visitsWeekly: settings.analytics.visitsWeekly,
      visitsMonthly: settings.analytics.visitsMonthly,
      uniqueVisitors: settings.analytics.uniqueVisitors
    });
    setAdmins(adminList);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <SectionHeader title="系统与安全管理" description="维护站点基础设置、SEO、管理员账号、RBAC 与备份导出。" />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form className="glass-panel rounded-3xl p-5 space-y-4" onSubmit={settingsForm.handleSubmit(async (values) => {
          await adminApi.updateSettings({
            siteName: values.siteName,
            logoUrl: values.logoUrl,
            copyright: values.copyright,
            seoTitle: values.seoTitle,
            seoDescription: values.seoDescription,
            supportEmail: values.supportEmail,
            analytics: {
              visitsDaily: values.visitsDaily,
              visitsWeekly: values.visitsWeekly,
              visitsMonthly: values.visitsMonthly,
              uniqueVisitors: values.uniqueVisitors
            }
          });
          alert('设置已更新');
        })}>
          <h3 className="text-xl font-semibold text-white">站点设置</h3>
          <input {...settingsForm.register('siteName')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="站点名称" />
          <input {...settingsForm.register('logoUrl')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Logo URL" />
          <input {...settingsForm.register('copyright')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="版权信息" />
          <input {...settingsForm.register('seoTitle')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="SEO 标题" />
          <textarea {...settingsForm.register('seoDescription')} rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="SEO 描述" />
          <input {...settingsForm.register('supportEmail')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="支持邮箱" />
          <div className="grid gap-4 md:grid-cols-2">
            <input type="number" {...settingsForm.register('visitsDaily')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="日访问" />
            <input type="number" {...settingsForm.register('visitsWeekly')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="周访问" />
            <input type="number" {...settingsForm.register('visitsMonthly')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="月访问" />
            <input type="number" {...settingsForm.register('uniqueVisitors')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="独立访客" />
          </div>
          <div className="flex gap-3">
            <button className="rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">保存设置</button>
            <button type="button" onClick={async () => { const backup = await adminApi.exportBackup(); const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'portal-backup.json'; anchor.click(); URL.revokeObjectURL(url); }} className="rounded-full border border-white/10 px-5 py-3">导出备份</button>
          </div>
        </form>

        <div className="space-y-6">
          <form className="glass-panel rounded-3xl p-5 space-y-4" onSubmit={adminForm.handleSubmit(async (values) => {
            await adminApi.createAdmin({ ...values, permissions: (values.permissions ?? '').split(',').map((item) => item.trim()).filter(Boolean) });
            adminForm.reset({ role: 'EDITOR' } as Partial<AdminValues>);
            await load();
          })}>
            <h3 className="text-xl font-semibold text-white">管理员与 RBAC</h3>
            <input {...adminForm.register('name')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="管理员名称" />
            <input {...adminForm.register('email')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="管理员邮箱" />
            <input type="password" {...adminForm.register('password')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="密码" />
            <select {...adminForm.register('role')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="EDITOR">EDITOR</option>
              <option value="ANALYST">ANALYST</option>
            </select>
            <input {...adminForm.register('permissions')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="权限列表，逗号分隔" />
            <button className="rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">新增管理员</button>
          </form>

          <div className="glass-panel rounded-3xl p-5 space-y-4">
            {admins.map((admin) => (
              <div key={admin._id ?? admin.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                <div>
                  <p className="font-semibold text-white">{admin.name}</p>
                  <p className="text-sm text-slate-400">{admin.email} · {admin.role}</p>
                </div>
                <button onClick={async () => { await adminApi.deleteAdmin(admin._id ?? admin.id); await load(); }} className="rounded-full bg-rose-500/20 px-4 py-2 text-sm text-rose-200">删除</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
