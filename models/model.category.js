const { model, Schema } = require("mongoose");
const slugify = require("slugify");
const imageSchema = require("./model.image");
const { convertBinaryToBase } = require("../reusable");
const categorySchema = new Schema({
  name: { type: String, trim: true, required: true, maxLength: 100, unique: true },
  description: { type: String, required: true },
  timeline: { type: String, required: true },
  slug: String,
  image: imageSchema,
});

categorySchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

categorySchema.virtual("url").get(function () {
  return "/category/" + this.slug;
});

categorySchema.virtual("imageURL").get(function () {
  return convertBinaryToBase(this);
});
module.exports = new model("Category", categorySchema);
