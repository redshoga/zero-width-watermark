import { embed, extract } from "./../src/index";

const examples = {
  text: "Lorem Ipsum is simply dummy ",
  textData: "dfoianj@o34fp ¥dfa0f8h31uif;n  a sdfojpu934",
  binData: new Uint8Array([12, 5, 4, 135, 31, 41, 34, 31, 153, 123]),
};

describe("zero-width-watermark", () => {
  test("Embed text to text", () => {
    const embeddedText = embed(examples.text, examples.textData);
    const extraData = extract(embeddedText);
    expect(extraData).toBe(examples.textData);
  });

  test("Embed Uint8Array data to text", () => {
    const embeddedText = embed(examples.text, examples.binData);
    const extraData = extract(embeddedText, { outputType: "Uint8Array" });
    expect(extraData).toStrictEqual(examples.binData);
  });

  test("Copyright protection example", () => {
    const copyrightInfo = "<WrittenBy>@redshoga</WrittenBy>";
    const blogText =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

    const embeddedBlogText = embed(blogText, copyrightInfo, { repeat: 10 });
    console.log(embeddedBlogText);

    const partOfBlogText = embeddedBlogText.slice(
      embeddedBlogText.search(/I.*p.*s.*u.*m/),
      embeddedBlogText.search(/t.*h.*e/)
    );
    // partOfBlogText: I‌​​‌‌​​​‌​​‌‌‌‌​‌‌​​​​‌‌p‌‌​‌​​​​‌​‌​‌​​​‌​​​‌‌​‌s‌​​‌​‌‌​‌​​​‌​‌‌‌​​​‌​‌‌u‌​​‌‌​‌​‌​​‌​​​‌‌​‌‌‌‌​‌m‌​​​​‌‌​‌‌​​​​​‌‌‌​​​​‌‌ ‌​‌​‌​​​‌​​​‌‌​‌‌​​‌​‌‌​i‌​​​‌​‌‌‌​​​‌​‌‌‌​​‌‌​‌​s‌​​‌​​​‌‌​‌‌‌‌​‌‌​​​​‌‌​ ‌‌​​​​​‌‌​‌‌‌‌‌‌‌​​​‌‌​‌s‌​​‌‌​‌​‌​​‌‌​‌‌‌​​​‌‌​​i‌​​‌​‌‌‌‌​​‌​​​​‌​​‌‌​​​m‌​​‌‌‌‌​‌‌​​​​‌‌‌‌​‌​​​​p‌​‌​‌​​​‌​​​‌‌​‌‌​​‌​‌‌​l‌​​​‌​‌‌‌​​​‌​‌‌‌​​‌‌​‌​y‌​​‌​​​‌‌​‌‌‌‌​‌‌​​​​‌‌​ ‌‌​​​​​‌‌‌​​​​‌‌‌​‌​‌​​​d‌​​​‌‌​‌‌​​‌​‌‌​‌​​​‌​‌‌u‌​​​‌​‌‌‌​​‌‌​‌​‌​​‌​​​‌m‌​‌‌‌‌​‌‌​​​​‌‌​‌‌​​​​​‌m‌​‌‌‌‌‌‌‌​​​‌‌​‌‌​​‌‌​‌​y‌​​‌‌​‌‌‌​​​‌‌​​‌​​‌​‌‌‌ ‌​​‌​​​​‌​​‌‌​​​‌​​‌‌‌‌​

    const extraData = extract(partOfBlogText, {
      outputType: "string",
    }) as string;
    // extraData: ga</WrittenBy><WrittenBy>@redshoga</WrittenBy><WrittenBy>@redshoga

    const author = extraData.match(/<WrittenBy>(.+)<\/WrittenBy>/);
    expect(JSON.parse(JSON.stringify(author))).toStrictEqual([
      "<WrittenBy>@redshoga</WrittenBy>",
      "@redshoga",
    ]);
  });
});
