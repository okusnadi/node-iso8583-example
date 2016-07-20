var util = require("util");

exports.unpack = function(msg, packager) {
  var chunk = null; //msg;
  var data = '', bitmap = '';
  var step = 4;

  // Need to do it by parts because of console.log(0x723000000e848200.toString(2));
  for (var i = 0; i < packager.length * 2 / (step * 2); i++) {
    chunk = msg.slice(i * step, i * step + step).toString('hex');

    chunkBitmap = parseInt(chunk, 16).toString(2);

    while (chunkBitmap.length < (step * 8)) {
      chunkBitmap = '0' + chunkBitmap;
    }

    data += chunk;
    bitmap += chunkBitmap;
  }

  console.log("isi bitmapnya: " + bitmap);

  var fieldIds = [];
  for(var i in bitmap) {
    console.log("nilai i di unpack: " + i);
    if (i > 0 && bitmap[i] == 1) {
      fieldIds.push(parseInt(i) + 1);
    }
  }

  return {
    data: data,
    bitmap: bitmap,
    fieldIds: fieldIds,
    restData: msg.slice(packager.length)
  };
};

exports.pack = function(data, packager) {
  var bitmap = '';

  //console.log("data di fixed-b: " + util.inspect(data));

  var lastIndex = 0;
  for (var i in data) {
    console.log("i: " + i + "; dari data: " + util.inspect(data));
    if (i > 1) {
      var offset = i - lastIndex - 1;
      for(var j = 0; j < offset; j++) {
        bitmap += '0';
      }
      bitmap += '1';
      lastIndex = i;
    }
  }

  var length = Math.ceil(bitmap.length / (packager.length * 4)) * (packager.length * 4);
  var blength = bitmap.length;
  console.log("length: " + length);
  console.log("blength: " + blength);
  for(var i = 0; i < length - blength; i++) {
    bitmap += '0';
  }

  var msg = parseInt(bitmap,2).toString(16).toUpperCase();
  return {
    msg: msg,
    bitmap: bitmap
  };
};
