<!DOCTYPE HTML>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <script type="text/javascript" src="JS/Object_PCMWave.js"></script>
    <script type="text/javascript" src="JS/Object_RIFF.js"></script>
    <script type="text/javascript" src="JS/Object_ByteConversions.js"></script>
    <script type="text/javascript" src="JS/Object_Tone.js"></script>
    <script type="text/javascript" src="JS/Object_MorseCode.js"></script>
    <script type="text/javascript" src="JS/JS.js"></script>
    
    <style>
      input[type=range] {
        width: 800px;
      }
      
      .morse {
        font-size: 24pt;
      }
    </style>
  </head>
  <body>
    <p>
      Input text here:
    </p>
    <textarea id="textinput"></textarea>
    <p>
      <input type="button" value="Show Morse Code" onclick="ShowMorseCode()" />
    </p>
    <hr />
    <p>
      Unit Duration Seconds: <input id="UnitDurationSeconds" type="text" value="0.08" />
      <br>Channels: <input id="Channels" type="text" value="1" placeholder="Channels" />
      <br>Sample Hz: <input id="SampleHz" type="text" value="8000" />
      <br>Bits Per Sample: <input id="BitsPerSample" type="text" value="8" />
      <br>Tone Hz: <input id="ToneHz" type="range" min="0" max="30000" value="500" oninput="updatetonelbl()"/> <span id="ToneLbl"></span>
      <br>Volume: <input id="VolumeFraction" type="range" min="0" max="1" step="0.01" value="0.5" />
      <br /><input type="button" value="Hear Morse Code" onclick="HearMorseCode()" />
    </p>
    <audio id="myaudio" controls=""></audio>
    
    <p>
      <textarea id="morseout" class="morse"></textarea>
      <br><textarea id="badchars"></textarea>
    </p>
    
    <script type="text/javascript">
      "use strict";
      
      function _e(Name) {
        return document.getElementById(Name);
      }
      function _v(Name) {
        var e = _e(Name);
        return e.value;
      }
      
      function updatetonelbl() {
        var t = _e('ToneHz');
        var l = _e('ToneLbl');
        
        l.innerHTML = t.value;
      }
      updatetonelbl();
      
      function FindBadChars(Text) {
        var Text = _v('textinput');
        var Morse = new Object_MorseCode();
        var c;
        var len = Text.length;
        var BadChars = '';
        for (c = 0; c < len; c++) {
          var ch = Text.charAt(c);
          if (Morse.f_GetCharMorse(ch) === '') {
            BadChars = BadChars + "\n" + ch + ' ' + Text.charCodeAt(c);
          }
        }
        
        var e = _e('badchars');
        e.innerHTML = BadChars;
      }
      
      function _getmorsetext(bForVisual) {
        var Text = document.getElementById('textinput').value;
        var Morse = new Object_MorseCode();
        var s = Morse.f_GetMorse(Text, bForVisual);
        return s;
      }
      
      function ShowMorseCode() {
        document.getElementById('morseout').innerHTML = _getmorsetext(true);
        FindBadChars();
      }
      
      function HearMorseCode() {
        var UnitDurationSeconds = _v('UnitDurationSeconds');
        var Channels = _v('Channels');
        var SampleHz = _v('SampleHz');
        var BitsPerSample = _v('BitsPerSample');
        var ToneHz = _v('ToneHz');
        var VolumeFraction = _v('VolumeFraction');
        
        
        var MorseChars = _getmorsetext(false);
        var Morse = new Object_MorseCode();
        Morse.SoundOut(MorseChars, 'myaudio', UnitDurationSeconds, Channels, SampleHz, BitsPerSample, ToneHz, VolumeFraction);
      }
    </script>
  </body>
</html>