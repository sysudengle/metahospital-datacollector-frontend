import config from './config';

const { API_BASE_URL } = config;

let PROXY = '';
const getProxy = () => PROXY;

const getProxyUrl = (cgi, hostName) => {
  console.log(`getProxyUrl ${PROXY}`);
  let tempCgi = cgi;
  let proxy = PROXY;
  if (PROXY[0] === 's') {
    tempCgi = tempCgi.replace('http://', 'https://');
    proxy = proxy.substr(1);
  } else if (PROXY[0] === 'e') {
    return tempCgi;
  } else {
    tempCgi = tempCgi.replace('https://', 'http://');
  }
  return tempCgi.replace(hostName, proxy);
};

const switchProxy = (hp) => {
  console.warn(`切换到代理${hp}`);
  PROXY = hp;
};

/** 环境 */
const ENV_TYPE  = {
  TEST: 'test',
  TEST2: 'test2',
  DEV: 'dev',
  UAT: 'uat',
  PRE: 'pre',
};
let ENV = 'idc';

const getEnv = () => ENV;
const getUrl = function (cgi, printLog = true) {
  if (printLog) {
    console.log(`getUrl on ${ENV}`);
  }
  if (Object.values(ENV_TYPE).some(v => v === ENV)) {
    return cgi.replace(new RegExp(`^https://${API_BASE_URL}`), `https://${ENV}-${API_BASE_URL}`);
  }
  return cgi;
};
const switchEnv = function (env) {
  if (Object.values(ENV_TYPE).some(v => v === env)) {
    console.warn(`切换到${env}环境`);
    ENV = env;
  }
};

export default {
  getProxy,
  getProxyUrl,
  switchProxy,

  getEnv,
  getUrl,
  switchEnv,
};
