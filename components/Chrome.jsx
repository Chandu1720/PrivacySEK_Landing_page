import { top, bottom } from "../content/layout";

/** Shared header / mobile menu (top) and footer / mobile CTA bar (bottom). */
export default function Chrome({ position }) {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: position === "top" ? top : bottom }} />;
}
