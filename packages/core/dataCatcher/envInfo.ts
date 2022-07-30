import { BrowserType, EnvInfo, MetaInfo, OSType } from 'types/envInfo';
import { getMatched, getTestStrFn } from 'utils/index';

export class Env implements EnvInfo {
  readonly origin: string;
  readonly url: string;
  readonly title: string;
  readonly referer: string;

  readonly os: MetaInfo<OSType>;
  readonly browser: MetaInfo<BrowserType>;

  readonly language: string;
  readonly network: string;

  constructor() {
    const { navigator: nvg, location: loc, document: doc } = window;

    this.origin = loc.origin;
    this.url = loc.href;
    this.title = doc.title;
    this.referer = doc.referrer;

    this.os = getOS(nvg.userAgent);
    this.browser = getBrowser(nvg.userAgent);

    this.language = nvg.language;
    this.network = nvg.connection.type; // problem here
  }
}

type BrowserInfoEnum = Array<{
  type: BrowserType;
  flag: boolean;
  version: string;
}>;

type GetMetaInfoFn<T> = (ua: string) => { type: T; version: string };

const getBrowser: GetMetaInfoFn<BrowserType> = ua => {
  const typeEnum: BrowserInfoEnum = [
    {
      type: BrowserType.Chrome,
      flag: ua.indexOf('Chrome') > -1 || ua.indexOf('CriOS') > -1,
      version: getMatched(ua, /Chrome\/([\d.]+)/, 1)
    },
    {
      type: BrowserType.Safari,
      flag: ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1,
      version: getMatched(ua, /Version\/([\d.]+)/, 1)
    },
    {
      type: BrowserType.Edge,
      flag: ua.indexOf('Edge') > -1,
      version: getMatched(ua, /Edge\/([\d.]+)/, 1)
    },
    {
      type: BrowserType.IE,
      flag: ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1,
      version: getMatched(ua, /(MSIE\s|Trident.*rv:)([\w.]+)/, 2)
    },
    {
      type: BrowserType.Firefox,
      flag: ua.indexOf('Firefox') > -1,
      version: getMatched(ua, /Firefox\/([\d.]+)/, 1)
    },
    {
      type: BrowserType.Opera,
      flag: ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1,
      version: getMatched(ua, /Opera\/([\d.]+)/, 1)
    }
  ];

  typeEnum.map(v => {
    if (v.flag) {
      return {
        type: v.type,
        version: v.version
      };
    }
  });

  return {
    type: BrowserType.Unknown,
    version: ''
  };
};

const getOS: GetMetaInfoFn<OSType> = ua => {
  const testUA = getTestStrFn(ua);

  return {
    type: testUA([/compatible/i, /Windows/i])
      ? OSType.Windows
      : testUA([/Macintosh/i, /MacIntel/i])
      ? OSType.MacOS
      : testUA(/Ubuntu/i)
      ? OSType.Linux
      : OSType.Unknown,

    //TODO no idea to get the detailed version number for the time being...
    version: ''
  };
};
