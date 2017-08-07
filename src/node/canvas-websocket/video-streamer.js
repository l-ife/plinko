const fs = require('fs');
const readline = require('readline');
const ffmpeg = require('fluent-ffmpeg');

process.stdin.on('error', function(err) {
  process.stdout.write(`${err}\n`);
});

const linePrefix = `${process.env.filesName} `;

// YouTube
// const SERVER="x.rtmp.youtube.com/live2";
// const STREAM_KEY="5106-tbme-mxm4-fvvj";

// Twitch.tv
// const SERVER = 'live-sjc.twitch.tv/app';
// const STREAM_KEY = 'live_17380844_UCtYJqUBDYL0BleGKGsG4jLWCnXbzZ?bandwidthtest=true';

let proc = ffmpeg()
  .input(process.stdin)
  .inputFormat('png_pipe')
  .noAudio()

  .output(`./data/${process.env.filesName}.mkv`)
    .outputOptions('-preset veryslow')
    .size(`${1000}x?`)
    .videoBitrate(`${32000}k`)
    .fps(30)

  // .output(`rtmp://${SERVER}/${STREAM_KEY}`)
  //   .format('flv')
  //   .videoCodec('libx264')
  //   .outputOptions('-crf 23')
  //   .outputOptions('-threads 0')
  //   .outputOptions('-preset veryfast')
  //   .outputOptions('-pix_fmt yuv420p')
  //   .outputOptions('-flags +global_header')
  //   .size(`${250}x?`)
  //   .videoBitrate('3000k')
  //   .fps(5)

  .on('start', function(command) {
    process.stdout.write(`Running: ${command}\n`);
    process.stdout.write(linePrefix);
  })
  .on('progress', function(info) {
    readline.cursorTo(process.stdout, linePrefix.length);
    process.stdout.write('progress ' + JSON.stringify(info));
  })
  .on('end', function() {
    console.log('done processing input stream');
  })
  .on('error', function(err, stdout, stderr) {
      console.log(err.message); //this will likely return "code=1" not really useful
      console.log("stdout:\n" + stdout);
      console.log("stderr:\n" + stderr); //this will contain more detailed debugging info
  })
  .run();
