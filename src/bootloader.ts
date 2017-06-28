// Inspired by https://github.com/AngularClass/angular2-bootloader, adopted to our
// TypeScript and TsLint configurations.

export function bootloader(main: () => void): void {
  switch (document.readyState) {
    case "loading":
      const domReadyHandler = () => {
        document.removeEventListener(
          "DOMContentLoaded",
          domReadyHandler,
          false
        );
        main();
      };
      document.addEventListener("DOMContentLoaded", domReadyHandler, false);
      break;
    default:
      main();
  }
}
