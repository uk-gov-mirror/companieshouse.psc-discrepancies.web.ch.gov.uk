const envVars = {
  setVars: () => {
    process.env.NODE_ENV = 'test-unit';
    process.env.NODE_PORT = '3009';
    process.env.NODE_HOSTNAME = 'localhost';
    process.env.NODE_HOSTNAME_SECURE = 'localhost';
    process.env.NODE_BASE_URL = 'http://localhost:3009';
    process.env.NODE_BASE_URL_SECURE = 'http://localhost:3009';
    process.env.COOKIE_NAME = '__SID';
    process.env.CACHE_SERVER = 'localhost:1234';
    process.env.COOKIE_SECRET = 'Xy6onkjQWF0TkRn0hfdqUw==';
    process.env.NUNJUCKS_LOADER_WATCH = false;
    process.env.NUNJUCKS_LOADER_NO_CACHE = true;
    process.env.CDN_HOST = 'http://localhost:3009';
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_BASE_URL = 'http://api.localhost:3008';
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_API_KEY = 'abc123';
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_USERNAME = '';
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_PASSWORD = '';
    process.env.CHS_API_KEY = 'abc';
    process.env.API_URL = 'http://api.localhost:3010';
    process.env.PUBLIC_PAGES = '/,/report-a-discrepancy';
    process.env.COOKIE_DOMAIN = 'chs-dev.internal';
  }
};

module.exports = envVars;
