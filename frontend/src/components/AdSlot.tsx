import { AdSlot as AdSlotType } from '../types';
import { classNames } from '../utils/format';

interface Props {
  ad?: AdSlotType;
  className?: string;
}

export const AdSlot = ({ ad, className }: Props) => {
  if (!ad || !ad.active) return null;

  return (
    <a
      href={ad.redirectUrl}
      target="_blank"
      rel="noreferrer"
      className={classNames('glass-panel group relative block overflow-hidden rounded-2xl', className)}
    >
      <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
        Ad
      </span>
      <img src={ad.mediaUrl} alt={ad.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
    </a>
  );
};
