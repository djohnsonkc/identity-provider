
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let accountSchema = Schema({
	email: { type: String, required: true, index: true, trim: true, unique: true }, //INDEXED + UNIQUE
    password: { type: String, required: true, trim: true }, // this will be a salted and hashed value
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Account', accountSchema);

