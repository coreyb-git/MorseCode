"use strict";

function Object_ByteConversions() {
  this.f_StringEndianSwap = function(S) {
    var r = '';
    var i = S.length - 1;
    while (i > -1) {
      r = r + S.charAt(i);
      i--;
    }
    return r;
  };
  
  this.f_ByteToString = function(Byte) {
    var b = (Byte & 255);
    var s = String.fromCharCode(b);
    return s;
  };
  this.f_WordToString = function(Word) {
    Word = (Word & 65535);
    var s2 = this.f_ByteToString(Word);
    Word = Word >> 8;
    var s1 = this.f_ByteToString(Word);
    return (s1 + s2);
  };
  this.f_DWordToString = function(DWord) {
    DWord = (DWord & 4294967295);
    var s4 = this.f_ByteToString(DWord);
    DWord = DWord >> 8;
    var s3 = this.f_ByteToString(DWord);
    DWord = DWord >> 8;
    var s2 = this.f_ByteToString(DWord);
    DWord = DWord >> 8;
    var s1 = this.f_ByteToString(DWord);
    return (s1 + s2 + s3 + s4);
  };
}