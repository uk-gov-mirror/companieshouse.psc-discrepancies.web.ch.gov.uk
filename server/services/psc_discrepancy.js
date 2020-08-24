const rp = require('request-promise-native');
const logger = require(`${serverRoot}/config/winston`);

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
    logger.info('Service request to fetch report, with payload: ', options);
    return this.request(options);
  }

  saveObligedEntityType(obligedEntityType) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'POST',
      body: {
        obliged_entity_type: obligedEntityType,
        status: 'INCOMPLETE'
      }
    });
    logger.info('Service request to save obliged entity type, with payload: ', options);
    return this.request(options);
  }

  saveContactName (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_type: data.obliged_entity_type,
        obliged_entity_contact_name: data.obliged_entity_contact_name,
        status: 'INCOMPLETE',
        etag: data.etag
      }
    });
    logger.info('Service request to save contact name, with payload: ', options);
    return this.request(options);
  }

  saveEmail (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_type: data.obliged_entity_type,
        obliged_entity_contact_name: data.obliged_entity_contact_name,
        obliged_entity_email: data.obliged_entity_email,
        obliged_entity_telephone_number: data.obliged_entity_telephone_number,
        status: 'INCOMPLETE',
        etag: data.etag
      }
    });
    logger.info('Service request to save email, with payload: ', options);
    return this.request(options);
  }

  saveCompanyNumber (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_type: data.obliged_entity_type,
        obliged_entity_contact_name: data.obliged_entity_contact_name,
        obliged_entity_email: data.obliged_entity_email,
        obliged_entity_telephone_number: data.obliged_entity_telephone_number,
        company_number: data.company_number,
        status: 'INCOMPLETE',
        etag: data.etag
      }
    });
    logger.info('Service request to save company number, with payload: ', options);
    return this.request(options);
  }

  saveStatus (data) {
    const options = Object.assign(this._getBaseOptions(), {
      method: 'PUT',
      uri: `${this.server.baseUrl}${data.selfLink}`,
      body: {
        obliged_entity_type: data.obliged_entity_type,
        obliged_entity_contact_name: data.obliged_entity_contact_name,
        obliged_entity_email: data.obliged_entity_email,
        obliged_entity_telephone_number: data.obliged_entity_telephone_number,
        company_number: data.company_number,
        status: 'COMPLETE',
        etag: data.etag
      }
    });
    logger.info('Service request to save email, with payload: ', options);
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
    logger.info('Service request to save discrepancy details, with payload: ', options);
    return this.request(options);
  }
}
module.exports = PscDiscrepancy;
