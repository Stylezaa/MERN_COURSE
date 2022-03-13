const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    //excluding Authentication token for some api ex:  login api
    path: [
      { url: `/\/api\/v1\/products(.*)/`, methods: ["GET", "OPTIONS"] },
      //url: /\/api\/v1\/products(.*)/ is for allow all api url after * (for test => https://regex101.com/)
      // for excluding authentication token some method ex: GET method http
      { url: `/\/api\/v1\/categories(.*)/`, methods: ["GET", "OPTIONS"] },
      "/api/v1/users/login",
      "/api/v1/users/register",
    ],
  });
}

//For check is Admin ?
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
