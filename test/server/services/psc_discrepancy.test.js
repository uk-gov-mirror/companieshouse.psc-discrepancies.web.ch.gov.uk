const request = require('request-promise-native');
const Service = require(`${serverRoot}/services/psc_discrepancy`);
const service = new Service();

const serviceData = require(`${testRoot}/server/_fakes/data/services/psc_discrepancy`);

describe('services/pscDiscrepancy', () => {

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

  it('should correctly set the base options for the PSC Discrepancy Service', () => {
    expect(service._setBaseOptions()).to.have.own.property('headers');
    expect(service._setBaseOptions()).to.have.own.property('uri');
    expect(service._setBaseOptions()).to.have.own.property('json').that.is.a('boolean');
    expect(service._setBaseOptions()).to.have.nested.property('headers.authorization');
  });

  it('should save an obliged entity\'s email to the PSC Discrepancy Service', () => {
    let stub = sinon.stub(request, 'post').returns(Promise.resolve(serviceData.oeEmailPost));
    service.request = stub;
    expect(service.saveEmail('matt@matt.com')).to.eventually.eql(serviceData.oeEmailPost);
    expect(stub).to.have.been.calledOnce;
  });

  it('should save the PSC discrepancy details to the PSC Discrepancy Service', () => {
    let stub = sinon.stub(request, 'post').returns(Promise.resolve(serviceData.discrepancyDetails));
    service.request = stub;
    const data = {
      selfLink: 'psc-discrepancy-reports/abc123',
      payload: {
        details: 'some data'
      }
    };
    expect(service.saveDiscrepancyDetails(data)).to.eventually.eql(serviceData.discrepancyDetails);
    expect(stub).to.have.been.calledOnce;
  });
});
