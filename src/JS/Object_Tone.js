"use strict";

function Object_Tone() {
  this.f_GetTone = function(Channels, SampleHz, BitsPerSample, ToneHz, VolumeFraction, DurationSeconds) {
    var samplearray = new Array();
    
    var range = Math.pow(2, BitsPerSample - 1) - 1;
    range *= VolumeFraction;
    range = Math.floor(range);
    var base = 0;
    if (BitsPerSample == 8) base = 127;
    var max = base + range;
    var min = base - range;
    
    var maxsamples = SampleHz * DurationSeconds;
    var sampleindex = 0;
    var pi180 = Math.PI / 180;
    while (sampleindex < maxsamples) {
      var secondspassed = sampleindex / SampleHz;
      var toneposition = ToneHz * secondspassed;
      
      var rangefrac = Math.sin(toneposition * 360 * pi180);
      var sample = base + (rangefrac * range);
      
      if (sample < min) sample = min;
      if (sample > max) sample = max;
      
      var channel;
      for (channel = 0; channel < Channels; channel++) samplearray.push(sample);
      
      sampleindex++;
    }
    
    return samplearray;
  };
}