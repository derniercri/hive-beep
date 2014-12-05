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

// Code
app.post('/code', function(req, res) {
  var code = req.body.Digits;
  var twiml = new twilio.TwimlResponse();
  if (code == '1234')
    twiml.say('We will open the door');
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
      '+33633984732': 'Fabien'
    };

    name = people[req.body.From];

    //Validate that this request really came from Twilio...
    var twiml = new twilio.TwimlResponse();
    twiml.gather({ action: '/code', method: 'post', finishOnKey:'*' }, function() {
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