/**
 * Since the browser support of registering an event "once" isn't that broad (yet),
 * we're using this simple wrapper to achieve the same (semantically).
 *
 * @param target The node to attach the listener to.
 * @param event The event to listen to.
 * @param func The function to be executed once the event gets triggered.
 * @returns {()=>undefined} The bound event listener.
 */
export default function onceEventHelper(
  target: Node,
  event: string,
  func: () => void
) {
  const result = function listener() {
    func();
    target.removeEventListener(event, result);
  };
  target.addEventListener(event, result);
  return result;
}
