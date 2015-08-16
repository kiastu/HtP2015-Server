var config = require('config.js');
var sendgrid = require('sendgrid')(config.sg_api_key);
var parse = require('parse');

exports.greetEmail = function(req,res){
}

exports.notifyAll = function(req,res){
    var email = new sendgrid.Email();
}

exports.isNearby = function(req,res){

}