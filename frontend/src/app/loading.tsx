import React from "react";

export default function Loading() {
  return (
    <div className="ds-page flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="ds-body-sm text-muted-foreground animate-pulse">
          Loading KisanGPT...
        </p>
      </div>
    </div>
  );
}
