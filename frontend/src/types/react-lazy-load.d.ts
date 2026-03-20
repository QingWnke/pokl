declare module 'react-lazy-load' {
  import { ComponentType, ReactNode } from 'react';

  export interface LazyLoadProps {
    children?: ReactNode;
    className?: string;
    debounce?: boolean;
    height?: number | string;
    offset?: number | boolean;
    throttle?: number;
    width?: number | string;
  }

  const LazyLoad: ComponentType<LazyLoadProps>;
  export default LazyLoad;
}
