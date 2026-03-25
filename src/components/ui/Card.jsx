import { cn } from '../../utils/cn';

export const Card = ({ children, className }) => {
  return (
    <div className={cn("glass-panel rounded-2xl overflow-hidden", className)}>
      {children}
    </div>
  );
};

Card.Header = ({ children, className }) => (
  <div className={cn("px-6 py-4 border-b border-border/50", className)}>
    {children}
  </div>
);

Card.Body = ({ children, className }) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

Card.Footer = ({ children, className }) => (
  <div className={cn("px-6 py-4 bg-surface-hover/30 border-t border-border/50", className)}>
    {children}
  </div>
);
