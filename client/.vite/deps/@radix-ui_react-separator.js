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

// node_modules/.pnpm/@radix-ui+react-separator@1.1.8_@types+react-dom@18.3.7_@types+react@18.3.27__@types+re_ee869837196e551570ae29ebefcce290/node_modules/@radix-ui/react-separator/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator = React.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return (0, import_jsx_runtime.jsx)(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator;
export {
  Root,
  Separator
};
//# sourceMappingURL=@radix-ui_react-separator.js.map
