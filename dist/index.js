"use strict";
exports.__esModule = true;
exports.extract = exports.embed = void 0;
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var highChar = String.fromCharCode(0x200b);
var lowChar = String.fromCharCode(0x200c);
// const highChar = "↑";
// const lowChar = "↓";
var textToByteArray = function (text) { return encoder.encode(text); };
var byteArrayToText = function (text) { return decoder.decode(text); };
var byteNumberToBinString = function (num) {
    return ("00000000" + num.toString(2)).slice(-8);
};
var binStringToByteNumber = function (s) { return parseInt(s, 2); };
var binStringToZeroWidthChars = function (binString) {
    return binString.replace(/0/g, lowChar).replace(/1/g, highChar);
};
var zeroWidthCharsToBinString = function (zeroWidthChars) {
    return zeroWidthChars
        .replace(new RegExp(highChar, "g"), "1")
        .replace(new RegExp(lowChar, "g"), "0");
};
var removeZeroWidthCharsFromText = function (text) {
    return text
        .replace(new RegExp(highChar, "g"), "")
        .replace(new RegExp(lowChar, "g"), "");
};
var removeNotZeroWidthCharsFromText = function (text) {
    return text.replace(new RegExp("[^" + highChar + lowChar + "]", "g"), "");
};
var dataToZeroWidthChars = function (data) {
    var zeroWidthCharsArray = [];
    (typeof data === "string" ? textToByteArray(data) : data).forEach(function (byte) {
        zeroWidthCharsArray.push(binStringToZeroWidthChars(byteNumberToBinString(byte)));
    });
    return zeroWidthCharsArray.join("");
};
var splitText = function (text, maxCharCount) {
    return text.match(new RegExp(".{1," + maxCharCount + "}", "g")) || [];
};
var mixText = function (text, zeroWidthChars) {
    var midText = text.substr(1, text.length - 2);
    var maxCharCount = Math.ceil(zeroWidthChars.length / (midText.length + 1));
    var multipleOfEightMaxCharCount = maxCharCount <= 8 ? 8 : Math.ceil(maxCharCount / 8) * 8;
    var zeroWidthCharsArray = splitText(zeroWidthChars, multipleOfEightMaxCharCount);
    var mixedMidText = "";
    var pointerOfText = 0;
    var pointerOfZeroWidthChars = 0;
    for (var idx = 0; idx < midText.length + zeroWidthCharsArray.length; idx++) {
        if (idx % 2 === 0 && pointerOfZeroWidthChars < zeroWidthCharsArray.length) {
            mixedMidText += zeroWidthCharsArray[pointerOfZeroWidthChars];
            pointerOfZeroWidthChars += 1;
        }
        else {
            mixedMidText += midText.charAt(pointerOfText);
            pointerOfText += 1;
        }
    }
    return "" + text.charAt(0) + mixedMidText + text.charAt(text.length - 1);
};
var embed = function (text, data, option) {
    var plainText = removeZeroWidthCharsFromText(text);
    var zeroWidthChars = dataToZeroWidthChars(data).repeat((option === null || option === void 0 ? void 0 : option.repeat) || 1);
    return mixText(plainText, zeroWidthChars);
};
exports.embed = embed;
var extract = function (text, option) {
    var zeroWidthChars = removeNotZeroWidthCharsFromText(text);
    var allBinString = zeroWidthCharsToBinString(zeroWidthChars);
    var byteArray = new Uint8Array(splitText(allBinString, 8).map(binStringToByteNumber));
    return ((option === null || option === void 0 ? void 0 : option.outputType) || "string") === "string"
        ? byteArrayToText(byteArray)
        : byteArray;
};
exports.extract = extract;
