import { buildStatic, HeaderTag, PageContract } from "../src/index.js";

const page1 = {
  title: "My Page",
  description: "Sample Description",
  path: "/",
  buildBody(b) {
    b.content.with((c) => {
      c.btn({ text: "Hello", to: "https://jacoblewis.me", spread: true });
      c.break;
      c.btn({ text: "Good Day", to: "https://jacoblewis.me", spread: true });
      c.btn({ text: "Bye Bye", to: "https://jacoblewis.me", spread: true });
    });
    b.content.with((c) => {
      c.mdText("This is a test of the __markdown__ text component");
    });
  },
} as PageContract;

buildStatic({
  assemble: () => [page1],
});
