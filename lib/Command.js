function PresentationTypeError(msg, expectedType, actualVal) {
  if (this instanceof TypeError) {
    return new TypeError(msg, expectedType, actualVal);
  } else {
    this.msg = msg;
    this.expectedType = expectedType;
    this.actualVal = actualVal;
  }


}

CursorAbort = {};
Command = (function() {

  function TypeCursor(types) {
    if (! (this instanceof TypeCursor) ) {
      return new TypeCursor(types);
    }

    this.types = types;
    this.boundArgs = new Array(types.length);
    this.currentIdx = 0;

    var self = this;
    this.promise = new Promise(function (resolve, reject) {
      self.resolve = resolve;
      self.reject = reject;
    });
  }

  TypeCursor.prototype = {
    abort() {
      var currentType = this.types[this.currentIdx-1];
      if (currentType !== undefined) {
        currentType.deactivateAll();
        currentType.removeReceiver(this);
      }

      //this.reject(CursorAbort);
    },

    activate() {
      if (this.currentIdx >= this.types.length) {
        this.resolve.bind(this.promise)(this.boundArgs);
      } else {
        var currentType = this.types[this.currentIdx++];
        currentType.addReceiver(this);
        currentType.activateAll();
      }
      return this.promise;
    },

    receive(event, presentationType, arg) {
      var args = Array.prototype.splice(arguments);
      args.shift();
      presentationType.removeReceiver(this);
      presentationType.deactivateAll();

      if (presentationType.validate.apply(args)) {
        this.boundArgs[this.currentIdx-1] = presentationType;
        this.activate();
      } else {
        this.reject(args);
      }
    }
  };

  function Command(types) {
    if (! (this instanceof Command)) {
      throw "do \"new Command()\"";
    }

    this.types = types.map(function (type) {
      // Lookup or create a presentation type
      return PresentationType(type);
    });

    this.nargs = this.types.length;
  }

  Command.prototype = {
    run(args) {
      if (args === undefined) {
        args = [];
      } else if (arguments.length > 1 || (! args instanceof Array)) {
        args = Array.prototype.slice.call(arguments);
      }

      for (var idx = 0; idx < args.length; idx++) {
        var type = this.types[idx];
        var arg = args[idx];
        console.log(this.types[idx], args[idx]);
        if ( type.name !== arg.name ) {
          throw new PresentationTypeError('wrong type', this.types[idx], args[idx]);
        }
      }
      this.execute.apply(this, args);
    },

    handleEvent(theEvent) {
      if (this.cursor !== undefined) {
        this.cursor.abort();
      }

      this.cursor = TypeCursor(this.types);
      this.cursor.activate().then(this.run.bind(this));

      return true;
    }
  };

  return Command;
})();
