describe('routes/Report', () => {

  let app = require(`${serverRoot}/app`);

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

  it('should serve up the index page with no mount path', () => {
    let slug = '/';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the index page on the "/report-a-discrepancy" mount path', () => {
    let slug = '/report-a-discrepancy';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should fail to serve up a page on an unhandled mount path', () => {
    let slug = '/not-a-report-a-discrepancy-url';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(404);
      });
  });

});
