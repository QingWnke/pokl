export const MetricsCard = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <div className="glass-panel rounded-3xl p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <h3 className="mt-3 text-3xl font-black text-white">{value}</h3>
    {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
  </div>
);
