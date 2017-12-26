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

  $.getJSON(fullUrl, callback);
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

  $.getJSON(fullUrl, callback);
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
