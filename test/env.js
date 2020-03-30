const envVars = {
    setVars: () => {
        process.env.NODE_ENV = "test node env"
        process.env.PSC_DISCREPANCIES_WEB_PORT = "3600";
        process.env.WEB_DOMAIN = "web.chs-dev.internal";
        process.env.NODE_HOSTNAME = "node_hostname";
        process.env.NODE_HOSTNAME_SECURE = "node_hostname_secure";
        process.env.NUNJUCKS_LOADER_WATCH = "nunjucks_loader_watch";
        process.env.NUNJUCKS_LOADER_NO_CACHE = "nunjucks_loader_no_cache";
        process.env.CDN_HOST = "cdn_host";
        process.env.PSC_DISCREPANCIES_API_CH_GOV_UK_URL = "http://web.chs-dev.internal:18522";
        // This Request key is just a random 256 bit base64 encoded string
        process.env.CHS_API_KEY = "uqq1imjrxynuNrPPSr32fsC5KQaHV42uu08MKgizyj0=";
    }
  };

  module.exports = envVars;