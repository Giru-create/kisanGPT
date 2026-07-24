"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Grid } from "@/components/layout/Grid";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import { Tooltip } from "@/components/ui/Tooltip";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Dialog } from "@/components/ui/Dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { VisuallyHidden } from "@/components/accessibility/VisuallyHidden";
import { useTheme } from "@/store/themeStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [inputError, setInputError] = useState("");
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const handleInputValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    if (val && val.length < 3) {
      setInputError("Must be at least 3 characters");
    } else {
      setInputError("");
    }
  };

  return (
    <PageContainer
      title="KisanGPT Design System & Frontend Foundation"
      description="Production-grade, accessible, and responsive frontend foundation adhering to AGENTS.md and ARCHITECTURE.md specifications."
      action={
        <Badge variant="success" className="text-sm py-1 px-3">
          Status: Milestone 1 Active
        </Badge>
      }
    >
      <div className="space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Design System Foundation" },
          ]}
        />

        {/* Section 1: System Overview */}
        <section className="space-y-4">
          <Alert variant="info" title="Frontend Foundation Scope">
            This workspace contains exclusively the UI foundation layer (Design tokens, Theme system, Typography, Color system, Spacing grid, Reusable UI components, Layout primitives, Navigation & Accessibility foundations). Business features (Chat, Weather, Market, Disease Detection) are intentionally separated according to project roadmap.
          </Alert>
        </section>

        {/* Section 2: Typography System */}
        <section id="design-tokens-section" className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              1. Typography System
            </h2>
            <p className="text-sm text-muted-foreground">
              Scalable rem-based typographic hierarchy optimized for readability.
            </p>
          </div>

          <Card>
            <CardContent className="space-y-6 pt-6">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Heading 1 — 36px / 2.25rem</h1>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Heading 2 — 30px / 1.875rem</h2>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">Heading 3 — 24px / 1.5rem</h3>
              </div>
              <div>
                <h4 className="text-xl font-medium tracking-tight">Heading 4 — 20px / 1.25rem</h4>
              </div>
              <div>
                <p className="text-base text-foreground leading-relaxed">
                  Body Text (Base) — 16px / 1rem. High contrast ratio text designed for extreme readability across light and dark modes.
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Muted Text (Small) — 14px / 0.875rem. Secondary metadata and helper descriptive copy.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Color System Tokens */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              2. Color System Tokens (Active Mode: {resolvedTheme})
            </h2>
            <p className="text-sm text-muted-foreground">
              Tailored KisanGPT Agricultural Emerald, Harvest Amber, and Slate base colors.
            </p>
          </div>

          <Grid cols={4} gap={4}>
            <Card className="overflow-hidden">
              <div className="h-20 bg-primary flex items-center justify-center text-primary-foreground font-bold">
                Primary Emerald (#16a34a)
              </div>
              <CardContent className="p-3 text-xs">
                <span className="font-semibold block">Brand Primary</span>
                <span className="text-muted-foreground">Nature, Growth, Trust</span>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-20 bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                Secondary Amber (#f59e0b)
              </div>
              <CardContent className="p-3 text-xs">
                <span className="font-semibold block">Harvest Accent</span>
                <span className="text-muted-foreground">Sunlight, Crops, Yield</span>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-20 bg-accent text-accent-foreground flex items-center justify-center font-bold">
                Surface Accent
              </div>
              <CardContent className="p-3 text-xs">
                <span className="font-semibold block">Subtle Surface</span>
                <span className="text-muted-foreground">Contextual highlights</span>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-20 bg-destructive text-destructive-foreground flex items-center justify-center font-bold">
                Destructive Red
              </div>
              <CardContent className="p-3 text-xs">
                <span className="font-semibold block">Error / Danger</span>
                <span className="text-muted-foreground">WCAG High-contrast red</span>
              </CardContent>
            </Card>
          </Grid>
        </section>

        {/* Section 4: Reusable UI Components */}
        <section id="components-section" className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              3. Reusable UI Components
            </h2>
            <p className="text-sm text-muted-foreground">
              Atomic components with full keyboard focus and screen reader accessibility.
            </p>
          </div>

          <Grid cols={2} gap={6}>
            {/* Buttons Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Button Variants & States</CardTitle>
                <CardDescription>Primary, Secondary, Outline, Ghost, and Danger buttons.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" isLoading>Loading</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </CardContent>
            </Card>

            {/* Inputs Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Input Fields</CardTitle>
                <CardDescription>Accessible inputs with validation and label binding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Sample Input Field"
                  placeholder="Enter sample value..."
                  value={inputVal}
                  onChange={handleInputValidation}
                  errorMessage={inputError}
                  helperText={!inputError ? "Type at least 3 characters to validate" : undefined}
                />
              </CardContent>
            </Card>

            {/* Badges & Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Badges & Status Tags</CardTitle>
                <CardDescription>Semantic status indicators.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Avatars, Tooltips & Spinners */}
            <Card>
              <CardHeader>
                <CardTitle>Avatars, Spinners & Skeletons</CardTitle>
                <CardDescription>Loaders, tooltips, and fallback avatars.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-6">
                <Avatar fallback="KG" alt="KisanGPT User" size="md" />

                <Tooltip content="Accessible tooltip description">
                  <Badge variant="outline" className="cursor-help py-1 px-3">
                    Hover / Focus Me
                  </Badge>
                </Tooltip>

                <Spinner size="md" label="Loading data..." />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Interactive Modal Trigger */}
          <Card>
            <CardHeader>
              <CardTitle>Modal Dialog & Focus Trap</CardTitle>
              <CardDescription>
                Accessible overlay dialog with focus trapping and keyboard shortcuts (ESC key).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsDialogOpen(true)}>Open Modal Dialog</Button>
            </CardContent>
          </Card>

          {/* Table Component Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Accessible Data Table Primitive</CardTitle>
              <CardDescription>Structured tabbed layout for tabular data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Accessibility</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Button</TableCell>
                    <TableCell>UI Atomic</TableCell>
                    <TableCell>ARIA busy, focus ring, role=button</TableCell>
                    <TableCell><Badge variant="success">Verified</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Dialog</TableCell>
                    <TableCell>UI Overlay</TableCell>
                    <TableCell>FocusTrap, ESC close, aria-modal</TableCell>
                    <TableCell><Badge variant="success">Verified</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Input</TableCell>
                    <TableCell>Form Control</TableCell>
                    <TableCell>aria-invalid, label id binding</TableCell>
                    <TableCell><Badge variant="success">Verified</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: Accessibility Foundation */}
        <section id="accessibility-section" className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              4. Accessibility Foundation Verification (WCAG 2.1 AA)
            </h2>
            <p className="text-sm text-muted-foreground">
              Built-in features protecting users with assistive technologies.
            </p>
          </div>

          <Grid cols={3} gap={4}>
            <Alert variant="success" title="Keyboard Navigation">
              Full focus rings (`ring-2 ring-ring ring-offset-2`), logical TAB navigation order, and ESC modal dismissal.
            </Alert>

            <Alert variant="success" title="Screen Reader Support">
              Skip to main content link, dynamic live-region announcer (`a11y-live-region`), and `sr-only` utilities.
            </Alert>

            <Alert variant="success" title="Reduced Motion Preference">
              System preference detected: <strong>{prefersReducedMotion ? "Reduced Motion Active" : "Standard Animations"}</strong>.
            </Alert>
          </Grid>
        </section>
      </div>

      {/* Interactive Dialog Modal */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Foundation Modal Dialog"
        description="This modal demonstrates focus trapping, background dimming, and ESC key closure."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            Keyboard focus is trapped inside this modal while open. Pressing <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">ESC</kbd> or clicking outside will dismiss it safely.
          </p>
          <Input label="Modal Input Test" placeholder="Focus will cycle between controls" />
        </div>
      </Dialog>

      <VisuallyHidden>KisanGPT Accessible Screen Reader Announcement Region</VisuallyHidden>
    </PageContainer>
  );
}
