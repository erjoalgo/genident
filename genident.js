#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');


const args = require('args');

var IDENT_FUNS = [["identicon", identicon],
                  ["jdenticon", jdenticon]];

function nth ( n ) {
    return function(arr){return arr[n];};
}

const first = function(arr){return arr[0];}
const flags = args
      .option('text', "The text to encode")
      .option('size', "Size of the image", 150)
      .option('identfun', "Function to use from "+
              IDENT_FUNS.map(nth(0)).join(","),
              IDENT_FUNS[0][0])
      .option('output', 'Output filename without extension. Defaults to TEXT. ')
      .parse(process.argv);



if (flags.text == null) {
  throw "must provide text to encode";
} else  {
    var fun_idx = IDENT_FUNS.map(nth(0)).
        indexOf(flags.identfun);
  if (fun_idx == -1) {
    throw "unknown ident function: "+flags.identfun
  } else  {
    identfun = IDENT_FUNS[fun_idx][1];
    text = flags.text;
    size = parseInt(flags.size);
    output_sans_ext = flags.output || text;
  }
}


function jdenticon ( val, size, output_filename_sans_ext ) {
  var _jdenticon = require("jdenticon");
  var output_filename = output_filename_sans_ext+".png";
  size = 200;
  var png = _jdenticon.toPng(val, size);
  fs.writeFileSync(output_filename, png);
  return output_filename;
}

function identicon ( val, size, output_filename_sans_ext ) {
  var _identicon = require('identicon');
  // Asynchronous API

  // npm install -g minimist identicon jdenticon
  // https://www.npmjs.com/package/identicon
  // apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

  // fix libpng-12 issue:
  // wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb   && sudo dpkg -i /tmp/libpng12.deb   && rm /tmp/libpng12.deb

  // Synchronous API
  var output_filename = output_filename_sans_ext+".png";
  var buffer = _identicon.generateSync({ id: val, size: size});
  fs.writeFileSync(output_filename, buffer);
  return output_filename;
}


var output_filename = identfun(text, size, output_sans_ext);
console.log( "wrote to "+output_filename);

// Local Variables:
// compile-command: "./genident.js ejalfonso 500"
// End:
