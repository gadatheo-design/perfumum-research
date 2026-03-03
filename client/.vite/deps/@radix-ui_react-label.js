"use client";
import {
  Primitive
} from "./chunk-QACU7M2R.js";
import "./chunk-Y7BNXYAE.js";
import "./chunk-Y7VN2NIC.js";
import "./chunk-Q5RSFHXU.js";
import {
  require_jsx_runtime
} from "./chunk-DGDLWPZF.js";
import {
  require_react
} from "./chunk-PZKFATAE.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@radix-ui+react-label@2.1.8_@types+react-dom@18.3.7_@types+react@18.3.27__@types+react@_f9fd656c7e25d0f098a7f09db9ff7e4d/node_modules/@radix-ui/react-label/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var NAME = "Label";
var Label = React.forwardRef((props, forwardedRef) => {
  return (0, import_jsx_runtime.jsx)(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        props.onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label.displayName = NAME;
var Root = Label;
export {
  Label,
  Root
};
//# sourceMappingURL=@radix-ui_react-label.js.map
