var accountSid = 'AC0f402cf3e41f80af00c325ec6d496216';
var authToken  = 'd3642044e051e48e6f81f4c4889388bd';
var twilio     = require('twilio'),
    client     = twilio(accountSid, authToken),
    express    = require('express');//,
    bodyParser = require('body-parser'),
    multer     = require('multer'),
    db         = require('./database');

// Create express app with middleware to parse POST body
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

// Message to Arduino Hive-beep
app.post('/hivebeep-msg', function(req, res) {
  var twiml = new twilio.TwimlResponse();
  // Say a message to the call's receiver
  twiml.say('BEEP!', { voice: 'woman', language: 'en' });
  // Render the TwiML response as XML
  res.type('text/xml');
  res.send(twiml.toString());
});

// Check code
app.post('/code', function(req, res, next) {
  var code  = req.body.Digits,
      phone = req.body.From;
  var twiml = new twilio.TwimlResponse();

  if (code == '1234') {
    twiml.say('Just a moment, we will open the gate.', { voice: 'woman', language: 'en' });
    // Make call in an "other" process
    client.makeCall({
      from: '+33975189387',   // use Twillio number (valid on Arduino beep)
      to:   '+33678859996',   // to Arduino beep
      url:  'http://beep.ngrok.com/hivebeep-msg' // What to say the Arduino beep
    });
    // Add caller to whitelist
    db.Caller.create({ phone: phone });
  }
  else
    twiml.say('Wrong code... Good luck outdoor!', { voice: 'woman', language: 'en' });

  // Render the TwiML response as XML
  res.type('text/xml');
  res.send(twiml.toString());
});

// Respond to a call
app.post('/incomingCall', function(req, res, next) {
  var twiml = new twilio.TwimlResponse();

  phone = req.body.From;
  db.Caller.findOne({ phone: phone }, function(err, caller) {
    if (err) next(err);
    if (caller) {
      twiml.say('Just a moment, we will open the gate.', { voice: 'woman', language: 'en' });
      client.makeCall({
        from: '+33975189387',   // use Twillio number (valid on Arduino beep)
        to:   '+33678859996',   // to Arduino beep
        url:  'http://beep.ngrok.com/hivebeep-msg' // What to say the Arduino beep
      });
    }
    else {
      twiml.gather({
        action: '/code',  // redirect to
        method: 'post',   // method (POST || GET)
        finishOnKey: '*', // finish with '*' (not included)
        timeout: '30'     // wait just 30 seconds
      }, function() {
        this.say('Please enter the code and then press star.', { voice: 'woman', language: 'en' });
      });
    }

    // Render the TwiML response as XML
    res.type('text/xml');
    res.send(twiml.toString());
  });
});

port = process.env.PORT || 3000
app.listen(port, function() {
  console.log("Server listens on port " + port + "...\n- Twilio number: +33 9 75 18 93 87");
});