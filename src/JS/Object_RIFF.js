"use strict";

function Object_RIFF() {
  this.ChunksArray = new Array();
  
  this.AddChunk = function(ChunkFourCC, ChunkData) {
    var s = ChunkFourCC + ChunkData;
    this.ChunksArray[this.ChunksArray.length] = s;
  };
  
  this.f_MakeRIFF = function() {
    var TotalSize = 0;
    var len = this.ChunksArray.length;
    var c;
    for (c = 0; c < len; c++) TotalSize += this.ChunksArray[c].length;
    
    var ByteConversions = new Object_ByteConversions();
    TotalSize = ByteConversions.f_DWordToString(TotalSize);
    TotalSize = ByteConversions.f_StringEndianSwap(TotalSize);  //little endian
    
    var s = 'RIFF' + TotalSize;
    for (c = 0; c < len; c++) s = s + this.ChunksArray[c];
    
    return s;
  };
}