interface FastNearLib {
  version: string;
  config: {
    apiEndpoint: string;
    timeout: number;
    retryAttempts: number;
  };
  doSomething: () => string;
  initialize: (options?: { apiEndpoint?: string }) => boolean;
}

// Extend the Window interface to include the FastNear library
declare global {
  interface Window {
    FastNear: FastNearLib;
  }
}

export {}; 