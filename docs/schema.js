var show = {
    _id: ObjectId('abcdef1233');
    name: "Friends",
    episodes: [
        {
            created: Date(),
            season: 4,
            number: 3,
            video: "filename1.mp4",
        },
        {
            created: Date(),
            season: 4,
            number: 5,
            video: "filename2.mp4",
        }
    ]
};


var subtitle = {
    _id: ObjectId('12abdf2233'),
    start: 1234,
    end: 1250,
    text: 'What are you doing',

    // denormalized info to show in text searches
    show: 'Breaking Bad',
    season: 1,
    number: 3,
    video: 'filename3.mp3',
}


