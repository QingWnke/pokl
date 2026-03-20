import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  authorName: z.string().min(2, '请输入昵称'),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(6, '请输入至少 6 个字符')
});

type FormValues = z.infer<typeof schema>;

export const ReviewForm = ({ onSubmit }: { onSubmit: (values: FormValues) => Promise<void> }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 }
  });

  return (
    <form
      className="glass-panel space-y-4 rounded-3xl p-5"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        reset({ authorName: '', rating: 5, comment: '' });
      })}
    >
      <h3 className="text-lg font-semibold">提交评分与评论</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <input {...register('authorName')} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="你的昵称" />
          {errors.authorName ? <p className="mt-1 text-xs text-rose-300">{errors.authorName.message}</p> : null}
        </div>
        <div>
          <select {...register('rating')} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
            {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} 星</option>)}
          </select>
        </div>
      </div>
      <div>
        <textarea {...register('comment')} rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="分享你的游戏体验..." />
        {errors.comment ? <p className="mt-1 text-xs text-rose-300">{errors.comment.message}</p> : null}
      </div>
      <button disabled={isSubmitting} className="rounded-full bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-500 disabled:opacity-60">
        {isSubmitting ? '提交中...' : '提交评论'}
      </button>
    </form>
  );
};
