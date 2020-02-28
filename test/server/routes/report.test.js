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

  it('should serve up the index page', () => {
    let slug = '/';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the index page', () => {
    let slug = '/report-a-discrepancy';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should fail serve up the index page', () => {
    let slug = '/not-a-report-a-discrepancy-url';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(404);
      });
  });

});
