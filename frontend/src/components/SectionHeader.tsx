export const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
    <div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {description ? <p className="text-sm text-slate-300">{description}</p> : null}
    </div>
  </div>
);
