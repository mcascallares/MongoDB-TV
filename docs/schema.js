var show = {
    _id: ObjectId('abcdef1233');
    name: "Friends",
    episodes: [
        {
            _id: ObjetId(),
            created: Date(),
            season: 4,
            number: 3,
            video: "filename1.mp4",
        },
        {
            _id: ObjetId(),
            created: Date(),
            season: 4,
            number: 5,
            video: "filename2.mp4",
        }
    ]
};


var subtitle = {
    _id: ObjectId('12abdf2233'),
    episode: ObjectId('12abdf2233'), // refers video in show.episode._id
    start: 1234,
    end: 1250,
    text: 'What are you doing?'
}