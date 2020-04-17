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

  _getBaseOptions () {
    return {
      headers: {
        authorization: this.server.apiKey
      },
      uri: `${this.server.baseUrl}/psc-discrepancy-reports`,
      json: true
    };
  }

  getReport (selfLink) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'GET',
      uri: `${this.server.baseUrl}${selfLink}`
    });
    return this.request(options);
  }

  saveEmail (email) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      body: {
        obliged_entity_email: email
      }
    });
    return this.request(options);
  }

  saveCompanyNumber (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_email: data.obliged_entity_email,
        company_number: data.company_number,
        status: 'INCOMPLETE',
        etag: data.etag
      }
    });
    return this.request(options);
  }

  saveStatus (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_email: data.obliged_entity_email,
        company_number: data.company_number,
        status: 'COMPLETE',
        etag: data.etag
      }
    });
    return this.request(options);
  }

  saveDiscrepancyDetails (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      uri: `${this.server.baseUrl}${data.selfLink}/discrepancies`,
      body: {
        details: data.details
      }
    });
    return this.request(options);
  }
}
module.exports = PscDiscrepancy;
