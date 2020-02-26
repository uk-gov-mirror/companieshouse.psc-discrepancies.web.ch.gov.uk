const rp = require('request-promise-native');
/**
 * Manage all requests to SampleServiceOne here
 */
 class SampleServiceOne {
   /**
    * Set default parameters
    */
   constructor() {
     this.server = {};
     this.server.url = process.env.EXAMPLE_SERVICE_1_HOST;
     this.server.apiKey = process.env.EXAMPLE_SERVICE_1_API_KEY;
     this.server.username = process.env.EXAMPLE_SERVICE_1_USERNAME;
     this.server.password = process.env.EXAMPLE_SERVICE_1_PASSWORD;
   }
   /**
    * Get list of all items
    *
    * @return {promise}
    */
   getList() {
     let options = {
       uri: `${this.server.url}/get/list/path`,
       method: 'GET',
        auth: {
          'user': this.server.username,
          'pass': this.server.password
        }
      };
      return rp(options);
   }
   /**
    * Get details for a single item
    *
    * @param itemId {string} - The item ID
    * @return {promise}
    */
   getDetails(itemId) {
     let options = {
       uri: `${this.server.url}/get/details/path/${itemId}`,
       method: 'GET',
        auth: {
          'user': this.server.username,
          'pass': this.server.password
        }
      };
      return rp(options);
   }
   /**
    * Save an item
    *
    * @param data {object} - data to save
    * @return {promise}
    */
   saveItem(data) {
     let options = {
        uri: `${this.server.url}/save/item/path`,
        method: 'POST',
        body: {
          some: 'payload'
        },
        auth: {
          'user': this.server.username,
          'pass': this.server.password
        },
        json: true
      };
      return rp(options);
   }
 }

 module.exports = SampleServiceOne;
