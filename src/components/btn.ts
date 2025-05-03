import { BodyTag, Tag } from "../html/tag.js";
import { tagBuilder } from "../tools/tagBuilder.js";

export const createBtn = (
  config: Partial<BtnConfig>,
  parentTag: Tag | undefined = undefined,
  existingTag: Tag | undefined = undefined
) => {
  const btn = tagBuilder(
    parentTag,
    existingTag ? existingTag : new BodyTag("a", {}, true)
  );
  btn.tag.name = "a";
  btn.class("btn");
  if (config.text) {
    btn.text(config.text);
  }
  if (config.to) {
    btn.attr("href", config.to);
  }
  if (config.target) {
    btn.attr("target", config.target);
  }
  if (config.spread) {
    btn.class("spread");
  }
  if (config.theme === "dark") {
    btn.class("dark");
  }
  if (config.color) {
    btn.style("background-color:" + config.color);
  }
  if (config.style === "outline" || config.style === "text") {
    btn.class(config.style);
  }
  return btn;
};

export interface BtnConfig {
  text: string | undefined;
  to: string | undefined;
  target: "_self" | "_blank" | "_parent" | "_top" | undefined;
  theme: "light" | "dark" | undefined;
  color: string | undefined;
  style: "solid" | "outline" | "text" | undefined;
  spread: boolean | undefined;
}
