const keys = require("./keys.json");

module.exports = {
  JWTsecret: 'mysecret',

  oauth2Credentials: {
    client_id: keys.web.client_id,
    project_id: keys.web.project_id,
    auth_uri: keys.web.auth_uri,
    token_uri: keys.web.token_uri,
    auth_provider_x509_cert_url: keys.web.auth_provider_x509_cert_url,
    client_secret: keys.web.client_secret,
    redirect_uris: [
      keys.web.redirect_uris[0]
    ],
    scopes: [
      'https://www.googleapis.com/auth/youtube.readonly'
    ]
  }
}
