// TypeScript declarations for legacy HTML attributes used in schedule table

declare global {
  namespace React {
    interface TdHTMLAttributes<T> {
      borderColor?: string;
    }
    
    interface HTMLAttributes<T> {
      align?: string;
    }
    
    interface TableHTMLAttributes<T> {
      border?: string | number;
      cellPadding?: string | number;
      cellSpacing?: string | number;
      align?: string;
    }
  }
}

export {};