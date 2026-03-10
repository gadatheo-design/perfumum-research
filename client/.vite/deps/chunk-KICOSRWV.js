import {
  Primitive
} from "./chunk-LVHV4G6R.js";
import {
  useLayoutEffect2
} from "./chunk-AO3N7MRC.js";
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

// node_modules/.pnpm/@radix-ui+react-portal@1.1.9_@types+react-dom@18.3.7_@types+react@18.3.27__@types+react_a95d18b6a60dc8d181a971a9b89b86b6/node_modules/@radix-ui/react-portal/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var PORTAL_NAME = "Portal";
var Portal = React.forwardRef((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = React.useState(false);
  useLayoutEffect2(() => setMounted(true), []);
  const container = containerProp || mounted && globalThis?.document?.body;
  return container ? import_react_dom.default.createPortal((0, import_jsx_runtime.jsx)(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal.displayName = PORTAL_NAME;

export {
  Portal
};
//# sourceMappingURL=chunk-KICOSRWV.js.map
