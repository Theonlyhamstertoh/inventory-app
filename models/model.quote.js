const { model, Schema } = require("mongoose");

const quoteSchema = new Schema({
  quote: { type: String, required: true },
});

module.exports = quoteSchema;
