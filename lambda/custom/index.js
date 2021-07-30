/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const audioDocument = require('./audio.json');
const textDocument = require('./text.json');
const util = require('./util.js')

const AUDIO_TOKEN = "AudioToken";
const TEXT_TOKEN = "TextToken";

const music = util.getS3PreSignedUrl("Media/detour(yt-music).mp3").replace(/&/g,'&amp;')
const gabi = util.getS3PreSignedUrl("Media/Gabi.mp3").replace(/&/g,'&amp;')
const bg = util.getS3PreSignedUrl("Media/alexaBG.png")
const logo = util.getS3PreSignedUrl("Media/dl.png")

const LaunchRequestHandler = {
    canHandle(handlerInput){
        
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput){
        let responseBuilder = handlerInput.responseBuilder
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
            
            // Add the RenderDocument directive to the responseBuilder
            responseBuilder
                .addDirective({
                type: "Alexa.Presentation.APL.RenderDocument",
                token: TEXT_TOKEN,
                document: textDocument,
                datasources: 
                    {
                        "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "properties": {
                            "backgroundImage": {
                            "sources": [
                            {
                                "url": bg,
                                "size": "large"
                            }
                        ]
                    },
                    "textContent": {
                        "primaryText": {
                        "type": "PlainText",
                        "text": "Demo: Alexa Presentation Language for Audio!"
                        }
                    },
                    "logoUrl": logo,
                    "hintText": "Try, \"You can say Hello or goodbye!\""
                    }
                }
            }
                
        })
            .addDirective({
            type: "Alexa.Presentation.APLA.RenderDocument",
            token: AUDIO_TOKEN,
            document: audioDocument,
            datasources: {
                "user": { "name": "Sohini"},
                "source": music,
                "gabi": gabi
                }
            });
        }
        const speakOutput = "Welcome to Alexa Presentation Language for Audio Interface!";
        return responseBuilder
            .speak(speakOutput)
            //.reprompt("You can say Hello or you can say goodbye!")
            .getResponse();
    }
}

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hi there! ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

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
    HelloWorldIntentHandler,
    AboutIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();