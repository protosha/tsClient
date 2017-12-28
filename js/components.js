'use strict';

function SimpleList(listContainer, itemRenderer, data) {
  if (!listContainer) {
    throw 'Error initializing list: container not set';
  }

  this.container = listContainer;
  this.itemRenderer = itemRenderer || function (item_data) {
      var li = $('<li>');
      li.addClass('ui-li-static');
      li.addClass('text-truncated');
      li.text(item_data.display);
      return li;
    };
  this.data = data || [];
}

SimpleList.prototype = {};

SimpleList.prototype.clear = function () {
  $(this.container).empty();
};

SimpleList.prototype.render = function () {
  var ul = $('<ul>');
  ul.addClass('ui-listview');

  for (var i = 0; i < this.data.length; i++) {
    var item_data = this.data[i];
    ul.append(this.renderItem(item_data));
  }

  tau.widget.Listview(ul[0]);
  $(this.container).append(ul);
};

SimpleList.prototype.renderItem = function (item_data) {
  return this.itemRenderer(item_data);
};

SimpleList.prototype.showProgressMask = function () {
  // ensure that there are no other masks on the list
  $(this.container).find('.list-mask').remove();
  // creating mask
  var mask = $('<div>');
  mask.addClass('ui-progress');
  mask.attr('data-type', 'activitycircle');
  mask.attr('data-size', 'large');
  tau.widget.Progress(mask[0]);
  // creating mask wrapper
  var wrapper = $('<div>');
  wrapper.addClass('list-mask');
  wrapper.append(mask);
  // append mask to the container
  $(this.container).append(wrapper);
};

SimpleList.prototype.hideProgressMask = function () {
  $(this.container).find('.list-mask').remove();
};

SimpleList.prototype.setData = function (data) {
  if (!data) {
    throw 'Error setting list data: got empty data';
  }

  this.data = data;
};

SimpleList.prototype.getData = function () {
  return this.data;
};