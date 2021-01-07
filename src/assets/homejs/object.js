
//鼠标右击的相关操作。
function Contextmenu(obj, ev, contextmenu) {
  this.obj = obj;
  this.ev = ev;
  this.contextmenu = contextmenu;
  this.item = this.contextmenu.querySelectorAll('li');
  this.renderValue = {};

  return this.inital();
}
Contextmenu.prototype = {
  stopBubble: function () {
    var self = this;

    document.onclick = function () {
      self.contextmenu.style.display = 'none';
    };
    
    self.contextmenu.oncontextmenu = function (ev) {
      ev.stopPropagation();
      return false;
    };
  },

  initalContextmenu: function () {
    this.contextmenu.style.display = 'block';
    this.contextmenu.style.left = this.ev.clientX - 15 + 'px';
    this.contextmenu.style.top = this.ev.clientY + 7 + 'px';

    for (var i = 0; i < this.item.length; i++) {
      var dataValue = this.item[i].getAttribute('data-value');

       this.item[i].style.display = 'none';

      if (this.renderValue[dataValue]) {
        this.item[i].style.display = 'block';
      }

    }

    this.stopBubble();
  },

  inital: function () {
    if (this.obj.nodeType === 9) {
      this.renderValue = {create: true, edit: false, refresh: true, del: false, open:false,allScreen:true,search:true,exit:true};
    } else {
      this.renderValue = {create: false, edit: true, refresh: false, del: true,open:true,rollback:false,allScreen:false,rollback:true,suo:true};
    }

    this.initalContextmenu();
  },

  constructor: Contextmenu
};

export{Contextmenu}
