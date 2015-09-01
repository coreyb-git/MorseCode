"use strict";

function Object_Audio_Channel() {
  this.Q = new Array();
  this.CurrentAudio = new Audio();
  this.Available = true;
  
  this.Play = function() {
    this.CurrentAudio.play();
  };
  
  this.Pause = function() {
    this.CurrentAudio.pause();
  };
  
  this.Stop = function() {
    this.CurrentAudio.pause();
    this.Available = true;
    this.Q = array();
  };
  
  this.LoadFromQueue = function() {
    var s = this.f_RetrieveNextQueued();
    if (s === '') {
      this.Available = true;
    } else {
      this.CurrentAudio.src = s;
//      this.CurrentAudio.load();
      this.CurrentAudio.play();
    }
  };
  
  this.UpdateChannel = function() {
    if (!this.Available) {
      if (this.CurrentAudio.ended) {
        this.LoadFromQueue();
      }
    }
  };
  
  this.f_GetNextUpdateTime = function() {
    var r = 10000;
    if (!this.Available) {
      if (!this.CurrentAudio.ended) {
//        r = (this.CurrentAudio.duration - this.CurrentAudio.currentTime) * 1000;
        r = 0;
      }
    }
    return r;
  };
  
  this.Queue = function(Source) {
    this.Q[this.Q.length] = Source;
    this.Available = false;
  };
  
  this.f_RetrieveNextQueued = function() {
    var s = '';
    if (this.Q.length > 0) {
      s = this.Q[0];
      var c;
      var len = this.Q.length;
      for (c = 0; c < len - 1; c++) this.Q[c] = this.Q[c + 1];
      this.Q.pop();  //pop last item off array
    }
    return s;
  };
}

function Object_Audio() {
  this.Channels = new Array();
  
  this.UpdateAll = function() {
    var len = this.Channels.length;
    var c;
    for (c = 0; c < len; c++) this.Channels[c].UpdateChannel();
  };
  
  this.f_GetNextUpdateTime = function() {
    var nextupdatetime = 10000;
    var temp;
    var len = this.Channels.length;
    var c;
    for (c = 0; c < len; c++) {
      temp = this.Channels[c].f_GetNextUpdateTime();
      if (temp < nextupdatetime) nextupdatetime = temp;
    }
//    var t = new Date();
//    var next = t.getTime() + nextupdatetime;
//    return next;
    return nextupdatetime;
  };
  
  this.f_FindFreeChannel = function() {
    var index = -1;
    var i = 0;
    var len = this.Channels.length;
    while (i < len) {
      if (this.Channels[i].Available) {
        index = i;
        i = len;
      }
      i++;
    }
    if (index < 0) {
      index = len;
      this.Channels[index] = new Object_Audio_Channel();
    }
    return index;
  };
  
  this.StopAll = function() {
    var c;
    var len = this.Channels.length;
    for (c = 0; c < len; c++) this.Channels[c].Stop();
  };
  
  this.PlayArray = function(ArrayOfSources) {
    var Channel = this.f_FindFreeChannel();
    var c;
    var len = ArrayOfSources.length;
    for (c = 0; c < len; c++) this.Channels[Channel].Queue(ArrayOfSources[c]);
    this.Channels[Channel].LoadFromQueue();
  };
}