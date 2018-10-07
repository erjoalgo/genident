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



if (!flags.text) {
  throw "must provide text to encode";
} else  {
  var fun_idx = IDENT_FUNS.map(nth(0)).
      indexOf(flags.identfun);
  if (fun_idx == -1) {
    throw "unknown ident function: "+flags.identfun;
  } else  {
    identfun = IDENT_FUNS[fun_idx][1];
    text = flags.text;
    size = parseInt(flags.size, 10);
    output_sans_ext = flags.output || text;

    var output_filename = identfun(text, size, output_sans_ext);
    console.log( "wrote to "+output_filename);
  }
}


function jdenticon ( val, size, output_filename_sans_ext ) {
  var _jdenticon = require("jdenticon");
  var output_filename = output_filename_sans_ext+".png";
  var png = _jdenticon.toPng(val, size);
  fs.writeFileSync(output_filename, png);
  return output_filename;
}

function identicon ( val, size, output_filename_sans_ext ) {
  var _identicon = require('identicon');
  // Synchronous API
  var output_filename = output_filename_sans_ext+".png";
  var buffer = _identicon.generateSync({ id: val, size: size});
  fs.writeFileSync(output_filename, buffer);
  return output_filename;
}

// Local Variables:
// compile-command: "./genident.js ejalfonso 500"
// js-indent-level: 2
// End:
