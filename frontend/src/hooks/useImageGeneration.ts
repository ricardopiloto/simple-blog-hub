import { useCallback, useState } from 'react';
import { generateImage, ImageGenerationError } from '@/api/client';

export function useImageGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError('O prompt não pode estar vazio');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const image = await generateImage(trimmed);
      setImageBase64(image);
    } catch (e) {
      setImageBase64(null);
      if (e instanceof ImageGenerationError) {
        setError(e.message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Não foi possível gerar a imagem. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, imageBase64, error, generate };
}
