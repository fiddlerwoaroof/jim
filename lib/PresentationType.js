PresentationType = (function () {
  var presentationTypes = {};

  // TODO: think through selector better: right now, I think we assume that it
  //       is a class selector and things will break if it isn't we should,
  //       however, probably let it be more general.
  function PresentationType(name, selector) {
    if (this instanceof PresentationType) {
      this.name = name;
      if (selector === undefined) {
        selector = '.'+this.name;
      }
      this.selector = selector;
    } else {
      var result = presentationTypes[name];
      if (result === undefined) {
        result = new PresentationType(name);
        presentationTypes[result.name] = result;
        result.receivers = [];

      }
      return result;
    }
  }

  PresentationType.prototype = {
    presentationsTypes: presentationTypes,

    addReceiver(receiver) {
      this.receivers.push(receiver);
      return this.receivers.length - 1;
    },

    removeReceiver(el) {
      var elIdx = this.receivers.indexOf(el);
      var result = elIdx !== -1;
      if (result) {
        this.receivers.splice(elIdx,1);
      }
      return result;
    },

    notifyReceivers(theEvent) {
      var outerArgs = Array.prototype.slice.call(arguments);
      outerArgs.unshift(theEvent, this, this.value);

      this.receivers.forEach((function (theReceiver) {
        theReceiver.receive.apply(theReceiver, outerArgs);
      }));
    },

    selectAllTags() {
      return document.querySelectorAll(this.selector);
    },

    selectAll() {
      var allTags = this.selectAllTags();
      return Array.prototype.map.call(allTags, function (el) {
        return el.ptObject;
      });
    },

    bindTags() {
      var els = this.selectAllTags();

      els.forEach(function (theEl) {
        var content = theEl.textContent;
        var value = theEl.value;


        var bindTypes = theEl.dataset.bind;
        if (bindTypes !== undefined) {
          bindTypes = bindTypes.split(',');
        } else {
          bindTypes = ['click'];
        }

        console.log('bt',bindTypes);

        if (! theEl.hasAttribute('value') ) {
          var tmpVal = theEl.dataset.value;
          value = tmpVal === undefined ? content : theEl.dataset.value;
        }

        this.wrapTag(theEl, value, bindTypes, content);
      }, this);

      return this;
    },

    wrapTag(tag, value, bindTypes, content) {
      var result = Object.assign(Object.create(this), {
        tag: tag,
        value: value,
        display: content,
      });
      tag.ptObject = result;

      bindTypes.forEach(function (event) {
        console.log(event);
        tag.addEventListener(event, result, false);
      });

      if (result.validate()) {
        return result;
      } else {
        this.doError(result);
      }
    },

    makeTag(value, tagName, bindTypes, content) {
      var newTag = document.createElement(tagName);

      newTag.classList.add(this.name);

      if (bindTypes === undefined) {
        bindTypes = [];
      } else if (!(bindTypes instanceof Array)) {
        content = bindTypes;
        bindTypes = [];
      }

      if (content === undefined) {
        content = value;
      }

      newTag.textContent = content;
      return this.wrapTag(newTag, value, bindTypes, content);
    },

    handleEvent(theEvent) {
      console.log('handling: ',theEvent);
      var handler = this[theEvent.type];
      var result = true;
      if (handler !== undefined) {
        result = handler.bind(this)(theEvent);
      }
      this.notifyReceivers(theEvent);

      return result;
    },

    doError(object) {
      return;
    },

    validate() {
      return true;
    },

    toggleAll() {
      var els = this.selectAllTags();

      els.forEach(function (el) {
        el.classList.toggle('activated');
      });
    },

    deactivateAll() {
      var els = this.selectAllTags();

      els.forEach(function (el) {
        el.classList.remove('activated');
      });
    },

    activateAll() {
      var els = this.selectAllTags();

      els.forEach(function (el) {
        el.classList.add('activated');
      });

      return els;
    },


  };

  return PresentationType;
})();
