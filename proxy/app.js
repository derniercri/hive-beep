var accountSid = 'AC0f402cf3e41f80af00c325ec6d496216';
var authToken  = 'd3642044e051e48e6f81f4c4889388bd';
var twilio     = require('twilio'),
    client     = twilio(accountSid, authToken),
    express    = require('express');//,
    bodyParser = require('body-parser'),
    multer     = require('multer');

// Create express app with middleware to parse POST body
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

// OutboundCall
app.post('/outbound_call', function(req, res) {
  var twiml = new twilio.TwimlResponse();

  // Say a message to the call's receiver
  twiml.say('BEEP!', { voice: 'woman', language: 'fr' });

  // Render the TwiML response as XML
  res.type('text/xml');
  res.send(twiml.toString());
});

// Code
app.post('/code', function(req, res) {
  var code = req.body.Digits;
  var twiml = new twilio.TwimlResponse();

  if (code == '1234') {
    twiml.say('We will open the door');
    // Make call in an "other" process
    client.makeCall({
      from: '+33975189387', // use Twillio number (valid on Arduino beep)
      to: '+33642342298',   // to Arduino beep
      url: 'http://beep.ngrok.com/outbound_call' // What to say the Arduino beep
    }, function(error, data) {
      console.log(error);
    });
  }
  else
    twiml.say('Sorry, the code was wrong!');

  // Render the TwiML response as XML
  res.type('text/xml');
  res.send(twiml.toString());
});

// Respond to a call
app.post('/incomingCall', function(req, res) {

    people = {
      '+33642342298': 'Matthieu',
      '+33633984732': 'Fabien',
      '+33678859996': 'Simon'
    };

    name = people[req.body.From];

    // Ask a code for accessing
    var twiml = new twilio.TwimlResponse();
    twiml.gather({
      action: '/code',  // redirect to
      method: 'post',   // method (POST || GET)
      finishOnKey: '*', // finish with '*' (not included)
      timeout: '30'     // wait just 30 seconds
    }, function() {
      this.say('Hello ' + name +'. Please enter the code and then press star.');
    });

    // Render the TwiML response as XML
    res.type('text/xml');
    res.send(twiml.toString());
});

port = process.env.PORT || 3000
app.listen(port, function() {
  console.log("Server listens on port " + port + "...\n- Twilio number: +33 9 75 18 93 87");
});