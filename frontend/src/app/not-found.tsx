import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="ds-page flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="ds-icon-container-lg bg-primary/10 mx-auto">
          <span className="text-2xl font-bold text-primary">404</span>
        </div>
        <h1 className="ds-heading-lg">Page Not Found</h1>
        <p className="ds-body-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button size="sm">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
