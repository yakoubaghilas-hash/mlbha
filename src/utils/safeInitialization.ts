/**
 * Safe initialization utilities to prevent crashes at startup
 */

export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  context: string = ''
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    // Silently fail and return fallback
    return fallback;
  }
};

export const safeSync = <T>(
  fn: () => T,
  fallback: T,
  context: string = ''
): T => {
  try {
    return fn();
  } catch (error) {
    // Silently fail and return fallback
    return fallback;
  }
};

/**
 * Wrapper for context initialization that never throws
 */
export const createSafeContextInitializer = () => {
  return {
    async initializeData<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
      return safeAsync(fn, fallback);
    },
    initializeSync<T>(fn: () => T, fallback: T): T {
      return safeSync(fn, fallback);
    },
  };
};
