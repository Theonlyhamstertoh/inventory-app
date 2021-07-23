const fs = require("fs");
function convertImageToBase(req) {
  const image_name = req.file.originalname;
  const image = fs.readFileSync(req.file.path);
  const mimetype = req.file.mimetype;
  const base64Image = image.toString("base64");
  const bufferImage = new Buffer.from(base64Image, "base64");

  return { name: image_name, img: bufferImage, mimetype };
}

function convertBinaryToBase(data) {
  if (!data.image) {
    return { mimetype: null, image: null };
  }
  const mimetype = data.image.mimetype;
  const image = new Buffer.from(data.image.img.buffer).toString("base64");
  return { mimetype, image };
}

module.exports = { convertImageToBase, convertBinaryToBase };
