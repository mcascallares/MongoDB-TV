var show = {
    _id: ObjectId('abcdef1233');
    name: "Friends",
    episodes: [
        {
            _id: ObjectId('abcdef1234');
            created: Date(),
            season: 4,
            number: 3,
            video: "filename1.mp4",
        },
        {
            _id: ObjectId('abcdef125');
            created: Date(),
            season: 4,
            number: 5,
            video: "filename2.mp4",
        }
    ]
};


var subtitle = {
    _id: ObjectId('12abdf2233'),
    episode: ObjectId('1298237abcdf'),
    content: [
        {start: 1234, end: 1250, text: 'What are you doing'},
        {start: 1252, end: 1254, text: 'Nothing!'}
    ]
}


