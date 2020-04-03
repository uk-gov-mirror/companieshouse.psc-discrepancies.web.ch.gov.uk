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
    console.log('=======server-vars========');
    console.log(this.server);
    const options = {
      method: 'POST',
      uri: `${this.server.baseUrl}`,
      headers: {
        authorization: this.server.apiKey
      },
      body: {
        obliged_entity_email: email
      },
      json: true
    };
    return this.request(options);
  }
}
module.exports = PscDiscrepancy;
