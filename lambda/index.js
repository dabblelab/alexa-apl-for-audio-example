/* eslint-disable  func-names */
/* eslint-disable  no-console */
const main = require('./main.json');
const Alexa = require('ask-sdk-core');
const Util = require('./util.js');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      const backgroundAudio = Util.getS3PreSignedUrl("Media/your-background-music.mp3").replace(/&/g,'&amp;');
      const voice = Util.getS3PreSignedUrl("Media/voice-or-speech.mp3").replace(/&/g,'&amp;');
       if(supportsAPL(handlerInput))
        {
         {
             handlerInput.responseBuilder
                .addDirective({
                    "type": "Alexa.Presentation.APL.RenderDocument",
                    "token": "token",
                    "document": main,   
                    "datasources":{}
                })
         }
         return handlerInput.responseBuilder
      .speak("This is a demo explaining APL for Audio by Dabble Lab")
      .addDirective({
        "type": "Alexa.Presentation.APLA.RenderDocument",
        "token": "developer-provided-string",
        "document": {
            "version": "0.9",
            "type": "APLA",
            "mainTemplate": {
                "item": {
                "type": "Mixer",
            "items": [
            {
                "type": "Audio",
                "source": `${voice}`,
            },
            {
                "type": "Audio",
                "source": `${backgroundAudio}`,
                "filters": [
                {
                    "type": "Volume",
                    "amount": "20%"
                }
            ]
        }
    ]
          
      }
    }
  },
  "datasources": {}
})
      .getResponse();
    }
    else
    {
        return handlerInput.responseBuilder.withSimpleCard().speak("APLA is not supported").getResponse();
    }
   
  },
};

function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context
    .System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface !== null && aplInterface !== undefined;
}

const AboutIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
    const speechText = 'This is a basic starter template for building an alea skill that uses the alexa presentation language. It is avaiable free from dabblelab.com.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = Alexa.SkillBuilders.custom()
    
  .addRequestHandlers(
    LaunchRequestHandler,
    AboutIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();