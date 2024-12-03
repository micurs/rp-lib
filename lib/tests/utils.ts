/**
 * Defer the execution of a function for a given time
 * @param tm - the time to defer the execution (in ms)
 * @returns a Promise that resolves after the given time
 */
export const defer = (tm = 0): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), tm);
  });
};

