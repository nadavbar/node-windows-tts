var speech = require('windows.media.speechsynthesis');
var nodert_streams = require('nodert-streams');
var fs = require('fs');
var path = require('path');
var edge = require('edge');
var ssml = require('ssml');

// data will be saved to speech.wav in the script's directory
// __dirname will always contain the directory of the current script
var filePath = path.join(__dirname, 'speech.wav');

var play = edge.func(function () {/*
     async (input) => {
         return await Task.Run<object>(async () => {
             var player = new System.Media.SoundPlayer((string)input);
             player.PlaySync();
             return null;
         });
    }
*/});

var ssmlDoc = new ssml();
ssmlDoc.prosody({ pitch: '+20st', rate: 'slow' })
    .say('Hello')
     .break(300)
     .prosody({ pitch: '-4st', rate: 'slow' })
     .say('Node!');

var filePath = path.join(__dirname, 'speech_ssml.wav');

var synth = new speech.SpeechSynthesizer();

synth.synthesizeSsmlToStreamAsync(ssmlDoc.toString(), function (err, speechStream) {
  if (err) {
    return console.error(err);
  }
  // create an input stream wrapper for the WinRT stream
  var st = new nodert_streams.InputStream(speechStream);
  var fileStream = fs.createWriteStream(filePath);
  fileStream.on('close', function () {
    play(filePath);
  });

  st.pipe(fileStream);
});