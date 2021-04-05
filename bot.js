const config = require('./config');//imports keys
const Twit = require('twit');
const { createCanvas } = require("canvas");
const fs = require("fs");

const T = new Twit(config);

// const sleepLoop = () => {
//   makeTweet();
//   setTimeout(sleepLoop, 60 * 60 * 1000);
// };

const newMasterpiece = (size) => {
  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;

  // square 1
  ctx.fillStyle = `#${getHex()}`;
  ctx.fillRect(0, 0, size, size);

  const schema = Math.floor(Math.random()*4);
  switch(schema) {
      case 0:
        // no square 2
        // square 3
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.2, size*0.3, size*0.6, size*0.6);
        // square 4
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.3, size*0.45, size*0.4, size*0.4);
        break;
      case 1:
        // square 2
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.1, size*0.15, size*0.8, size*0.8);
        // no square 3
        // square 4
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.3, size*0.45, size*0.4, size*0.4);
        break;
      case 2:
        // square 2
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.1, size*0.15, size*0.8, size*0.8);
        // square 3
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.2, size*0.3, size*0.6, size*0.6);
        // no square 4
        break;
      default:
        // square 2
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.1, size*0.15, size*0.8, size*0.8);
        // square 3
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.2, size*0.3, size*0.6, size*0.6);
        // square 4
        ctx.fillStyle = `#${getHex()}`;
        ctx.fillRect(size*0.3, size*0.45, size*0.4, size*0.4);
    }
  return canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
};


const sendTweet = (image, newNumber) => {
  T.post( "media/upload", { media_data: image }, (error, data, response) => {
      if (error) {
        console.error(error);
      }
      const params = {
        status: `Homage to the Square ${newNumber}`,
        media_ids: data.media_id_string,
      };

      T.post("statuses/update", params, (error, data, response) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Status updated.");
        }
      });
    });
};

const makeTweet = () => {
  let newNumber;
  T.get("statuses/user_timeline", { screen_name: "AlbersBot", count: 1 }, (err, data, response) => {
    if (!err) {
    const parse = parseInt(data[0].text.match( /\d+/g ));
    newNumber = isNaN(parse) ? 1 : parse + 1;
    // generate a new image (size)
    sendTweet( newMasterpiece(400), newNumber);
  }
  });
}
// Get random colour in hex

const hexify = (rgb) => {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

const getHex = () => {
  const red = hexify(Math.floor(256*Math.random()));
  const green = hexify(Math.floor(256*Math.random()));
  const blue = hexify(Math.floor(256*Math.random()));
  return red+green+blue;
};

// makeTweet();
