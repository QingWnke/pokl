export const formatDate = (value: string) => new Date(value).toLocaleDateString();
export const formatNumber = (value: number) => Intl.NumberFormat('en-US').format(value);
export const buildStars = (rating: number) => Array.from({ length: 5 }, (_, index) => index < Math.round(rating));
export const classNames = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ');
