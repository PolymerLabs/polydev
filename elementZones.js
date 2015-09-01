console.log("WOO HOO!");

(function() {
  'use strict';
  let registerPatch = `console.log("WTF patched");
    var _oldRegister = document.registerElement.bind(document);
    document.registerElement = function(name, opts) {
      console.log("registering", name);
      return _oldRegister(name ,opts);
    };`;

  let script = document.createElement('script');
  script.appendChild(document.createTextNode(registerPatch));
  (document.body || document.head || document.documentElement).appendChild(script);

})();
