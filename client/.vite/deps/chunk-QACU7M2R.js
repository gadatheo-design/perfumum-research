import {
  createSlot
} from "./chunk-Y7BNXYAE.js";
import {
  require_react_dom
} from "./chunk-Q5RSFHXU.js";
import {
  require_jsx_runtime
} from "./chunk-DGDLWPZF.js";
import {
  require_react
} from "./chunk-PZKFATAE.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@18.3.7_@types+react@18.3.27__@types+re_31f1dfe54ed79c6f4643d427782d19d7/node_modules/@radix-ui/react-primitive/dist/index.mjs
var React = __toESM(require_react(), 1);
var ReactDOM = __toESM(require_react_dom(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = React.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[/* @__PURE__ */ Symbol.for("radix-ui")] = true;
    }
    return (0, import_jsx_runtime.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});

export {
  Primitive
};
//# sourceMappingURL=chunk-QACU7M2R.js.map
