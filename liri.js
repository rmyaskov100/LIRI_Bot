require('dotenv').config();

var keys = require('keys.js');
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var filename = 'log.txt';
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');
var userCommand = process.argv[2];
var secondCommand = process.argv[3];


for (var r = 4; r < process.argv.length; r++) {
    secondCommand += '+' + process.argv[r];
}

// Use spotify keys
var spotify = new Spotify(keys.spotify);

// Write to the log.txt file
var getArtistNames = function (artist) {
    return artist.name;
};

// Function for Spotify search
var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = ' Shot In The Dark ';
    }

    spotify.search(
        {
            type: 'track',
            query: userCommand
        },
        function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }

            var songs = data.tracks.items;

            for (var r = 0; r < songs.length; r++) {
                console.log(r);
                console.log('artist(s): ' + songs[r].artists.map(getArtistNames));
                console.log('song name: ' + songs[r].name);
                console.log('preview song: ' + songs[r].preview_url);
                console.log('album: ' + songs[r].album.name);
                console.log('-----------------------------------------------------');
            }
        }
    );
};

// Switch command
function mySwitch(userCommand) {


    switch (userCommand) {

        case 'my-tweets':
            getTweets();
            break;

        case 'spotify-this-song':
            getSpotify();
            break;

        case 'movie-this':
            getMovie();
            break;

        case 'do-what-it-says':
            doWhat();
            break;
    }
 
    function getTweets() {
        // Use Twitter Keys
        var client = new Twitter(keys.twitter);
    
        // Retrive tweets
        client.get('statuses/user_timeline', function (error, tweets, response) {
            
            if (error) throw error;

        
            for (var r = 0; r < tweets.length; r++) {
                var date = tweets[r].created_at;

                logOutput("@Russ: " + tweets[r].text + " Created At: " + date.substring(0, 9));
        
                logOutput('------------------------------------------------------------------');
            }
        });
    }

    //OMDB Movie - command
    function getMovie() {
        
        var movieName = secondCommand;
        var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&tomatoes=true&apikey=trilogy';

        request(queryUrl, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);

                logOutput('================ Movie Info ================');
                logOutput('Title: ' + body.Title);
                logOutput('Release Year:' + body.Year);
                logOutput('IMDb Rating: ' + body.imdbRating);
                logOutput('Country: ' + body.Country);
                logOutput('Language: ' + body.Language);
                logOutput('Plot: ' + body.Plot);
                logOutput('Actors: ' + body.Actors);
                logOutput('Rotten Tomatoes Rating: ' + body.Ratings[2].Value);
                logOutput('Rotten Tomatoes URL: ' + body.tomatoURL);
                

            } else {
                
                console.log('Error occurred')
            }
            
            if (movieName === 'Mr. Nobody') {
                console.log('-------------------------------------------------------------------------');
                console.log("If you haven't watched 'Mr. Nobody' then you should: https://www.imdb.com/title/tt0945513/");
                console.log('You will not regret it!');
            }
        });
    }

    //Function that reads and splits random.txt file
    
    function doWhat() {
        //Read random.txt file
        fs.readFile('random.txt', 'utf8', function (error, data) {
            if (!error);
            console.log(data.toString());
            //Split text with comma delimiter
            var cmds = data.toString().split(',');
        });
    }



}   

//Call mySwitch function
mySwitch(userCommand);