var $ = require('jquery');
var lunr = require('lunr');

var search = (function () {
  var _idx = lunr.Index.load(require('./lunr-index.json'));
  var _store = require('../public/searchstore.json');
  var _hrefNoQuery = getHrefNoQuery();

  if (window.location.href != _hrefNoQuery) {
    window.location = _hrefNoQuery;
    $(".searchBox input").val("");
    return;
  }
  if (!_hrefNoQuery.endsWith("/")) _hrefNoQuery += "/";

  function getHrefNoQuery() {
    var href = window.location.href;
    var ix = href.indexOf("?q=");
    if (ix == -1) return href;
    else return href.substring(0, ix);
  }

  $(".searchBox input").keypress(function (e) {
    if ((e.keyCode || e.which) == 13) {
      doSearch($(".searchBox input").val().trim());
      return false;
    }
  });

  $(".searchBox input").focus(function() {
    $(this).select();
  });

  $(".searchBox .submitSearch").click(function() {
    doSearch($(".searchBox input").val().trim());
  });

  $(window).on('popstate', function (e) {
    $(".searchBox input").val("");
    var trg = e.target.location.href;
    var ix = trg.indexOf("?q=");
    if (ix == -1) {
      window.location.href = e.target.location.href;
    }
    else window.location.href = _hrefNoQuery;
  });


  function doSearch(query) {
    if (!query || query == "") return;
    window.history.pushState(null, null, _hrefNoQuery + "?q=" + query);
    var res = _idx.search(query);
    $(".content").removeClass("post");
    $(".breadcrumb").removeClass("hidden");
    if (res.length == 0) {
      $(".breadcrumb .slab span").text("No search results for: " + query);
      $(".content .slab").html("");
    }
    else {
      $(".breadcrumb .slab span").text("Search results for: " + query);
      $(".content .slab").html("");
      for (var i = 0; i < res.length; ++i) {
        var itm = res[i];
        var elm = $('<a class="article-box"><h2></h2><p class="summary"></p><p class="author"><img alt="." /><span></span></p></a>');
        elm.attr("href", itm.ref);
        elm.find("h2").text(_store[itm.ref].title);
        elm.find(".summary").text(_store[itm.ref].description);
        elm.find(".author span").text("Written by " + _store[itm.ref].authorName);
        elm.find(".author img").attr("src", "/help/images/" + _store[itm.ref].authorPic);
        $(".content .slab").append(elm);
      }
    }
  }
});


module.exports = search;
