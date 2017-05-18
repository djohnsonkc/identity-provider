//NOTE: Always place children schemas above the parent
//this seems to be necessary if you want embedded children to contain their own _id property

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// let emailSchema = Schema({
//     address: { type: String, required: true, trim: true, unique: true }, //UNIQUE
//     primary: { type: Boolean },
//     created_at: { type: Date, default: Date.now },
//     updated_at: { type: Date, default: Date.now }
// }, 
// {
//     _id: true,
//     versionKey: false
// });


let accountSchema = Schema({
	user_name: { type: String, required: true, index: true, trim: true, unique: true }, //INDEXED + UNIQUE
    password: { type: String, required: true, trim: true }, // this will be a salted and hashed value
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    //emails: [emailSchema],
    email: { type: String, required: true, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Account', accountSchema);

