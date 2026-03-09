import {
  package_default
} from "./chunk-FE2VBPSA.js";
import {
  selectSvgElement
} from "./chunk-AOZEJJG5.js";
import {
  parse
} from "./chunk-3VF4PA5A.js";
import "./chunk-ZE6R5AQR.js";
import "./chunk-IOZCHWQB.js";
import "./chunk-ONARANBO.js";
import "./chunk-ONABVZRI.js";
import "./chunk-W35DBHZP.js";
import "./chunk-TVET3MKT.js";
import "./chunk-C3IWANM7.js";
import "./chunk-SMDKTJQO.js";
import "./chunk-PSSF4CB3.js";
import "./chunk-VPBPJOIG.js";
import {
  configureSvgSize
} from "./chunk-HU354MWA.js";
import "./chunk-GGVHNCRK.js";
import "./chunk-APHUGSLJ.js";
import {
  __name,
  log
} from "./chunk-DYPMJZ6I.js";
import "./chunk-CGZTP6GY.js";
import "./chunk-6TQSQCNJ.js";
import "./chunk-ILFZJLTO.js";
import "./chunk-XTSRIIAZ.js";
import "./chunk-IKZWERSR.js";

// node_modules/.pnpm/mermaid@11.12.2/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-WHAUD3N6.mjs
var parser = {
  parse: __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};
var DEFAULT_INFO_DB = {
  version: package_default.version + (true ? "" : "-tiny")
};
var getVersion = __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};
var draw = __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
//# sourceMappingURL=infoDiagram-WHAUD3N6-A5RLFF3Z.js.map
