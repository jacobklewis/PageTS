import { buildStatic, HeaderTag, PageContract } from "../src/index.js";

const page1 = {
  title: "My Page",
  description: "Sample Description",
  path: "/",
  buildHead: (h) => {},
  buildBody(b) {
    b.div.class("content").with((c) => {
      c.btn({ text: "Hello", to: "https://jacoblewis.me" });
    });
  },
} as PageContract;

buildStatic({
  assemble: () => [page1],
});
