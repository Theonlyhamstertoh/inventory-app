const { model, Schema } = require("mongoose");
const imageSchema = require("./model.image");
const { convertBinaryToBase } = require("../reusable");
const slugify = require("slugify");

const categoryIDSchema = new Schema({
  name: { type: String, required: true },
  id: { type: Schema.Types.ObjectId, ref: "Category" },
});
const philosopherSchema = new Schema(
  {
    first_name: { type: String, trim: true, required: true, maxLength: 100 },
    last_name: { type: String, trim: true, required: true, maxLength: 100 },
    slug: String,
    bio: { type: String, required: true },
    quotes: [{ type: String, required: true }],
    category: categoryIDSchema,
    image: imageSchema,
  },
  { timestamps: true }
);

philosopherSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@]/g });
});

philosopherSchema.virtual("name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

philosopherSchema.virtual("imageURL").get(function () {
  return convertBinaryToBase(this);
});

philosopherSchema.virtual("url").get(function () {
  return "/philosopher/" + this.slug;
});
module.exports = new model("Philosopher", philosopherSchema);
