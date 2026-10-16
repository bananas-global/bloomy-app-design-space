import { useEffect, useMemo, useRef } from "react";
import { serializeFixture, type Fixture } from "../workbench";
import "./device.css";

type FlutterFrameProps = {
  /** Flutter screen id, or `library` for an isolated component. */
  screen: string;
  /** Widget rendered when `screen` is `library`. */
  component?: string;
  data: Fixture;
  /** Mobile preset: Flutter reserves the safe area and the iOS bars are drawn. */
  device: boolean;
  /** In-app navigation reported by Flutter. */
  onScreen?: (screen: string) => void;
};

/**
 * Bridge to the Flutter preview. Only a new screen, component or device mode
 * reloads Flutter; data changes travel over postMessage so widget state and
 * scroll survive. Touch is always simulated (`hover=0`).
 */
export function FlutterFrame({ screen, component = "", data, device, onScreen }: FlutterFrameProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const payload = JSON.stringify(serializeFixture(data));
  const latest = useRef(payload);
  latest.current = payload;
  const sent = useRef("");
  const navigate = useRef(onScreen);
  navigate.current = onScreen;
  const src = useMemo(
    () =>
      "/flutter/index.html?" +
      new URLSearchParams({ screen, component, data: latest.current, safe: device ? "1" : "0", hover: "0" }),
    [screen, component, device],
  );
  function send(force = false) {
    if (!force && sent.current === latest.current) return;
    sent.current = latest.current;
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ type: "bloomy-fixture", data: JSON.parse(latest.current) }),
      location.origin,
    );
  }
  useEffect(() => send(), [payload]);
  useEffect(() => {
    sent.current = latest.current;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || typeof event.data !== "string") return;
      try {
        const message = JSON.parse(event.data);
        if (message.type === "bloomy-ready") send(true);
        if (message.type === "bloomy-screen" && typeof message.screen === "string" && message.screen.length < 40)
          navigate.current?.(message.screen);
      } catch {}
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, [src]);
  return (
    <div className="bloomy-device">
      <iframe ref={frame} key={src} src={src} title="App Bloomy em Flutter" />
      {device && <IosBars />}
    </div>
  );
}

function IosBars() {
  return (
    <>
      <div className="bloomy-ios" aria-hidden="true">
        <span>13:05</span>
        <i />
        <span className="bloomy-ios-icons">
          <svg width="18" height="14" viewBox="0 0 18 14">
            <path fill="currentColor" d="M0 9h3v5H0zm5-3h3v8H5zm5-3h3v11h-3zm5-3h3v14h-3z" />
          </svg>
          <svg width="18" height="14" viewBox="0 0 18 14">
            <path
              fill="currentColor"
              d="M9 14 6.5 11.5a3.5 3.5 0 0 1 5 0ZM4.5 9.5l-2-2a9.2 9.2 0 0 1 13 0l-2 2a6.3 6.3 0 0 0-9 0ZM0 5l2 2a10 10 0 0 1 14 0l2-2A12.8 12.8 0 0 0 0 5Z"
            />
          </svg>
          <svg width="27" height="14" viewBox="0 0 27 14">
            <rect x=".5" y=".5" width="23" height="13" rx="3" fill="none" stroke="currentColor" opacity=".4" />
            <rect x="2.5" y="2.5" width="19" height="9" rx="1.5" fill="currentColor" />
            <path d="M25 4v6c2-1 2-5 0-6" fill="currentColor" opacity=".5" />
          </svg>
        </span>
      </div>
      <div className="bloomy-home-indicator" aria-hidden="true" />
    </>
  );
}
