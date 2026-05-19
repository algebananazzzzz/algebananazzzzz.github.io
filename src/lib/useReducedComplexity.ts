import { useEffect, useState } from 'react';

export function useReducedComplexity(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 720px)');
    const update = () => setReduced(motion.matches || mobile.matches);
    update();
    motion.addEventListener('change', update);
    mobile.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      mobile.removeEventListener('change', update);
    };
  }, []);

  return reduced;
}
