"use strict";

function Object_PCMWave() {
  this.f_MakeWaveChunk = function(Channels, SampleRate, BitsPerSample, DataArray) {
    var ByteConversions = new Object_ByteConversions();
    
    var fmt_ChunkID = 'fmt ';
    var fmt_ChunkSize = ByteConversions.f_DWordToString(16);  //16 for PCM
    
    var fmt_AudioFormat = ByteConversions.f_WordToString(1);  //1 for PCM
    var fmt_NumChannels = ByteConversions.f_WordToString(Channels);
    var fmt_SampleRate = ByteConversions.f_DWordToString(SampleRate);
    var fmt_ByteRate = ByteConversions.f_DWordToString(SampleRate * Channels * BitsPerSample / 8);
    var fmt_BlockAlign = ByteConversions.f_WordToString(Channels * BitsPerSample / 8);
    var fmt_BitsPerSample = ByteConversions.f_WordToString(BitsPerSample);
    
    var data_ChunkID = 'data';
    var data_ChunkSize = ByteConversions.f_DWordToString(DataArray.length);
    
    var databytes = 0;
    var temp = BitsPerSample;
    while (temp > 0) {
      databytes++;
      temp -= 8;
    }
    
    var data_Data = '';
    var len = DataArray.length;
    var c;
    for (c = 0; c < len; c++) {
      temp = '';
      switch (databytes) {
        case 1: temp = ByteConversions.f_ByteToString(DataArray[c]); break;
        case 2: temp = ByteConversions.f_WordToString(DataArray[c]); break;
        case 4: temp = ByteConversions.f_DWordToString(DataArray[c]); break;
        default: console.log('unhandled databytes value of ' + databytes);
      }
      data_Data = data_Data + temp;
    }
    
    var s = '';
    s = s + fmt_ChunkID;
    s = s + ByteConversions.f_StringEndianSwap(fmt_ChunkSize);
    s = s + ByteConversions.f_StringEndianSwap(fmt_AudioFormat);
    s = s + ByteConversions.f_StringEndianSwap(fmt_NumChannels);
    s = s + ByteConversions.f_StringEndianSwap(fmt_SampleRate);
    s = s + ByteConversions.f_StringEndianSwap(fmt_ByteRate);
    s = s + ByteConversions.f_StringEndianSwap(fmt_BlockAlign);
    s = s + ByteConversions.f_StringEndianSwap(fmt_BitsPerSample);
    
    s = s + data_ChunkID;
    s = s + ByteConversions.f_StringEndianSwap(data_ChunkSize);
    
    var i = 0;
    while (i < len) {
      var tempbytes = '';
      for (c = 0; c < databytes; c++) {
        tempbytes = tempbytes + data_Data.charAt(i);
        i++;
      }
      s = s + ByteConversions.f_StringEndianSwap(tempbytes);
    }
    
    return s;
  };
}