import {
  Primitive
} from "./chunk-CO6567L6.js";
import {
  useLayoutEffect2
} from "./chunk-ABLNYG34.js";
import {
  require_react_dom
} from "./chunk-H7GTUFBN.js";
import {
  require_jsx_runtime
} from "./chunk-C7IBZWIG.js";
import {
  require_react
} from "./chunk-W565UGJ3.js";
import {
  __toESM
} from "./chunk-IKZWERSR.js";

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
//# sourceMappingURL=chunk-DYNB3ZY7.js.map
