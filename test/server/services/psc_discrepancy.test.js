describe('services/pscDiscrepancy', () => {
    const request = require('request-promise-native');
    const Service = require(`${serverRoot}/services/psc_discrepancy`);
    const service = new Service();
    beforeEach(done => {
      sinon.reset();
      sinon.restore();
      done();
    });
    afterEach(done => {
      sinon.reset();
      sinon.restore();
      done();
    });
    it('should save an obliged entity\'s email to the PSC Discrepancy Service', () => {
      let postOptions = {
        method: 'POST',
        uri: `${process.env.PSC_DISCREPANCY_REPORT_SERVICE_BASE_URL}`,
        body: {
          email: 'matt@matt.com'
        },
        json: true
      };
      let stub = sinon.stub(request, 'post').returns(Promise.resolve({key:"value"}));
      service.request = stub;
      expect(service.saveEmail('matt@matt.com')).to.eventually.eql({key:"value"});
      expect(stub).to.have.been.calledOnce;
      expect(stub).to.have.been.calledWith(postOptions);
    });
  });