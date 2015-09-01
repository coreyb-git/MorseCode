"use strict";

function Object_MorseCode() {
  this.SourceText = '';
  this.ProcessedMorseCode = '';
  
  this.BadChars = '';
  
  this.SourceCharStartTime = new Array();
  this.MorseCharStartTime = new Array();
  
  this.SampleData = new Array();
  
  this._CleanText = function(Text) {
    var r = '';
    var c;
    var len = Text.length;
    var previous = '';
    for (c = 0; c < len; c++) {
      var code = Text.charCodeAt(c);
      var ch = Text.charAt(c);
      if (code < 32) ch = '';  //space
      if (code >= 126) ch = '';  //tilde
      if (ch === ' ') {
        if (previous !== ' ') ch = '';
      }
      if (ch === '`') ch = "'";
      if (ch === '\\') ch = '/';
      if ((ch === '[') || (ch === '{') || (ch === '<')) ch = '(';
      if ((ch === ']') || (ch === '}') || (ch === '>')) ch = ')';
      if ((ch === '^') || (ch === '_') || (ch === '|')) ch = '';
    }
    
    return r;
  };
  
  this.Process = function(Text, UnitDurationSeconds) {
    this.SourceText = this._CleanText(Text);
  };
  
  this.SoundOut = function(MorseCode, AudioElementID, UnitDurationSeconds, Channels, SampleHz, BitsPerSample, ToneHz, VolumeFraction) {
    var Tone = new Object_Tone();
    var ShortDurationSeconds = UnitDurationSeconds;
    var LongDurationSeconds = ShortDurationSeconds * 3;
    
    var shortsamples = Tone.f_GetTone(Channels, SampleHz, BitsPerSample, ToneHz, VolumeFraction, ShortDurationSeconds);
    var shortsilentsamples = Tone.f_GetTone(Channels, SampleHz, BitsPerSample, ToneHz, 0, ShortDurationSeconds);
    var longsamples = Tone.f_GetTone(Channels, SampleHz, BitsPerSample, ToneHz, VolumeFraction, LongDurationSeconds);
    var longsilentsamples = Tone.f_GetTone(Channels, SampleHz, BitsPerSample, ToneHz, 0, LongDurationSeconds);
    
    var samples = new Array();
    var c;
    var c2;
    for (c = 0; c < MorseCode.length; c++) {
      switch(MorseCode.charAt(c)) {
        case "." :
          for (c2 = 0; c2 < shortsamples.length; c2++) samples.push(shortsamples[c2]);
          break;
        case "-" :
          for (c2 = 0; c2 < longsamples.length; c2++) samples.push(longsamples[c2]);
          break;
        case "/" :
          for (c2 = 0; c2 < shortsilentsamples.length; c2++) samples.push(shortsilentsamples[c2]);
          break;
        case " " :
          for (c2 = 0; c2 < longsilentsamples.length; c2++) samples.push(longsilentsamples[c2]);
          break;
      }
      for (c2 = 0; c2 < shortsilentsamples.length; c2++) samples.push(shortsilentsamples[c2]);
    }
    
    var PCMWave = new Object_PCMWave();
    var Chunk = PCMWave.f_MakeWaveChunk(Channels, SampleHz, BitsPerSample, samples);

    var RIFF = new Object_RIFF();
    RIFF.AddChunk('WAVE', Chunk);
    var RIFFWAVE = RIFF.f_MakeRIFF();

    var e = document.getElementById(AudioElementID);
    var b64 = window.btoa(RIFFWAVE);
    e.src = "data:audio/wav;base64," + b64;
    e.play();
  };
  
  this.f_GetProsignMorse = function(Prosign) {
    var r = '';
    Prosign = Prosign.toUpperCase();
    
    switch(Prosign) {
      case "END OF WORK" : r = '...-.-'; break;
      case "ERROR" : r = '........'; break;
      case "INVITATION TO TRANSMIT" : r = '-.-'; break;  //also = K
      case "STARTING SIGNAL" : r = '-.-.-'; break;
      case "UNDERSTOOD" : r = '...-.'; break;
      case "WAIT" : r = '.-...'; break;  //also = &
    }
  };
  
  this.f_GetCharMorse = function(Char) {
    var r = '';
    
    Char = Char.toUpperCase();
    
    switch(Char) {
      case " " : r = ' '; break;
      
      case "A" : r = '.-'; break;
      case "B" : r = '-...'; break;
      case "C" : r = '-.-.'; break;
      case "D" : r = '-..'; break;
      case "E" : r = '.'; break;
      case "F" : r = '..-.'; break;
      case "G" : r = '--.'; break;
      case "H" : r = '....'; break;
      case "I" : r = '..'; break;
      case "J" : r = '.---'; break;
      case "K" : r = '-.-'; break;
      case "L" : r = '.-..'; break;
      case "M" : r = '--'; break;
      case "N" : r = '-.'; break;
      case "O" : r = '---'; break;
      case "P" : r = '.--.'; break;
      case "Q" : r = '--.-'; break;
      case "R" : r = '.-.'; break;
      case "S" : r = '...'; break;
      case "T" : r = '-'; break;
      case "U" : r = '..-'; break;
      case "V" : r = '...-'; break;
      case "W" : r = '.--'; break;
      case "X" : r = '-..-'; break;
      case "Y" : r = '-.--'; break;
      case "Z" : r = '--..'; break;
      
      case "0" : r = '-----'; break;
      case "1" : r = '.----'; break;
      case "2" : r = '..---'; break;
      case "3" : r = '...--'; break;
      case "4" : r = '....-'; break;
      case "5" : r = '.....'; break;
      case "6" : r = '-....'; break;
      case "7" : r = '--...'; break;
      case "8" : r = '---..'; break;
      case "9" : r = '----.'; break;
      
      case "." : r = '.-.-.-'; break;
      case "," : r = '--..--'; break;
      case "?" : r = '..--..'; break;
      case "'" : r = '.----.'; break;
      case "!" : r = '-.-.--'; break;
      case "/" : r = '-..-.'; break;
      case "(" : r = '-.--.'; break;
      case ")" : r = '-.--.-'; break;
      case "&" : r = '.-...'; break;
      case ":" : r = '---...'; break;
      case ";" : r = '-.-.-.'; break;
      case "=" : r = '-...-'; break;
      case "+" : r = '.-.-.'; break;
      case "-" : r = '-....-'; break;
      case '"' : r = '.-..-.'; break;
      case "$" : r = '...-..-'; break;
      case "@" : r = '.--.-.'; break;
    }
    
    return r;
  };
  
  this.f_GetMorse = function(Text, bForVisual) {
    var r = '';
    var c;
    var len = Text.length;
    for (c = 0; c < len; c++) {
      var char = this.f_GetCharMorse(Text.charAt(c));
      r = r + char;
      if (bForVisual) {
        if (char === '') r = r + '?';
        r = r + '&nbsp;&nbsp; ';
        if (char === " ") r = r + "&nbsp;&nbsp;&nbsp;&nbsp; ";
      } else {
        r = r + '/';
      }
    }
    return r;
  };
}