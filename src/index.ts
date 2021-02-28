const encoder = new TextEncoder();
const decoder = new TextDecoder();

const highChar = String.fromCharCode(0x200b);
const lowChar = String.fromCharCode(0x200c);

// const highChar = "↑";
// const lowChar = "↓";

const textToByteArray = (text: string): Uint8Array => encoder.encode(text);
const byteArrayToText = (text: Uint8Array): string => decoder.decode(text);

const byteNumberToBinString = (num: number): string =>
  ("00000000" + num.toString(2)).slice(-8);
const binStringToByteNumber = (s: string) => parseInt(s, 2);

const binStringToZeroWidthChars = (binString: string): string =>
  binString.replace(/0/g, lowChar).replace(/1/g, highChar);
const zeroWidthCharsToBinString = (zeroWidthChars: string): string =>
  zeroWidthChars
    .replace(new RegExp(highChar, "g"), "1")
    .replace(new RegExp(lowChar, "g"), "0");

const removeZeroWidthCharsFromText = (text: string): string =>
  text
    .replace(new RegExp(highChar, "g"), "")
    .replace(new RegExp(lowChar, "g"), "");
const removeNotZeroWidthCharsFromText = (text: string): string =>
  text.replace(new RegExp(`[^${highChar}${lowChar}]`, "g"), "");

const dataToZeroWidthChars = (data: string | Uint8Array): string => {
  let zeroWidthCharsArray: string[] = [];
  (typeof data === "string" ? textToByteArray(data) : data).forEach((byte) => {
    zeroWidthCharsArray.push(
      binStringToZeroWidthChars(byteNumberToBinString(byte))
    );
  });
  return zeroWidthCharsArray.join("");
};

const splitText = (text: string, maxCharCount: number): string[] => {
  return text.match(new RegExp(".{1," + maxCharCount + "}", "g")) || [];
};

const mixText = (text: string, zeroWidthChars: string): string => {
  const midText = text.substr(1, text.length - 2);
  const maxCharCount = Math.ceil(zeroWidthChars.length / (midText.length + 1));
  const zeroWidthCharsArray = splitText(zeroWidthChars, maxCharCount);

  let mixedMidText = "";
  for (let idx = 0; idx < midText.length + zeroWidthCharsArray.length; idx++) {
    if (idx % 2 === 0) {
      mixedMidText += zeroWidthCharsArray[idx / 2];
    } else {
      mixedMidText += midText.charAt((idx + 1) / 2 - 1);
    }
  }

  return `${text.charAt(0)}${mixedMidText}${text.charAt(text.length - 1)}`;
};

const embed = (
  text: string,
  data: string | Uint8Array,
  option?: {
    repeat?: number;
  }
): string => {
  const plainText: string = removeZeroWidthCharsFromText(text);
  const zeroWidthChars: string = dataToZeroWidthChars(data).repeat(
    option?.repeat || 1
  );
  return mixText(plainText, zeroWidthChars);
};

const extract = (
  text: string,
  option?: {
    outputType?: "string" | "Uint8Array";
  }
): string | Uint8Array => {
  const zeroWidthChars = removeNotZeroWidthCharsFromText(text);
  const allBinString = zeroWidthCharsToBinString(zeroWidthChars);
  const byteArray = new Uint8Array(
    splitText(allBinString, 8).map(binStringToByteNumber)
  );

  return (option?.outputType || "string") === "string"
    ? byteArrayToText(byteArray)
    : byteArray;
};

(() => {
  const embeddedText = embed("sample", "サンプルテキスト🐾");
  const extraData = extract(embeddedText);
  console.log({
    embeddedText,
    extraData,
  });
})();
