/**
 * @fileOverview
 * Events Class File
 *
 * Lightweight class for binding and triggering synthetic events.
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
    ], 
    function(
    ) {

    "use strict";
    
    ///////////////////////////////////////////////////////////
    // private methods
    ///////////////////////////////////////////////////////////
    var _eventSets = {};

    function _bind( type, namespace, handlerFunction) {
        if ((type == null && namespace == null) || handlerFunction == null) return;

        var event = {
            type: type,
            namespace: namespace,
            handlerFunction: handlerFunction
        };

        var eventSet = _eventSets[type];

        if (eventSet == null) {
            eventSet = _eventSets[type] = [];
        }

        eventSet.push(event);
    }

    function _unbind(type, namespace, handlerFunction) {
        //if type is not known, we need to enumerate through all registered types
        if (type == null) {

            for (type in _eventSets) {
                if (_eventSets.hasOwnProperty(type)) {
                    _unbindMatching(type, namespace, handlerFunction);

                    if (_eventSets[type] != null && _eventSets[type].length === 0) { delete _eventSets[type]}
                }
            }

        }
        else {
            _unbindMatching(type, namespace, handlerFunction);

            if (_eventSets[type] != null && _eventSets[type].length === 0) { delete _eventSets[type]}
        }
    }

    function _unbindMatching(type, namespace, handlerFunction) {
        var eventSet = _eventSets[type];

        if (eventSet != null) {
              for(var i=0; i < eventSet.length; i++) {
                var event = eventSet[i];

                if ( _matchingNamespace(event, namespace) &&  _matchingHandlerFunction(event, handlerFunction) ) {
                    eventSet.splice(i, 1);
                    i--;
                }
            }
        }
    }

    function _trigger(type, namespace, e) {
        var eventSet = _eventSets[type];

        if (eventSet != null) {
            for(var i=0; i < eventSet.length; i++) {
                var event = eventSet[i];

                if (_matchingNamespace(event, namespace)) {
                    //fire handler function
                    event.handlerFunction.call(window, e);
                }
            }
        }
    }

    function _getType(typeNamespace) {
        var type = null;

        if (typeNamespace != null) {
            var splitString = typeNamespace.split('.');
            if (splitString.length > 0) {
                type = splitString[0];
                if(type.trim() === '') { type = null; }
            }
        }

        return type;
    }

    function _getNamespace(typeNamespace) {
        var namespace = null;

        if (typeNamespace != null) {
            var splitString = typeNamespace.split('.');
            if (splitString.length > 1) {
                namespace = splitString[1];
                if(namespace.trim() === '') { namespace = null; }
            }
        }

        return namespace
    }

    function _matchingNamespace(event, namespace) {
        var match = false;
        if (namespace == null || event.namespace === namespace) {
            match = true;
        }
        return match;
    }

    function _matchingHandlerFunction(event, handlerFunction) {
        var match = false;
        if (handlerFunction == null ||  event.handlerFunction === handlerFunction) {
            match = true;
        }
        return match;
    }

    function _toString() {
        var result = '';

        for (var type in _eventSets) {
            if (_eventSets.hasOwnProperty(type)) {
                result += '<b>' + type + '</b><br>';

                var eventSet = _eventSets[type];

                for(var i=0; i < eventSet.length; i++) {
                    var event = eventSet[i];

                    result +=
                        event.type +
                        (event.namespace ? '.' + event.namespace : '') +
                        '<br>';
                }
            }
        }

        return result;
    }

    ///////////////////////////////////////////////////////////
    // public methods
    ///////////////////////////////////////////////////////////
    var Events = {

        bind: function(typeNamespace, handlerFunction) {
            var type = _getType(typeNamespace);
            var namespace = _getNamespace(typeNamespace);

            _bind(type, namespace, handlerFunction);
        },

        unbind: function(typeNamespace, handlerFunction) {
            var type = _getType(typeNamespace);
            var namespace = _getNamespace(typeNamespace);

            _unbind(type, namespace, handlerFunction);
         },

        trigger: function(typeNamespace, e) {
            var type = _getType(typeNamespace);
            var namespace = _getNamespace(typeNamespace);

            _trigger(type, namespace, e);
        },

        toString: function() {
            return _toString();
        }
    }
    
    return Events;
});