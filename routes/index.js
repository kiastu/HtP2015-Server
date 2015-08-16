/*
 * GET home page.
 */
var Twitter = require('twitter'),
    request = require('request'),
    fs = require('fs');
	
var Parse = require('node-parse-api').Parse;
 
var APP_ID = ...;
var MASTER_KEY = ...;
 
var app = new Parse(APP_ID, MASTER_KEY);

var hastag = '#hack-the-planet'

var client = new Twitter({
    consumer_key: 'Rj6bc5IqvPGKIct1DunbNzG0p',
    consumer_secret: 'dCfSdJOG2tW0CnnhHGZFEGCpOTa0jIveykbPAFFRwTh112aBkD',
    access_token_key: '3315791730-DPkIbVGigEzV64ObAhtxX63zAAzhn8ApSyPOWdo',
    access_token_secret: 'sN7tFi7hYqNHi9oKgAtnBmsg63olosIsMRjf7TEkH1wYb'
});

exports.index = function (req, res) {
    res.render('index');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

exports.push = function (req, res) {
    var options = {
        url: 'https://api.parse.com/1/push',
        headers: {
            'X-Parse-Application-Id': 'tvBeInNQqHmjKJXP2gaaS3LVENcqSFhZyUL1rGrJ',
            'X-Parse-Rest-API-Key': 'agXbECxwVrDgE2yqYLqpHN2Axf7Wn25vrFsr68mr',
            'Content-Type': 'application/json'
        },
        json: true,
        body: {
            where: {},
            data: {
                alert: 'Yiu'
            }
        }
    };

    request.post(options, function (error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            console.log("Complete")
            console.log(body) // Show the HTML for the Google homepage.
            res.send("success")
        } else {
            console.log(error)
        }
    })

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info.stargazers_count + " Stars");
            console.log(info.forks_count + " Forks");
        }
    }
};

//“Content-Transfer-Encoding: base64”

//https://upload.twitter.com/1.1/media/upload.json

// Objects for 

// https://maps.googleapis.com/maps/api/staticmap?

exports.imgupdate = function (req, res) {

    var body = req.body;
    //download the image file.

    var twitterRequest = function () {
        var data = fs.readFileSync("../snapshots/" + body.name);
        // Make post request on media endpoint. Pass file data as media parameter
        client.post('media/upload', {
            media: data
        }, function (error, media, response) {

            if (!error) {

                // If successful, a media object will be returned.
                console.log(media);

                // Lets tweet it
                var status = {
                    status: jTweet.message,
                    media_ids: media.media_id_string // Pass the media id string
                }

                client.post('statuses/update', status, function (error, tweet, response) {
                    if (!error) {
                        console.log(tweet);
                    }
                });

                res.json({
                    message: "Success"
                });
            } else {
                console.log(error);
            }

        });

    }
    console.log("Body:" + body.name);
	
	app.insert('Snapshot', { 
	location: {
		"_type":"GeoPoint",
		"latitude": body.long,
		"longitude": body.lat
		},
    image: body.img
	}, function (err, response) {
	  console.log(response);
	});
	
    fs.writeFile("snapshots/" + body.name, body.img, 'base64', function (err) {
        if (!err) {
            console.log("Great success! File was saved!");
            twitterRequest()

        } else {
            console.log(err);
            console.log("Error, could not save file, something fucked up.");
            res.status(500).send("Error");
        }
    });


}

//jTweet
//	message String
//	img Strig (base64)
//	long
//	lat 
//

exports.createMap = function (req, res) {
	app.find('Snapshot', '', function (err, response) {
		
		console.log(response);
	});
}

exports.tweet = function (req, res) {
    client.post('statuses/update', {
        status: 'Hello, World!'
    }, function (error, tweet, response) {
        if (!error) {
            console.log(tweet);
        }
    });
}