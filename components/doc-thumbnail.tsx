import { cn } from "@/lib/utils";
import type { Accent, Thumbnail } from "@/lib/docs";

type DocThumbnailProps = {
  type: Thumbnail;
  accent: Accent;
  className?: string;
};

export function DocThumbnail({ type, accent, className }: DocThumbnailProps) {
  return (
    <div className={cn("thumb thumb-noise", `thumb-${accent}`, `thumb-${type}`, className)} aria-hidden="true">
      {type === "overview" ? <OverviewThumb /> : null}
      {type === "gateway" ? <GatewayThumb /> : null}
      {type === "quick" ? <QuickThumb /> : null}
      {type === "device" ? <DeviceThumb /> : null}
      {type === "user" ? <UserThumb /> : null}
      {type === "access" ? <AccessThumb /> : null}
      {type === "logs" ? <LogsThumb /> : null}
      {type === "language" ? <LanguageThumb /> : null}
      {type === "config" ? <ConfigThumb /> : null}
    </div>
  );
}

function OverviewThumb() {
  return (
    <>
      <span className="mini-window overview-window" />
      <span className="mini-pill overview-grpc">gRPC</span>
      <span className="mini-pill overview-sdk">SDK</span>
      <span className="mini-node overview-node-a" />
      <span className="mini-node overview-node-b" />
      <span className="mini-node overview-node-c" />
      <span className="mini-link overview-link-a" />
      <span className="mini-link overview-link-b" />
    </>
  );
}

function GatewayThumb() {
  return (
    <>
      <span className="gateway-box gateway-client">Client</span>
      <span className="gateway-box gateway-master">Master</span>
      <span className="gateway-box gateway-device">Device</span>
      <span className="gateway-rack rack-a" />
      <span className="gateway-rack rack-b" />
      <span className="gateway-rack rack-c" />
      <span className="mini-link gateway-link-a" />
      <span className="mini-link gateway-link-b" />
    </>
  );
}

function QuickThumb() {
  return (
    <>
      <span className="terminal-panel">
        <span />
        <span />
        <span />
      </span>
      <span className="code-line code-a" />
      <span className="code-line code-b" />
      <span className="code-line code-c" />
      <span className="play-badge">▶</span>
      <span className="mini-pill quick-done">connected</span>
    </>
  );
}

function DeviceThumb() {
  return (
    <>
      <span className="device-body" />
      <span className="fingerprint-ring ring-a" />
      <span className="fingerprint-ring ring-b" />
      <span className="fingerprint-ring ring-c" />
      <span className="device-status status-a" />
      <span className="device-status status-b" />
      <span className="mini-pill device-id">Device ID</span>
    </>
  );
}

function UserThumb() {
  return (
    <>
      <span className="profile-card" />
      <span className="profile-avatar" />
      <span className="profile-line profile-line-a" />
      <span className="profile-line profile-line-b" />
      <span className="credential-card" />
      <span className="mini-pill user-card">Card</span>
      <span className="mini-pill user-face">Face</span>
    </>
  );
}

function AccessThumb() {
  return (
    <>
      <span className="door-frame" />
      <span className="door-panel" />
      <span className="schedule-grid" />
      <span className="access-check check-a" />
      <span className="access-check check-b" />
      <span className="mini-pill access-zone">Zone</span>
    </>
  );
}

function LogsThumb() {
  return (
    <>
      <span className="table-panel" />
      <span className="table-row row-a" />
      <span className="table-row row-b" />
      <span className="table-row row-c" />
      <span className="table-row row-d" />
      <span className="chart-bar bar-a" />
      <span className="chart-bar bar-b" />
      <span className="chart-bar bar-c" />
      <span className="mini-pill log-live">live log</span>
    </>
  );
}

function LanguageThumb() {
  return (
    <>
      <span className="tabs tabs-a">C#</span>
      <span className="tabs tabs-b">Py</span>
      <span className="tabs tabs-c">Go</span>
      <span className="code-card" />
      <span className="code-line lang-a" />
      <span className="code-line lang-b" />
      <span className="code-line lang-c" />
      <span className="mini-pill proto-pill">proto</span>
    </>
  );
}

function ConfigThumb() {
  return (
    <>
      <span className="config-panel" />
      <span className="toggle-row toggle-a" />
      <span className="toggle-row toggle-b" />
      <span className="toggle-row toggle-c" />
      <span className="lock-card">TLS</span>
      <span className="mini-pill config-runbook">runbook</span>
    </>
  );
}
