import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { publicApi } from '../api/public';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

type FormValues = z.infer<typeof schema>;

export const ContactPage = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  return (
    <section className="mx-auto max-w-3xl glass-panel rounded-3xl p-6">
      <h2 className="text-3xl font-bold text-white">联系我们</h2>
      <p className="mt-3 text-slate-300">用户反馈、商务合作和技术支持都可以通过此表单提交，或发送邮件至 support@example.com。</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit(async (values) => {
          try {
            await publicApi.submitContact(values);
            reset();
            alert('消息已提交，我们会尽快联系你。');
          } catch {
            setError('root', { message: '提交失败，请稍后再试。' });
          }
        })}
      >
        <input {...register('name')} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="姓名" />
        <input {...register('email')} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="邮箱" />
        <textarea {...register('message')} rows={6} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="请输入你的问题或建议" />
        {errors.root ? <p className="text-sm text-rose-300">{errors.root.message}</p> : null}
        <button disabled={isSubmitting} className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white">{isSubmitting ? '提交中...' : '发送消息'}</button>
      </form>
    </section>
  );
};
