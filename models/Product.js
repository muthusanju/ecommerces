const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
   name: {
    type: String,
    required: true
  },
   amount: {
    type: Number,
    required: true
  },
   discount: {
    type: Number,
    required: true
  },
  image:{
  	type:String,
  	required:true
  }
});

// export model user with UserSchema
module.exports = mongoose.model("products", ProductSchema);
