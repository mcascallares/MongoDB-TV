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
    var encoding = 'ascii';
    srtString = fs.readFileSync(srtPath, encoding);
    srtString = srtString.replace(/\r\n/g, '\n'); // sanitize for srt library
    console.log(srtString);
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