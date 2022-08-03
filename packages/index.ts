import { WebPerformanceObserver } from 'core/webPerformance';
import { GazeConfig } from 'types/gaze';
import { get, getKeys, has, set } from 'utils/reflect';

const mergeConfig = (userConfig: GazeConfig): GazeConfig => {
  return getKeys(userConfig).reduce(
    (prev, k) => {
      has(prev, k) && set(prev, k, get(userConfig, k));
      return prev;
    },
    {
      target: 'http://localhost:9000',
      logErrors: false,
      release: ''
    }
  );
};

export class Gaze {
  static init(config: GazeConfig) {
    const mergedConfig = mergeConfig(config);

    new WebPerformanceObserver(mergedConfig).init();
    // TODO
  }
}
