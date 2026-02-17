import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const PARTICLE_COUNT = 40;
const DEFAULT_OPACITY = 0.2;
const LIGHT_OPACITY = 0.35;

interface SceneWeatherEffectProps {
  type: 'rain' | 'snow';
  opacity?: number;
}

export function SceneWeatherEffect({ type, opacity = DEFAULT_OPACITY }: SceneWeatherEffectProps) {
  const { theme } = useTheme();
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, i) => i), []);

  const isLight = theme === 'light';
  const particleClass = isLight ? 'bg-slate-600' : 'bg-foreground';
  const effectiveOpacity = isLight ? LIGHT_OPACITY : opacity;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {type === 'rain' && (
        <div className="absolute inset-0" style={{ opacity: effectiveOpacity }}>
          {particles.map((i) => (
            <div
              key={i}
              className={`absolute ${particleClass} rounded-full animate-scene-rain`}
              style={{
                left: `${(i * 7) % 100}%`,
                width: '1px',
                height: '12px',
                animationDelay: `${(i * 0.07) % 1.5}s`,
                animationDuration: '1.2s',
              }}
            />
          ))}
        </div>
      )}
      {type === 'snow' && (
        <div className="absolute inset-0" style={{ opacity: effectiveOpacity }}>
          {particles.map((i) => (
            <div
              key={i}
              className={`absolute rounded-full ${particleClass} animate-scene-snow`}
              style={{
                left: `${(i * 11) % 100}%`,
                width: '4px',
                height: '4px',
                animationDelay: `${(i * 0.1) % 2}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
