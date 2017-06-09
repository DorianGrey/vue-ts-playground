/**
 * This function is a utility to simulated delays or durations, e.g. for fetching data.
 * It returns a promise which gets fulfilled once the delay is completed.
 *
 * @param delay Duration of the delay to simulate (in ms).
 * @returns {Promise<void>} Promise which gets fulfilled after the configured delay.
 */
export default function fakeDelay(delay: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), delay);
  });
};