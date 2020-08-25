const request = require('request-promise-native');
const logger = require(`${serverRoot}/config/winston`);

const Service = require(`${serverRoot}/services/psc_discrepancy`);
const service = new Service();

const serviceData = require(`${testRoot}/server/_fakes/data/services/psc_discrepancy`);

describe('services/pscDiscrepancy', () => {
  let stubLogger;

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    stubLogger = sinon.stub(logger, 'info').returns(true);
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  const baseOptions = {
    headers: {
      authorization: process.env.PSC_DISCREPANCY_REPORT_SERVICE_API_KEY
    },
    uri: `${process.env.PSC_DISCREPANCY_REPORT_SERVICE_BASE_URL}/psc-discrepancy-reports`,
    json: true
  };

  it('should correctly get the base options for the PSC Discrepancy Service', () => {
    expect(service._getBaseOptions()).to.have.own.property('headers');
    expect(service._getBaseOptions()).to.have.own.property('uri');
    expect(service._getBaseOptions()).to.have.own.property('json').that.is.a('boolean');
    expect(service._getBaseOptions()).to.have.nested.property('headers.authorization');
  });

  it('should fetch report details from the PSC Discrepancy Service', () => {
    const stubRequest = sinon.stub(request, 'get').returns(Promise.resolve(serviceData.reportDetailsGet));
    const stubOpts = sinon.stub(Service.prototype, '_getBaseOptions').returns(baseOptions);
    service.request = stubRequest;
    expect(service.getReport('/psc-discrepancy-reports/xyz123')).to.eventually.eql(serviceData.reportDetailsGet);
    expect(stubRequest).to.have.been.calledOnce;
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should save an obliged entity type to the PSC Discrepancy Service', () => {
    const stubRequest = sinon.stub(request, 'post').returns(Promise.resolve(serviceData.obligedEntityTypePost));
    const stubOpts = sinon.stub(Service.prototype, '_getBaseOptions').returns(baseOptions);
    service.request = stubRequest;
    expect(service.saveObligedEntityType('Financial institution')).to.eventually.eql(serviceData.obligedEntityTypePost);
    expect(stubRequest).to.have.been.calledOnce;
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should save an obliged entity\'s contact name to the PSC Discrepancy Service', () => {
    const servicePayload = {
      obliged_entity_type: 'Financial institution',
      obliged_entity_contact_name: 'matt le-matt',
      etag: 'xyz123',
      selfLink: 'psc-discrepancy-reports/abc123'
    };
    const stubRequest = sinon.stub(request, 'put').returns(Promise.resolve(serviceData.obligedEntityContactNamePost));
    const stubOpts = sinon.stub(Service.prototype, '_getBaseOptions').returns(baseOptions);
    service.request = stubRequest;
    expect(service.saveContactName(servicePayload)).to.eventually.eql(serviceData.obligedEntityContactNamePost);
    expect(stubRequest).to.have.been.calledOnce;
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should save an obliged entity\'s email to the PSC Discrepancy Service', () => {
    const servicePayload = {
      obliged_entity_type: 'Financial institution',
      obliged_entity_contact_name: 'matt le-matt',
      obliged_entity_email: 'm@m.com',
      etag: 'xyz123',
      selfLink: 'psc-discrepancy-reports/abc123'
    };
    const stubRequest = sinon.stub(request, 'put').returns(Promise.resolve(serviceData.obligedEntityEmailPost));
    const stubOpts = sinon.stub(Service.prototype, '_getBaseOptions').returns(baseOptions);
    service.request = stubRequest;
    expect(service.saveEmail(servicePayload)).to.eventually.eql(serviceData.obligedEntityEmailPost);
    expect(stubRequest).to.have.been.calledOnce;
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should save a company number to the PSC Discrepancy Service', () => {
    const servicePayload = {
      company_number: '12345678',
      obliged_entity_email: 'm@m.com',
      etag: 'xyz123',
      selfLink: 'psc-discrepancy-reports/abc123'
    };
    const stubRequest = sinon.stub(request, 'put').returns(Promise.resolve(serviceData.companyNumberPost));
    const stubOpts = sinon.stub(Service.prototype, '_getBaseOptions').returns(baseOptions);
    service.request = stubRequest;
    expect(service.saveEmail(servicePayload)).to.eventually.eql(serviceData.companyNumberPost);
    expect(stubRequest).to.have.been.calledOnce;
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should save a report status to the PSC Discrepancy Service', () => {
    const servicePayload = {
      company_number: '12345678',
      obliged_entity_email: 'm@m.com',
      etag: 'xyz123',
      status: 'COMPLETE',
      selfLink: 'psc-discrepancy-reports/abc123'
    };
    const stubRequest = sinon.stub(request, 'put').returns(Promise.resolve(serviceData.companyNumberPost));
    const stubOpts = sinon.stub(Service.prototype, '_getBaseOptions').returns(baseOptions);
    service.request = stubRequest;
    expect(service.saveEmail(servicePayload)).to.eventually.eql(serviceData.companyNumberPost);
    expect(stubRequest).to.have.been.calledOnce;
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should save the PSC discrepancy details to the PSC Discrepancy Service', () => {
    const stubRequest = sinon.stub(request, 'post').returns(Promise.resolve(serviceData.discrepancyDetailsPost));
    const stubOpts = sinon.stub(Service.prototype, '_getBaseOptions').returns(baseOptions);
    service.request = stubRequest;
    const data = {
      selfLink: 'psc-discrepancy-reports/abc123',
      details: 'some data'
    };
    expect(service.saveDiscrepancyDetails(data)).to.eventually.eql(serviceData.discrepancyDetailsPost);
    expect(stubRequest).to.have.been.calledOnce;
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });
});
