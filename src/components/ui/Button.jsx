import { cn } from '../../utils/cn';

export const Button = ({ children, variant = 'primary', size = 'default', className, onClick, type = 'button', disabled }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#cf95fc] to-[#f5d0fe] text-gray-900 hover:opacity-90",
    secondary: "bg-transparent border border-gray-600 text-white hover:border-gray-400 hover:bg-white/5",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-6 py-2 text-sm",
    lg: "h-12 px-8 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
};
