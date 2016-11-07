/**
 * Profile model events
 */

'use strict';

import {EventEmitter} from 'events';
import Profile from './profile.model';
var ProfileEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProfileEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Profile.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProfileEvents.emit(event + ':' + doc._id, doc);
    ProfileEvents.emit(event, doc);
  };
}

export default ProfileEvents;
