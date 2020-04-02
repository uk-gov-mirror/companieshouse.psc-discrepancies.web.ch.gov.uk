const rp = require('request-promise-native');
/**
 * Get product related data
 */
class PscDiscrepancy {
  constructor () {
    this.server = {
      apiKey: process.env.PSC_DISCREPANCY_REPORT_SERVICE_API_KEY,
      baseUrl: process.env.PSC_DISCREPANCY_REPORT_SERVICE_BASE_URL,
      auth: {
        username: process.env.PSC_DISCREPANCY_REPORT_SERVICE_USERNAME,
        password: process.env.PSC_DISCREPANCY_REPORT_SERVICE_PASSWORD
      }
    };
    this.request = rp;
  }

  saveEmail (email) {
    const options = {
      method: 'POST',
      uri: `${this.server.baseUrl}/psc-discrepancy-reports`,
      body: {
        email: email
      },
      json: true
    };
    return this.request(options);
  }

  saveDiscrepancyDetails (data) {
    const options = {
      method: 'POST',
      uri: `${this.server.baseUrl}/${data.report.serverResponse.links.self}/discrepancies`,
      body: {
        details: data.payload.details,
        links: {
          'psc-discrepancy-reports': `${data.report.serverResponse.links.self}`
        }
      },
      json: true
    };
    return this.request(options);
  }
}
module.exports = PscDiscrepancy;
