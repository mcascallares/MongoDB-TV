var mongoose = require('mongoose')
    , Schema = mongoose.Schema;


var showSchema = new Schema({
    name: { type: String, required: true},
    episodes: [
        {
            number: Number,
            season: Number
        }
    ]
});


// showSchema.index({name : 1});

// labelSchema.statics.findByUser = function (user, callback) {
//     this.find({ user: user })
//     .sort('name')
//     .exec(callback);
// }


exports.Show = mongoose.model('Show', showSchema, 'shows');