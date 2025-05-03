import { createBtn } from "../../components/btn.js";
import { TagConfig } from "../tagParser.js";

export const assembleBtn = (c: TagConfig) => {
  // Verify attributes
  if (!c.attributes["to"]) {
    console.error("s-btn: Missing 'to' attribute");
    throw new Error("s-btn: Missing 'to' attribute");
  }
  createBtn(
    {
      text: c.innerHTML,
      to: c.attributes["to"],
      target: c.attributes["target"] as "_self" | "_blank" | "_parent" | "_top",
      theme: c.attributes["theme"] as "light" | "dark",
      color: c.attributes["color"],
      style: c.attributes["style"] as "solid" | "outline" | "text",
      spread: c.attributes["spread"] !== undefined,
    },
    undefined,
    c.tag
  );
};
