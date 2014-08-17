var speech = require('windows.media.speechsynthesis');
var nodert_streams = require('nodert-streams');
var fs = require('fs');
var path = require('path');
var edge = require('edge');

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

var filePath = path.join(__dirname, 'speech.wav');

var synth = new speech.SpeechSynthesizer();

synth.synthesizeTextToStreamAsync('Hello Node!', function (err, speechStream) {
  // create an input stream wrapper for the WinRT stream
  var st = new nodert_streams.InputStream(speechStream);
  var fileStream = fs.createWriteStream(filePath);
  fileStream.on('close', function () {
    play(filePath);
  });

  st.pipe(fileStream);
});