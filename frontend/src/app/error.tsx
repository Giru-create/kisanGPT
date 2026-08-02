"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="ds-page flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="ds-icon-container-lg bg-destructive/10 mx-auto">
          <span className="text-2xl font-bold text-destructive">!</span>
        </div>
        <h1 className="ds-heading-lg">Something went wrong</h1>
        <p className="ds-body-sm text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset} size="sm">
          Try Again
        </Button>
      </div>
    </div>
  );
}
