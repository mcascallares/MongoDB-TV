var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    episode = require('./episode'),
    _ = require('underscore');


var showSchema = new Schema({
    name: { type: String, required: true},
    episodes: [
        {
            _id: false,
            season: Number,
            number: Number,
            video: String
        }
    ]
});


// indexes
showSchema.index({ 'name' : 1});
showSchema.index({ 'episodes.season' : 1, 'episodes.number': 1});


showSchema.statics.listNames = function(callback) {
    this.find({}, '_id name').sort('name').exec(callback);
};


showSchema.methods.addEpisode = function(season, number, path, callback) {
    var previous = _.find(this.episodes, function(obj) {
        return obj.season == season && obj.number == number;
    })

    if (previous) {
        throw new Error('That episode is already in the system');
    }

    var _this = this;
    var filename = this._id + '_' + season + '_' + number;
    episode.save(path, filename, function(err) {
        if (!err) {
            console.log('Succesfully saved the video, adding metadata to the show');
            var newEpisode = {
                season: season,
                number: number,
                video: filename
            };

            _this.episodes.push(newEpisode);
            _this.save(callback);
        }
    });
};

exports.Show = mongoose.model('Show', showSchema, 'shows');