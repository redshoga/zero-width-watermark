# zero-width-watermark

Module for embedding information in text using zero-width characters

NPM: https://www.npmjs.com/package/zero-width-watermark

Example Web App: https://zero-width-watermark-web.vercel.app/

## Usage

```ts
import { embed, extract } from "zero-width-watermark";

// embed
const embeddedText = embed("sample", "hello world🐾");
console.log({ embeddedText });
// {
//   embeddedText: "s‌​​‌​‌‌‌‌​​‌‌​‌​‌​​‌​​‌‌a‌​​‌​​‌‌‌​​‌​​​​‌‌​‌‌‌‌‌m‌​​​‌​​​‌​​‌​​​​‌​​​‌‌​‌p‌​​‌​​‌‌‌​​‌‌​‌‌​​​​‌‌‌‌l​‌‌​​​​​​‌‌​‌‌‌‌​‌​​​​​‌e";
// }

// extractText
const extractText = extract(embeddedText);
console.log({ extractText });
// { extractText: 'hello world🐾' }
```

## Example of use

### Copyright protection

embed

```ts
const copyrightInfo = "<WrittenBy>@redshoga</WrittenBy>";
const blogText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

const embeddedBlogText = embed(blogText, copyrightInfo, { repeat: 10 });
```

extract

```ts
const extraData = extract(
  "I‌​​‌‌​​​‌​​‌‌‌‌​‌‌​​​​‌‌p‌‌​‌​​​​‌​‌​‌​​​‌​​​‌‌​‌s‌​​‌​‌‌​‌​​​‌​‌‌‌​​​‌​‌‌u‌​​‌‌​‌​‌​​‌​​​‌‌​‌‌‌‌​‌m‌​​​​‌‌​‌‌​​​​​‌‌‌​​​​‌‌ ‌​‌​‌​​​‌​​​‌‌​‌‌​​‌​‌‌​i‌​​​‌​‌‌‌​​​‌​‌‌‌​​‌‌​‌​s‌​​‌​​​‌‌​‌‌‌‌​‌‌​​​​‌‌​ ‌‌​​​​​‌‌​‌‌‌‌‌‌‌​​​‌‌​‌s‌​​‌‌​‌​‌​​‌‌​‌‌‌​​​‌‌​​i‌​​‌​‌‌‌‌​​‌​​​​‌​​‌‌​​​m‌​​‌‌‌‌​‌‌​​​​‌‌‌‌​‌​​​​p‌​‌​‌​​​‌​​​‌‌​‌‌​​‌​‌‌​l‌​​​‌​‌‌‌​​​‌​‌‌‌​​‌‌​‌​y‌​​‌​​​‌‌​‌‌‌‌​‌‌​​​​‌‌​ ‌‌​​​​​‌‌‌​​​​‌‌‌​‌​‌​​​d‌​​​‌‌​‌‌​​‌​‌‌​‌​​​‌​‌‌u‌​​​‌​‌‌‌​​‌‌​‌​‌​​‌​​​‌m‌​‌‌‌‌​‌‌​​​​‌‌​‌‌​​​​​‌m‌​‌‌‌‌‌‌‌​​​‌‌​‌‌​​‌‌​‌​y‌​​‌‌​‌‌‌​​​‌‌​​‌​​‌​‌‌‌ ",
  {
    outputType: "string",
  }
) as string;
// extraData: ga</WrittenBy><WrittenBy>@redshoga</WrittenBy><WrittenBy>@redshoga

const author = extraData.match(/<WrittenBy>(.+)<\/WrittenBy>/)[1];
// author: @redshoga
```

## Licence

MIT
