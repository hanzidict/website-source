var $ = require('jquery');
var lunr = require('lunr');

var dataIdx = null;
var dataStore = null;

$(document).ready(function() {
  require('./search')();

  // var req1 = $.ajax({
  //   url: "/lunr-index.json",
  //   type: "GET",
  //   contentType: "application/x-www-form-urlencoded; charset=UTF-8"
  // });
  // req1.done(function (data) {
  //   dataIdx = data;
  //   if (dataStore) require("./search")(dataIdx, dataStore);
  // });
  // var req2 = $.ajax({
  //   url: "/searchstore.json",
  //   type: "GET",
  //   contentType: "application/x-www-form-urlencoded; charset=UTF-8"
  // });
  // req2.done(function (data) {
  //   dataStore = data;
  //   if (dataIdx) require("./search")(dataIdx, dataStore);
  // });
});

