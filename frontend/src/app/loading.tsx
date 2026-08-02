import React from "react";

export default function Loading() {
  return (
    <div className="ds-page flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="ds-thinking-dot" />
          <span className="ds-thinking-dot" />
          <span className="ds-thinking-dot" />
        </div>
        <p className="ds-body-sm text-muted-foreground animate-pulse">
          Loading KisanGPT...
        </p>
      </div>
    </div>
  );
}
