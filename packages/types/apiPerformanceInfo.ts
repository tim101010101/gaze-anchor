export interface ApiPerformanceInfo {
  url: string;
  type: 'xhr' | 'fetch';
  param?: any;
  response: any;
  // TODO
}