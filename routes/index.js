/*
 * GET home page.
 */
var Twitter = require('twitter'),
	request = require('request'),
	fs = require('fs'),
	s3 = require('s3');
	
var hastag = '#hack-the-planet'

var s3client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId: "AKIAIP5CDOJX6DS7PKGA",
    secretAccessKey: "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",
    // any other options are passed to new AWS.S3() 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
  },
});

var params = {
  localFile: "some/local/file",
 
  s3Params: {
    Bucket: "s3 bucket name",
    Key: "some/remote/file",
    // other options supported by getObject 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property 
  },
};
var downloader = s3client.downloadFile(params);
downloader.on('error', function(err) {
  console.error("unable to download:", err.stack);
});
downloader.on('progress', function() {
  console.log("progress", downloader.progressAmount, downloader.progressTotal);
});
downloader.on('end', function() {
  console.log("done downloading");
});
	
var client = new Twitter({
	consumer_key: 'Rj6bc5IqvPGKIct1DunbNzG0p',
	consumer_secret: 'dCfSdJOG2tW0CnnhHGZFEGCpOTa0jIveykbPAFFRwTh112aBkD',
	access_token_key: '3315791730-DPkIbVGigEzV64ObAhtxX63zAAzhn8ApSyPOWdo',
	access_token_secret: 'sN7tFi7hYqNHi9oKgAtnBmsg63olosIsMRjf7TEkH1wYb'
	});

exports.index = function(req, res) {
    res.render('index');
};

exports.partials = function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

exports.push = function(req, res) {
    var options = {
        url: 'https://api.parse.com/1/push',
        headers: {
            'X-Parse-Application-Id': 'tvBeInNQqHmjKJXP2gaaS3LVENcqSFhZyUL1rGrJ',
            'X-Parse-Rest-API-Key': 'agXbECxwVrDgE2yqYLqpHN2Axf7Wn25vrFsr68mr',
            'Content-Type': 'application/json'
        },
		json: true,
		body: {
				where:{},
				data: {alert:'Yiu'}}
    };

    request.post(options, function(error, response, body) {
		console.log(body)
        if (!error && response.statusCode == 200) {
			console.log("Complete")
            console.log(body) // Show the HTML for the Google homepage.
			res.send("success")
        }
		else
		{
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

exports.imgupdate = function(req, res) {
	var jTweet = req.body;
	console.log(jTweet)
	fs.writeFileSync(jTweet.name,new Buffer(jTweet.img.toString(),"base64"));
	var data = fs.readFileSync(jTweet.name);
	
	// Make post request on media endpoint. Pass file data as media parameter
	client.post('media/upload', {media: data}, function(error, media, response){

  if (!error) {

    // If successful, a media object will be returned.
    console.log(media);

    // Lets tweet it
    var status = {
      status: jTweet.message,
      media_ids: media.media_id_string // Pass the media id string
    }

    client.post('statuses/update', status, function(error, tweet, response){
      if (!error) {
        console.log(tweet);
      }
    });

  }
  res.json({message:"Success"});
});

	
}

//jTweet
//	message String
//	img Strig (base64)
//	long
//	lat 
//

exports.tweet = function(req, res) {
	client.post('statuses/update', {status: 'Hello, World!'}, function(error, tweet, response){
	if (!error) {
		console.log(tweet);
	}
	});
}