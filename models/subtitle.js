var fs = require('fs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    textSearch = require('mongoose-text-search'),
    srt = require("srt"),
    jschardet = require("jschardet"),
    iconv = require('iconv-lite'),
    _ = require('underscore');



var subtitleSchema = new Schema({
    episode: Schema.Types.ObjectId,
    start: Number,
    end: Number,
    text: String
});

// give our schema text search capabilities
subtitleSchema.plugin(textSearch);

// indexes
subtitleSchema.index({ 'text' : 'text'});

subtitleSchema.statics.search = function(q, callback) {
    var options = {
        project: '$elemMatch'
    };
    this.textSearch(q, callback);
};

subtitleSchema.statics.parseContent = function(srtPath, callback) {
    var buffer = fs.readFileSync(srtPath);
    var originalEncoding = jschardet.detect(buffer);
    srtString = iconv.decode(buffer, originalEncoding.encoding);
    srtString = srtString.replace(/\r\n/g, '\n'); // fix windows mess
    srtString = srtString.replace(/<\/?[^>]+(>|$)/g, ''); // remove tags for italics, bold, etc
    srtString = srtString.replace(/\{\/?[^\}]+(\}|$)/g, ''); // remove bracket notation for tags
    var data = srt.fromString(srtString);

    return _.map(data, function(subtitle) {
        return {
            start: subtitle.startTime,
            end: subtitle.endTime,
            text: subtitle.text.replace(/\n/g, ' ')
        };
    });
};


exports.Subtitle = mongoose.model('Subtitle', subtitleSchema, 'subtitles');