const { model, Schema } = require("mongoose");

const imageSchema = new Schema({
  name: { type: String, required: true },
  mimetype: { type: String, required: true },
  img: { type: Schema.Types.Buffer, required: true },
});

module.exports = imageSchema;
