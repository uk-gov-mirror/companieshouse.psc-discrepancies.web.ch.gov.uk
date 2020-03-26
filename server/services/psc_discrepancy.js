const rp = require('request-promise-native');
/**
 * Get product related data
 */
 class PscDiscrepancy {

   constructor() {
     this.server = {
       apiKey: process.env.PSC_SERVICE_API_KEY,
       baseUrl: process.env.PSC_SERVICE_BASE_URL,
       auth: {
         username: process.env.PSC_SERVICE_USERNAME,
         password: process.env.PSC_SERVICE_PASSWORD
       }
     }
   }
   
   saveEmail(email) {
    let options = {
       method: 'POST',
       uri: `${this.server.baseUrl}`,
       body: {
         email: email
       },
       json: true
     };
     rp(options);
   }
 }
 module.exports = PscDiscrepancy;