var Trackster = {};
var Tracks = [];
var Artists = [];
var searchKey = "none";
var sortDirection = 1;
const API_KEY = 'd2d4d59cbb4835cbd273262d80804637';

$(document).ready(function() {
  $('#search-input').keypress(function(e) {
    if(e.which == 13) {
    Trackster.searchTracksByTitle($('#search-input').val());
  }
  });
});

$(document).ready(function() {
  $('#search-input').select();
  $('#search-button').click(function() {
    Trackster.searchTracksByTitle($('#search-input').val());
  });
  $(".sortable").click(function() {
  switch (searchKey) {
    case "none":
      break;
    case "track":
      switch ($(this).text()) {
        case "Song ":
          Trackster.columnSort("name");
          break;
        case "Artist ":
          Trackster.columnSort("artist");
          break;
        case "Popularity ":
          Trackster.columnSort("listeners");
          break;
      }
      break;
    case "artist":
      switch ($(this).text()) {
        case "Song ":
          break;
        case "Artist ":
          Trackster.columnSort("name");
          break;
        case "Popularity ":
          Trackster.columnSort("listeners");
          break;
       }
       break;
  }
});
});

$(document).on("click", ".artistLink", function(event) {
  var artistSearch = ($(this).text());
  Trackster.searchByArtist(artistSearch);
});

Trackster.renderTracks = function(tracks) {
  var $trackList = $('#track-list');
  $trackList.empty();
  for (var trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
    var track = tracks[trackIndex];
    var mediumAlbumArt = track.image[1]["#text"];
    var popularity = numeral(track.listeners).format('0,0');
    var htmlTrackRow =
      '<div class="row track">' +
      '  <div class="col-xs-1 col-xs-offset-1 play-button">' +
      '    <a href="'+ track.url + '" target="_blank">' +
      '      <i class="fa fa-play-circle-o fa-2x"></i>' +
      '    </a>' +
      '  </div>' +
      '  <div class="col-xs-4">' + track.name + '</div>' +
      '  <div class="col-xs-2">' + track.artist + '</div>' +
      '  <div class="col-xs-2"><img src="' + mediumAlbumArt + '"/></div>' +
      '  <div class="col-xs-2">' + popularity + '</div>' +
      '</div>';

    $trackList.append(htmlTrackRow);
  }
};

Trackster.renderArtists = function(tracks) {
  var $trackList = $('#track-list');
  $trackList.empty();
  for (var trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
    var track = tracks[trackIndex];
    var mediumAlbumArt = track.image[1]["#text"];
    var popularity = numeral(track.listeners).format('0,0');
    var htmlTrackRow =
      '<div class="row track">' +
      '  <div class="col-xs-1 col-xs-offset-1 play-button">' +
      '    <a href="'+ track.url + '" target="_blank">' +
      '      <i class="fa fa-play-circle-o fa-2x"></i>' +
      '    </a>' +
      '  </div>' +
      '  <div class="col-xs-4">' + track.name + '</div>' +
      '  <div class="col-xs-2">' + track.artist + '</div>' +
      '  <div class="col-xs-2"><img src="' + mediumAlbumArt + '"/></div>' +
      '  <div class="col-xs-2">' + popularity + '</div>' +
      '</div>';

    $trackList.append(htmlTrackRow);
  }
};

Trackster.searchTracksByTitle = function(title) {
  $("#logo").addClass("animator");
  $.ajax({
    url: 'https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + title + '&api_key=' + API_KEY + '&format=json',
    success: function(response) {
      Tracks = response.results.trackmatches.track;
      Trackster.renderTracks(Tracks);
      searchKey = "track";
      $("i.fa.fa-sort.hideable").show();
      $('#logo').removeClass("animator");
      $('#search-input').select();
    }
  });
};

Trackster.searchTracksByArtist = function(artist) {
  $("#logo").addClass("animator");
  $.ajax({
    url: 'https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + artist + '&api_key=' + API_KEY + '&format=json',
    success: function(response) {
      Artists = response.results.artistmatches.artist;
      Trackster.renderTracks(Artists);
      searchKey = "artist";
      $("i.fa.fa-sort.hideable").show();
      $('#logo').removeClass("animator");
      $('#search-input').select();
    }
  });
};

Trackster.columnSort = function(columnID) {
  switch (searchKey) {
    case "track":
      if (columnID === "listeners") {
        if (sortDirection === 1) {
          Tracks.sort(function(a, b) {
            sortDirection = 0;
            return b[columnID] - a[columnID];
          });
        } else {
          Tracks.sort(function(a, b) {
            sortDirection = 1;
            return a[columnID] - b[columnID];
          });
        }
      } else {
        if (sortDirection === 1) {
          Tracks.sort(function(a, b) {
            sortDirection = 0;
            return (a[columnID]).localeCompare(b[columnID]);
          });
        } else {
          Tracks.sort(function(a, b) {
            sortDirection = 1;
            return (b[columnID]).localeCompare(a[columnID]);
          });
        }
      }
      Trackster.renderTracks(Tracks);
      break;
      case "artist":
        if (columnID === "listeners") {
          if (sortDirection === 1) {
            Artists.sort(function(a, b) {
              sortDirection = 0;
              return b[columnID] - a[columnID];
            });
          } else {
            Artists.sort(function(a, b) {
              sortDirection = 1;
              return a[columnID] - b[columnID];
            });
          }
        } else {
          if (sortDirection === 1) {
            Artists.sort(function(a, b) {
              sortDirection = 0;
              return (a[columnID]).localeCompare(b[columnID]);
            });
          } else {
            Artists.sort(function(a, b) {
              sortDirection = 1;
              return (b[columnID]).localeCompare(a[columnID]);
            });
          }
        }
        Trackster.renderArtists(Artists);
        break;
  }
};
