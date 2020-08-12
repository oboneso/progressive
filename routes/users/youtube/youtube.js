// const CONFIG = require('../../config');
// const google = require('googleapis').google;
// const jwt = require('jsonwebtoken');
// const OAuth2 = google.auth.OAuth2;
// const cookieParser = require("cookie-parser");


// router.get('/youtube', (req, res) => {
//   const oauth2client = new OAuth2(
//     CONFIG.oauth2Credentials.client_id,
//     CONFIG.oauth2Credentials.client_secret,
//     CONFIG.oauth2Credentials.redirect_uris[0]
//   )

//   const loginLink = oauth2client.generateAuthUrl({
//     access_type: 'offline',
//     scope: CONFIG.oauth2Credentials.scopes
//   })
//   if (!req.cookies.jwt) {
//     return res.render('users/youtube', { loginLink: loginLink })
//   }
//   oauth2client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret);

//   // Call the youtube api
//   const service = google.youtube('v3');

//   // Get user subscription list
//   service.subscriptions.list({
//     auth: oauth2client,
//     mine: true,
//     part: "snippet,contentDetails",
//     maxResults: 50
//   }).then((response) => {
//     console.log(response)

//     return res.render('users/youtube', { loginLink: loginLink })
//     // return res.render('users/subscriptions', { subscriptions: response.data.items })
//   })

// })

// router.get('/subscription_list', (req, res) => {
//   if (!req.cookies.jwt) {
//     return res.redirect('/users/youtube');
//   }

//   const oauth2client = new OAuth2(
//     CONFIG.oauth2Credentials.client_id,
//     CONFIG.oauth2Credentials.client_secret,
//     CONFIG.oauth2Credentials.redirect_uris[0]
//   )
//   oauth2client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret);

//   // Call the youtube api
//   const service = google.youtube('v3');

//   // Get user subscription list
//   service.subscriptions.list({
//     auth: oauth2client,
//     mine: true,
//     part: "snippet,contentDetails",
//     maxResults: 50
//   }).then((response) => {
//     console.log(response)

//     return res.render('users/subscriptions', { subscriptions: response.data.items })
//   })
// })