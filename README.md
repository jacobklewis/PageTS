# Page TS

A typescript static website DSL

```ts
b.div.class("content").with((c) => {
    c.h1.text("Home Page");
});
```

### Getting Started
```bash
npm i pagets
```

Add the following scripts to your `package.json`
```json
"scripts": {
    "prep": "pagets-css",
    "assemble": "pagets-assemble",
    "serve": "pagets-serve"
},
```

Add a `pagets-config.json` to your root project. Ex:
```json
{
    "publicDir": "./public",
    "stylesLess": [
        "./styles/main.less"
    ],
    "entryFile": "index.ts"
}
```

Add a `tsconfig.json` file. Ex:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "strict": true,
    "outDir": "./dist",
    "moduleResolution": "node"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ],
  "ts-node": {
    "esm": true
  }
}
```

Create your your entry file:
```ts
buildStatic({
  assemble: () => [homePage, aboutUs],
});
```
Your entry file defines the pages to be assembled.

Define your pages:
```ts
export const homePage = {
  path: "/",
  title: "Home",
  description: "A Static Website",
  buildHead: (h: HeaderTag) => { /* Only required for custom header tags */ },
  buildBody: (b: BodyTag) => {
        b.div.class("content").with((c) => {
          c.h1.text("Home Page");
        });
    }
} as PageContract;

export const aboutUs = {
  path: "/aboutus",
  title: "About Us",
  description: "A Static Website - About Us",
  buildHead: (h: HeaderTag) => {},
  buildBody: (b: BodyTag) => {
      b.div.class("content").with((c) => {
        c.h1.text("About Us");
      });
    }
} as PageContract;
```

Finally, run the following script:
```bash
npm run assemble
```
Your LESS styles will be assembled during this time.
If the `class("...")` typesafty shows an error, run `npm run prep`. You will need to run this if you update your styles. Or run `assemble`.

Feel free to preview your site using:
```bash
npm run serve
```

### License

Copyright 2025 Jacob K Lewis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
