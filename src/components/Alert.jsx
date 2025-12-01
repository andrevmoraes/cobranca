import { useEffect } from 'react';

export default function Alert({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const colors = {
    info: '#00aff0',
    success: '#00a300',
    error: '#e51400',
    warning: '#ff8c00',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      background: colors[type] || colors.info,
      color: '#fff',
      padding: '16px 32px',
      borderRadius: 8,
      fontWeight: 600,
      zIndex: 9999,
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      minWidth: 220,
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
}
