const envVars = {
  setVars: () => {
    process.env.NODE_ENV = 'test-unit';
    process.env.NODE_PORT = '3009';
    process.env.NODE_HOSTNAME = 'localhost';
    process.env.NODE_HOSTNAME_SECURE = 'localhost';
    process.env.NODE_BASE_URL = 'http://localhost:3009';
    process.env.NODE_BASE_URL_SECURE = 'http://localhost:3009';
    process.env.CACHE_SERVER = 'localhost:1234';
    process.env.COOKIE_SECRET = 'xyz123';
    process.env.NUNJUCKS_LOADER_WATCH = false;
    process.env.NUNJUCKS_LOADER_NO_CACHE = true;
    process.env.CDN_HOST = 'http://localhost:3009';
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_BASE_URL = 'http://api.localhost:3008';
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_API_KEY = 'abc123';
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_USERNAME = '';
    process.env.PSC_DISCREPANCY_REPORT_SERVICE_PASSWORD = '';
  }
};

module.exports = envVars;
