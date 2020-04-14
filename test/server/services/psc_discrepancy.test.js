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

  it('should fetch report details from the PSC Discrepancy Service', () => {
    let stub = sinon.stub(request, 'get').returns(Promise.resolve(serviceData.reportDetailsGet));
    service.request = stub;
    expect(service.getReport('/psc-discrepancy-reports/xyz123')).to.eventually.eql(serviceData.reportDetailsGet);
    expect(stub).to.have.been.calledOnce;
  });

  it('should save an obliged entity\'s email to the PSC Discrepancy Service', () => {
    let stub = sinon.stub(request, 'post').returns(Promise.resolve(serviceData.obligedEntityEmailPost));
    service.request = stub;
    expect(service.saveEmail('matt@matt.com')).to.eventually.eql(serviceData.obligedEntityEmailPost);
    expect(stub).to.have.been.calledOnce;
  });

  it('should save a company number to the PSC Discrepancy Service', () => {
    let servicePayload = {
      company_number: '12345678',
      obliged_entity_email: 'm@m.com',
      etag: 'xyz123',
      selfLink: 'psc-discrepancy-reports/abc123'
    };
    let stub = sinon.stub(request, 'post').returns(Promise.resolve(serviceData.companyNumberPost));
    service.request = stub;
    expect(service.saveEmail(servicePayload)).to.eventually.eql(serviceData.companyNumberPost);
    expect(stub).to.have.been.calledOnce;
  });

  it('should save the PSC discrepancy details to the PSC Discrepancy Service', () => {
    let stub = sinon.stub(request, 'post').returns(Promise.resolve(serviceData.discrepancyDetailsPost));
    service.request = stub;
    const data = {
      selfLink: 'psc-discrepancy-reports/abc123',
      details: 'some data'
    };
    expect(service.saveDiscrepancyDetails(data)).to.eventually.eql(serviceData.discrepancyDetailsPost);
    expect(stub).to.have.been.calledOnce;
  });
});
