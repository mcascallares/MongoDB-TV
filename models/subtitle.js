var fs = require('fs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    textSearch = require('mongoose-text-search'),
    srt = require("srt"),
    _ = require('underscore');



var subtitleSchema = new Schema({
    episode: Schema.Types.ObjectId,
    content: [
        {
            start: Number,
            end: Number,
            text: String
        }
    ]
});

// give our schema text search capabilities
subtitleSchema.plugin(textSearch);

// indexes
subtitleSchema.index({ 'episode_id' : 1 });
subtitleSchema.index({ 'content.text' : 'text'});


subtitleSchema.methods.parseContent = function(srtPath, callback) {
    srtString = fs.readFileSync(srtPath, 'utf8');
    srtString = srtString.replace(/\r\n/g, '\n');
    srtString = srtString.replace(/<\/?[^>]+(>|$)/g, '');
    srtString = srtString.replace(/\{\/?[^\}]+(\}|$)/g, '');
    var data = srt.fromString(srtString);

    var content = _.map(data, function(subtitle) {
        return {
            start: subtitle.startTime,
            end: subtitle.endTime,
            text: subtitle.text
        };
    });

    this.content = content;

};


exports.Subtitle = mongoose.model('Subtitle', subtitleSchema, 'subtitles');