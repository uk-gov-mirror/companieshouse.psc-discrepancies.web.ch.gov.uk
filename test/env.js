const envVars = {
  setVars: () => {
    process.env.NODE_ENV = "DEV"
    process.env.NODE_PORT = "3009";
    process.env.NODE_HOSTNAME = "web.chs-dev.internal";
    process.env.NODE_HOSTNAME_SECURE = "web.chs-dev.internal";
    process.env.NODE_BASE_URL = "web.chs-dev.internal";
    process.env.NODE_BASE_URL_SECURE = "web.chs-dev.internal";
    process.env.NUNJUCKS_LOADER_WATCH = false
    process.env.NUNJUCKS_LOADER_NO_CACHE =true
    process.env.CDN_HOST = "http://localhost:3009";
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_BASE_URL = "http://web.chs-dev.internal:18522";
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_API_KEY = "abc123";
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_USERNAME= "";
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_PASSWORD = "";
  }
};

module.exports = envVars;
