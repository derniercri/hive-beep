var accountSid = 'AC0f402cf3e41f80af00c325ec6d496216';
var authToken  = 'd3642044e051e48e6f81f4c4889388bd';
var twilio     = require('twilio'),
    client     = twilio(accountSid, authToken),
    express    = require('express');

// Create express app with middleware to parse POST body
var app = express();

// Create a route to respond to a call
app.post('/incomingCall', function(req, res) {
    //Validate that this request really came from Twilio...
    var twiml = new twilio.TwimlResponse();
    twiml.say('Hello from node.js!');

    // Render the TwiML response as XML
    res.type('text/xml');
    res.send(twiml.toString());
});

app.listen(process.env.PORT || 3000);