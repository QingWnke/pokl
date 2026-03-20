import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { adminApi } from '../api/admin';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@example.com', password: 'Admin123!' }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <form
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-glow"
        onSubmit={handleSubmit(async (values) => {
          try {
            const data = await adminApi.login(values);
            localStorage.setItem('admin-token', data.token);
            localStorage.setItem('admin-user', JSON.stringify(data.admin));
            navigate('/admin');
          } catch {
            setError('root', { message: '登录失败，请检查账号密码。' });
          }
        })}
      >
        <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Admin Portal</p>
        <h1 className="mt-3 text-3xl font-black text-white">后台登录</h1>
        <div className="mt-6 space-y-4">
          <input {...register('email')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="邮箱" />
          <input type="password" {...register('password')} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="密码" />
          {errors.email ? <p className="text-sm text-rose-300">{errors.email.message}</p> : null}
          {errors.password ? <p className="text-sm text-rose-300">{errors.password.message}</p> : null}
          {errors.root ? <p className="text-sm text-rose-300">{errors.root.message}</p> : null}
        </div>
        <button disabled={isSubmitting} className="mt-6 w-full rounded-full bg-brand-600 px-6 py-3 font-semibold text-white">
          {isSubmitting ? '登录中...' : '登录后台'}
        </button>
      </form>
    </div>
  );
};
