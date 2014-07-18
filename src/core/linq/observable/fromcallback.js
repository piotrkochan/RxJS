  /**
   * Converts a callback function to an observable sequence. 
   * 
   * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
   * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
   * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
   */
  Observable.fromCallback = function (func, context, selector) {
    return function () {
      var args = arguments;

      return new AnonymousObservable(function (observer) {
        function handler(e) {
          var results = e;
          
          if (selector) {
            try {
              results = selector(arguments);
            } catch (err) {
              observer.onError(err);
              return;
            }
          } else {
            if (results.length === 1) { results = results[0]; }
          }

          observer.onNext(results);
          observer.onCompleted();
        }

        args.push(handler);
        func.apply(context, args);
      });
    };
  };
