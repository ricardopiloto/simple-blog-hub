import { useMemo } from 'react';

const PARTICLE_COUNT = 40;
const DEFAULT_OPACITY = 0.2;

interface SceneWeatherEffectProps {
  type: 'rain' | 'snow';
  opacity?: number;
}

export function SceneWeatherEffect({ type, opacity = DEFAULT_OPACITY }: SceneWeatherEffectProps) {
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, i) => i), []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {type === 'rain' && (
        <div className="absolute inset-0" style={{ opacity }}>
          {particles.map((i) => (
            <div
              key={i}
              className="absolute bg-foreground rounded-full animate-scene-rain"
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
        <div className="absolute inset-0" style={{ opacity }}>
          {particles.map((i) => (
            <div
              key={i}
              className="absolute rounded-full bg-foreground animate-scene-snow"
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
