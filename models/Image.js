const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema({
  image: {  type: String,
    required: true
},
amount:{
	type:Number,
	required:true
},
discount:{
	type:Number,
	required:true
},
productname:{
	type:String,
	required:true
}
});

// export model user with UserSchema
module.exports = mongoose.model("images", ImageSchema);