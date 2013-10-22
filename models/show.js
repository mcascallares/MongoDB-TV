var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
    episode = require('./episode'),
    Subtitle = require('./subtitle').Subtitle;


var showSchema = new Schema({
    name: { type: String, required: true},
    episodes: [
        {
            season: { type: Number, required: true},
            number: { type: Number, required: true},
            video: { type: String, required: true},
            created: { type: Date, required: true},
        }
    ]
});


showSchema.index({ 'name' : 1}, {unique: true});
showSchema.index({ 'name' : 1, '_id' : 1}); // covered queries when retrieving show names
showSchema.index({ 'episodes._id' : 1});
showSchema.index({ 'episodes.created' : 1});


showSchema.statics.all = function(projection, callback) {
    this.find({}, projection).sort('name').exec(callback);
};


showSchema.statics.latests = function(limit, callback) {
    this.aggregate([
        { $unwind: '$episodes'},
        { $sort: {'episodes.created': -1}},
        { $limit: limit},
        { $project: {'_id': 1, 'name': 1, 'created': '$episodes.created', 'video': '$episodes.video', 'episode': '$episodes.number', 'season': '$episodes.season'}}
    ], callback);
};


showSchema.statics.findByEpisodes = function(episodes, callback) {
    this.find({'episodes._id' : {'$in' :episodes}}).exec(callback);
};


showSchema.methods.getEpisode = function(season, number) {
    var result = _.find(this.episodes, function(obj) {
        return obj.season == season && obj.number == number;
    });
    return result ? result : null;
};


showSchema.methods.addEpisode = function(season, number, videoPath, subtitlePath, callback) {
    if (this.getEpisode(season, number)) {
        callback(new Error('That episode is already in the system'), null);
        return;
    }
    var _this = this;
    var filename = this._id + '_' + season + '_' + number;
    episode.save(videoPath, filename, function(errEpisode, file) {
        if (errEpisode) {
            callback(errEpisode, null);
        }
        console.log('Succesfully saved the video, adding metadata to the show');
        var newEpisode = {
            created: file.uploadDate,
            season: season,
            number: number,
            video: file.filename
        };
        _this.episodes.push(newEpisode);
        _this.save(function(errShow, savedShow) {
            if (errShow) {
                callback(errShow, null);
            }

            console.log('Succesfully saved show metadata, adding subtitle');
            var inserted = savedShow.getEpisode(season, number); // in memory lookup
            // contains text and times, I need to extend it with the episode id
            var texts = Subtitle.parseContent(subtitlePath);
            var toInsert = _.map(texts, function(t) {
                return _.extend({ episode: inserted._id, video: filename}, t)
            });

            Subtitle.create(toInsert, function(errSubtitle) {
                if (errSubtitle) {
                    callback(Error('An error occurred when saving the subtitle'), null);
                } else {
                    callback(null, savedShow);
                }
            });
        });
    });
};


exports.Show = mongoose.model('Show', showSchema, 'shows');