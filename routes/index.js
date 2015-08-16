/*
 * GET home page.
 */
var Twitter = require('twitter'),
    request = require('request'),
    fs = require('fs');
	
var Parse = require('parse').Parse;
Parse.initialize("tvBeInNQqHmjKJXP2gaaS3LVENcqSFhZyUL1rGrJ", "B712ux26mNqlOMFKmEzshf62MhwRexlP4jHv87y0");
var Snapshot = Parse.Object.extend("Snapshot");

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

    var twitterRequest = function (body) {
        var data = fs.readFileSync("snapshots/" + body.name);
        // Make post request on media endpoint. Pass file data as media parameter
        client.post('media/upload', {
            media: data
        }, function (error, media, response) {

            if (!error) {

                // If successful, a media object will be returned.
                console.log(media);

                // Lets tweet it
                var status = {
                    status: "This picture was taken at: "+body.long+","+body.lat,
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
	
	var snap = new Snapshot();

	snap.set("location", {
		"_type":"GeoPoint",
		"latitude": body.long,
		"longitude": body.lat
		})
	snap.set("image", body.img);

	snap.save(null, {
	  success: function(snap) {
		// Execute any logic that should take place after the object is saved.
		alert('New object created with objectId: ' + gameScore.id);
	  },
	  error: function(snap, error) {
		// Execute any logic that should take place if the save fails.
		// error is a Parse.Error with an error code and message.
		alert('Failed to create new object, with error code: ' + error.message);
	  }
	});
	
    fs.writeFile("snapshots/" + body.name, body.img, 'base64', function (err) {
        if (!err) {
            console.log("Great success! File was saved!");
            twitterRequest(body)

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
	//URL
	var query = new Parse.Query(Snapshot);
	
	var mapImage = "https://maps.googleapis.com/maps/api/staticmap?"
	var size = "size=500x500"
	var markers = "&markers="
	var path = "&path="
	
	query.equalTo("image", "noimage");
	query.ascending("createdAt");
	query.find({
	  success: function(results) {
		console.log("Successfully retrieved " + results.length + " locations.");
		console.log(results.location)
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) {
			var object = results[i];
			console.log(object.id + ' - ' + object.get('name'));
			markers+=object.get('location').latitude + "," + object.get('location').longitude +"|"
			path+=object.get('location').latitude + "," + object.get('location').longitude +"|"
		}
		markers = markers.substring(0, markers.length - 1);
		path = path.substring(0, path.length - 1);
		
		res.send(mapImage += size +markers +path)
	  },
	  error: function(error) {
		console.log("Error: " + error.code + " " + error.message);
	  }
	});
	/*
	for (i = 0; i < locations.length; i++) {
		markers+=locations[i].longitude + "," + locations[i].latitude +"|"
		path+=locations[i].longitude + "," + locations[i].latitude +"|"
	}
	markers = markers.substring(0, markers.length - 1);
	path = path.substring(0, path.length - 1);

	
	mapImage += size +markers +path
	console.log(mapImage)
	*/

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