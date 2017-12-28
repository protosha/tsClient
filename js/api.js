'use strict';

var torrents = [
  {torrent_id: 1, torrent_name: 'Some name' },
  {torrent_id: 2, torrent_name: 'Some another name' },
  {torrent_id: 3, torrent_name: 'Scrubs' },
  {torrent_id: 4, torrent_name: 'Scrubs Season 5 Hello world long text yeeaahhh' }
];

var videos = [
  { file_id: 1, file_name: 'Episode 1' },
  { file_id: 2, file_name: 'Episode 2' },
  { file_id: 3, file_name: 'Episode 3' },
  { file_id: 4, file_name: 'Episode 1' },
  { file_id: 5, file_name: 'Episode 2' },
  { file_id: 6, file_name: 'Episode 3' },
  { file_id: 7, file_name: 'Episode 1' },
  { file_id: 8, file_name: 'Episode 2' },
  { file_id: 9, file_name: 'Episode 3' },
  { file_id: 10, file_name: 'Episode 1' },
  { file_id: 11, file_name: 'Episode 2' },
  { file_id: 12, file_name: 'Episode 3' }
];

function API(url, token) {
  if (!url) {
    throw 'API URL must be set';
  }

  this.url = url;
  this.token = token;
}

API.prototype = {};

API.prototype.setToken = function (token) {
  this.token = token;
};

API.prototype.ensureToken = function () {
  if (!this.token) {
    throw 'No token provided!';
  }
};

API.prototype.getTorrents = function (callback) {
  this.ensureToken();

  var fullUrl = this.url + '/torrents';

  $.getJSON(fullUrl, function (response) {
    callback(response.torrents);
  });
};

API.prototype.addTorrent = function (name, magnetURI, callback) {
  this.ensureToken();

  var fullUrl = this.url + '/torrents';

  $.post(fullUrl, {torrent_name: name, torrent_magnet: magnetURI }, callback);
};

API.prototype.deleteTorrent = function (torrentId, callback) {
  this.ensureToken();

  var fullUrl = this.url + '/torrent/' + torrentId;

  $.ajax({
    method: 'DELETE',
    url: fullUrl
  }).done(callback);
};

API.prototype.getFiles = function (torrentId, callback) {
  this.ensureToken();

  var fullUrl = this.url + '/torrent/' + torrentId + '/files';

  $.getJSON(fullUrl, function (response) {
    callback(response.files);
  });
};

API.prototype.register = function (username, password, callback) {
  var fullUrl = this.url + '/reg';

  $.post(fullUrl, { user: username, password: password }, callback);
};

API.prototype.login = function (username, password, callback) {
  var fullUrl = this.url + '/login';

  $.post(fullUrl, { user: username, password: password }, callback);
};

API.prototype.logout = function (callback) {
  var fullUrl = this.url + '/login';

  $.ajax({
    method: 'DELETE',
    url: fullUrl
  }).done(callback);
};

// Fake API methods
API.prototype.getTorrents = function (callback) {
  setTimeout(function () {
    callback(torrents);
  }, 2000);
};

API.prototype.addTorrent = function (name, magnetURI, callback) {
  var newId = -1;
  for (var i = 0; i < torrents.length; i++) {
    if (newId < torrents.torrent_id) {
      newId = torrents.torrent_id;
    }
  }
  torrents.push({ torrent_id: newId + 1, torrent_name: name });

  callback({});
};

API.prototype.deleteTorrent = function (torrentId, callback) {
  for (var i = 0; i < torrents.length; i++) {
    if (torrents[i].torrent_id === torrentId) {
      torrents.splice(i, 1);
      break;
    }
  }

  callback({});
};

API.prototype.getFiles = function (torrentId, callback) {
  setTimeout(function () {
    callback(videos);
  }, 1000);
};

API.prototype.register = function (username, password, callback) {
  callback({});
};

API.prototype.login = function (username, password, callback) {
  callback({});
};

API.prototype.logout = function (callback) {
  callback({});
};
