import type { PropsWithChildren } from "react";
import { productCopy } from "../content/siteCopy";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="ambient ambient-right" />
      <img
        alt=""
        aria-hidden="true"
        className="site-ornament"
        decoding="async"
        src="https://tarot-1418573091.cos.ap-hongkong.myqcloud.com/decor/ornament-transparent.webp"
      />

      <header className="site-header">
        <div className="brand-block">
          <p className="eyebrow">{productCopy.badge}</p>
          <div className="brand-row">
            <h1>{productCopy.name}</h1>
            <span className="status-pill">Web MVP</span>
          </div>
          <p className="intro">{productCopy.tagline}</p>
        </div>
      </header>

      <main className="site-main">{children}</main>
    </div>
  );
}

