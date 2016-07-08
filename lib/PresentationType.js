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
      this.receivers = [];
    } else {
      var result = presentationTypes[name];
      if (result === undefined) {
        result = new PresentationType(name);
        presentationTypes[result.name] = result;
      }
      return result;
    }
  }

  PresentationType.prototype = {
    presentationsTypes: presentationTypes,

    isOfType(name) {
      var type = presentationTypes[name];
      console.log(name);
      console.log(type);
      return type.isPrototypeOf(this);
    },

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

    notifyReceivers(theEvent, self) {
      if (self === undefined) {
        self = this;
      }

      var outerArgs = Array.prototype.slice.call(arguments);
      outerArgs.unshift(theEvent, self, self.value);

      this.receivers.forEach((function (theReceiver) {
        theReceiver.receive.apply(theReceiver, outerArgs);
      }));

      var parent = Object.getPrototypeOf(this);
      if (parent instanceof PresentationType && parent.receivers !== undefined && parent.receivers !== []) {
        parent.notifyReceivers(theEvent, self);
      }
    },

    selectAllTags() {
      return Array.prototype.slice.call(
        document.querySelectorAll(this.selector)
      );
    },

    selectAll() {
      var allTags = this.selectAllTags();
      return Array.prototype.map.call(allTags, function (el) {
        return el.ptObject;
      });
    },

    bindTags() {
      var els = this.selectAllTags().filter(function (theEl) { return theEl.ptObject === undefined; });

      els.forEach(function (theEl) {
        var content = theEl.textContent.trim();
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

      this.classes.forEach(function (cls) {
        tag.classList.add(cls);
      });

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

    get classes() {
      var current = this,
          classes = new Set();
      while (current instanceof PresentationType) {
        if (current.name !== undefined) {
          classes.add(current.name);
        }
        current = Object.getPrototypeOf(current);
      }

      return classes;
    },

    extend(name, props) {
      if (this.children === undefined) {
        this.children = [];
      }

      if (props === undefined) {
        props = {};
      }

      props.name = name;
      if (props.selector === undefined) {
        props.selector = '.' + name;
      }
      props.receivers = [];
      var newType = Object.assign(Object.create(this), props);
      presentationTypes[name] = newType;
      this.children.push(newType);
      return newType;
    },

    makeTag(value, tagName, bindTypes, content) {
      var newTag = document.createElement(tagName);

      this.classes.forEach(function (cls) { newTag.classList.add(cls); });

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
