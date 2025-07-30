'use client';
import useDarkMode from '../hooks/useDarkMode';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useDarkMode();

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      aria-label="Toggle dark mode"
      className={`relative inline-flex h-6 w-12 items-center rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span
        className={`h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : ''}`}
      />
    </button>
  );
}
