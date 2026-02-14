import { createContext, useContext, useCallback, useState, ReactNode } from 'react';

const STORAGE_KEY = 'scene-effects-enabled';

interface SceneEffectsContextType {
  sceneEffectsEnabled: boolean;
  toggleSceneEffects: () => void;
}

const SceneEffectsContext = createContext<SceneEffectsContextType | undefined>(undefined);

function readStored(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'false') return false;
  if (stored === 'true') return true;
  return true; // default: enabled
}

export function SceneEffectsProvider({ children }: { children: ReactNode }) {
  const [sceneEffectsEnabled, setSceneEffectsEnabled] = useState(readStored);

  const toggleSceneEffects = useCallback(() => {
    setSceneEffectsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <SceneEffectsContext.Provider value={{ sceneEffectsEnabled, toggleSceneEffects }}>
      {children}
    </SceneEffectsContext.Provider>
  );
}

export function useSceneEffects() {
  const context = useContext(SceneEffectsContext);
  if (context === undefined) {
    throw new Error('useSceneEffects must be used within a SceneEffectsProvider');
  }
  return context;
}
