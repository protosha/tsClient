'use strict';

var apiHost = 'http://10.0.2.2:3000';
var Api = new API(apiHost + '/api');
var pages = {
  login: '#login',
  register: '#register',
  torrents: '#torrents',
  videos: '#videos',
  video: '#video'
};
var selectedTorrent = null;
var selectedVideo = null;

var torrentsContainer = $('#torrents-container');
var torrentList = new SimpleList(torrentsContainer, function (item_data) {
  var li = $('<li>');
  li.addClass('ui-li-static');
  li.addClass('li-torrent');
  li.click(function (e) {
    if (!$(e.target).hasClass('ui-btn')) {
      selectedTorrent = item_data.value;
      tau.changePage(pages.videos);
    }
  });

  var text = $('<span>');
  text.addClass('text-truncated');
  text.text(item_data.display);

  var button = $('<button>');
  button.addClass('ui-btn');
  button.addClass('ui-btn-block');
  button.attr('data-inline', true);
  button.text('Delete');
  button.click(function (e) {
    var torrent_id = item_data.value;
    Api.deleteTorrent(torrent_id, function (response) {
      refreshTorrentList();
    });
  });

  li.append(text, button);
  tau.widget.Button(button);

  return li;
});

var videosContainer = $('#videos-container');
var videoList = new SimpleList(videosContainer, function (item_data) {
  var li = $('<li>');
  li.addClass('ui-li-static');
  li.addClass('text-truncated');
  li.text(item_data.display);
  li.click(function (e) {
    selectedVideo = item_data.value;
    tau.changePage(pages.video);
    updatePlayer(selectedTorrent, selectedVideo);
  });
  return li;
});

var player = $('#video-player')[0];

function isAuthorized() {
  return window.sessionStorage.getItem('status') === 'loggedIn';
}

function exit() {
  try {
    tizen.application.getCurrentApplication().exit();
  } catch (ignore) { }
}

function getCurrentPageId() {
  var activePage = $('.ui-page:visible');
  if (activePage.length > 0) {
    return '#' + activePage[0].id;
  }
  return null;
}

function refreshTorrentList() {
  torrentList.clear();
  torrentList.showProgressMask();
  Api.getTorrents(function (torrents) {
    torrentList.setData(torrents.map(function (v) {
      return { value: v._id, display: v.name };
    }));
    torrentList.render();
    torrentList.hideProgressMask();
  });
}

function refreshVideoList(torrentId) {
  videoList.clear();
  videoList.showProgressMask();
  Api.getFiles(torrentId, function (files) {
    videoList.setData(files.map(function (v) {
      return { value: v.id, display: v.name };
    }));
    videoList.render();
    videoList.hideProgressMask();
  });
}

function updatePlayer(torrentId, fileId) {
  player.pause();

  var video = $(player);
  video.empty();
  var source = $('<source>');
  var url = apiHost + '/api/torrent/torrent/' + selectedTorrent + '/file/' + selectedVideo;
  source.attr('src', url);
  video.append(source);

  player.load();
}

(function () {
  $(window).on('tizenhwkey', function (e) {
    if (e.keyName === "back") {
      var rootPage = (isAuthorized())? pages.torrents : pages.login;
      if (getCurrentPageId() === rootPage && !activePopup) {
        exit();
      } else {
        window.history.back();
      }
    }
  });

  $(window).on('pagebeforechange', function (e) {
    if (getCurrentPageId() === pages.video) {
      player.pause();
    }
  });

  $(window).on('pagebeforeshow', function (e) {
    if (e.target) {
      var pageId = '#' + e.target.id;
      if (pageId === pages.torrents) {
        torrentList.clear();
      } else if (pageId === pages.videos) {
        videoList.clear();
      }
    }
  });

  $(window).on('pagechange', function (e) {
    var current = getCurrentPageId();
    if (current === pages.torrents) {
      selectedTorrent = null;
      refreshTorrentList();
    } else if (current === pages.videos) {
      selectedVideo = null;
      if (selectedTorrent) {
        refreshVideoList(selectedTorrent);
      } else {
        tau.changePage(pages.torrents);
      }
    } else if (current === pages.video) {
      // update video element
    }
  });
})();

$(document).ready(function () {
  if (!isAuthorized()) {
    tau.changePage(pages.login);
  } else {
    tau.changePage(pages.torrents);
  }

  // User login
  var loginForm = $('#login-form');
  $('#btn-login').click(function (e) {
    var data = loginForm.serializeArray().reduce(function (acc, curr) {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    console.log(data);
    Api.login(data['login-username'], data['login-password'], function (response) {
      window.sessionStorage.setItem('status', 'loggedIn');
      tau.changePage(pages.torrents);
    });
  });

  // Registration
  var registerForm = $('#register-form');
  $('#btn-register').click(function (e) {
    var data = registerForm.serializeArray().reduce(function (acc, curr) {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    Api.register(data['register-username'], data['register-password'], function (response) {
      if (response.success) {
        tau.changePage(pages.login);
      } else {
        // error
      }
    });
  });

  // New torrent
  var addForm = $('#add-form');
  $('#btn-add').click(function (e) {
    var btn = this;
    var data = addForm.serializeArray().reduce(function (acc, curr) {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    Api.addTorrent(data['add-name'], data['add-magnet'], function (response) {
      refreshTorrentList();
      var popup = $(btn).parents('.ui-popup')[0];
      popup = tau.widget.Popup(popup);
      popup.close();
    });
  });

  $('#btn-logout').click(function (e) {
    Api.logout(function (response) {
      window.sessionStorage.removeItem('status');
      tau.changePage(pages.login);
    });
  });
});