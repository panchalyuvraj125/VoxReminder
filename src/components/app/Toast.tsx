import { useEffect, useRef, createContext, useContext, useCallback, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  exiting?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext);
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: 'bg-[#1a1a1c]/90 backdrop-blur-md border-emerald-500/30 text-emerald-400 shadow-lg shadow-black/20 ring-1 ring-emerald-500/20',
  error: 'bg-[#1a1a1c]/90 backdrop-blur-md border-red-500/30 text-red-400 shadow-lg shadow-black/20 ring-1 ring-red-500/20',
  warning: 'bg-[#1a1a1c]/90 backdrop-blur-md border-amber-500/30 text-amber-400 shadow-lg shadow-black/20 ring-1 ring-amber-500/20',
  info: 'bg-[#1a1a1c]/90 backdrop-blur-md border-white/10 text-white/90 shadow-lg shadow-black/20 ring-1 ring-white/10',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = ICONS[toast.type];

  return (
    <div
      className={`${toast.exiting ? 'animate-fade-out' : 'animate-slide-up'} flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md ${COLORS[toast.type]} max-w-sm shadow-lg`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-sm flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);

      const timer = window.setTimeout(() => {
        dismiss(id);
        timers.current.delete(id);
      }, 4000);

      timers.current.set(id, timer);
    },
    [dismiss]
  );

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
