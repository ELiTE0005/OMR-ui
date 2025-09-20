import React, { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LineKind = "normal" | "added" | "removed" | "comment" | "gap";

interface DiffLine {
  ln?: number | null;
  text: string;
  kind?: LineKind;
}

interface DiffBlock {
  fileTag: string; // e.g. "1/2 src/components/Canvas3D.tsx"
  added: number;   // e.g. 8
  removed: number; // e.g. 2
  lines: DiffLine[];
}

interface BulletItem {
  title: string;
  desc: string;
  diff: DiffBlock;
}

const baseDiff: DiffBlock = {
  fileTag: "1/2 src/components/Canvas3D.tsx",
  added: 8,
  removed: 2,
  lines: [
    { ln: null, text: "", kind: "gap" },
    { ln: 1, text: "import { Suspense } from 'react';", kind: "normal" },
    { ln: 2, text: "import { Canvas } from '@react-three/fiber';", kind: "normal" },
    { ln: 3, text: "import * as THREE from 'three';", kind: "added" },
    { ln: 4, text: "import { Leva } from 'leva';", kind: "normal" },
    { ln: 5, text: "import GameScene from '../scenes/GameScene';", kind: "normal" },
    { ln: null, text: "/* … */", kind: "comment" },
    { ln: 18, text: "right-click", kind: "normal" },
    { ln: 19, text: "gl={{", kind: "normal" },
    { ln: 20, text: "  antialias: false,", kind: "added" },
    { ln: 20, text: "  antialias: true,", kind: "removed" },
    { ln: 21, text: "  alpha: false,", kind: "normal" },
    { ln: 22, text: "  stencil: false,", kind: "normal" },
    { ln: 24, text: "  depth: false,", kind: "added" },
    { ln: 23, text: "  depth: true,", kind: "removed" },
    { ln: 25, text: "  powerPreference: 'high-performance',", kind: "normal" },
    { ln: 26, text: "  precision: 'mediump',", kind: "added" },
    { ln: 27, text: "}}", kind: "normal" },
  ],
};

const items: BulletItem[] = [
  {
    title: "Review agent edits",
    desc: "Make code changes directly in the terminal.",
    diff: baseDiff,
  },
  {
    title: "Steer in real-time",
    desc: "Guide the agent as it works.",
    diff: {
      ...baseDiff,
      added: 5,
      removed: 1,
      lines: [
        { ln: 1, text: "// Live steering options", kind: "comment" },
        { ln: 2, text: "const steering = createSteering({ smooth: true });", kind: "added" },
        { ln: 3, text: "agent.on('step', steering.apply);", kind: "normal" },
        { ln: 4, text: "agent.on('error', handleError);", kind: "normal" },
        { ln: 5, text: "// …", kind: "comment" },
      ],
    },
  },
  {
    title: "Set your own rules",
    desc: "Customize Cursor's work with rules, AGENTS.md, and MCP.",
    diff: {
      ...baseDiff,
      added: 3,
      removed: 0,
      lines: [
        { ln: 1, text: "// AGENTS.md", kind: "comment" },
        { ln: 2, text: "- Use mediump precision for performance", kind: "added" },
        { ln: 3, text: "- Prefer high-performance power preference", kind: "added" },
        { ln: 4, text: "- Disable antialias for memory-bound scenes", kind: "added" },
      ],
    },
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-white/70 text-zinc-800 border-zinc-200 dark:bg-zinc-800/70 dark:text-zinc-100 dark:border-zinc-700">
      {children}
    </span>
  );
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0 },
};

function CodeDiff({ diff }: { diff: DiffBlock }) {
  const lineStyles: Record<LineKind, string> = useMemo(
    () => ({
      normal: "",
      added: "bg-emerald-500/10",
      removed: "bg-rose-500/10",
      comment: "text-zinc-500 italic",
      gap: "opacity-0 select-none h-3",
    }),
    []
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800">
        <div className="truncate text-zinc-700 dark:text-zinc-200">
          <span className="mr-2 inline-block rounded bg-zinc-100 px-2 py-0.5 font-mono text-[11px] dark:text-white text-black tracking-tight dark:bg-zinc-800">
            {diff.fileTag}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge>+{diff.added}</Badge>
          <Badge>-{diff.removed}</Badge>
        </div>
      </div>

      {/* Body */}
      <motion.div
        className="grid grid-cols-[auto_1fr] gap-x-0.5 px-1 py-1 font-mono text-[12px] leading-relaxed text-zinc-800 dark:text-zinc-100"
        role="group"
        aria-label="Code diff for Canvas3D.tsx"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={diff.fileTag}
      >
        {diff.lines.map((l, i) => (
          <React.Fragment key={i}>
            <motion.div
              variants={lineVariants}
              className="select-none px-3 text-right text-zinc-400 dark:text-zinc-500"
            >
              {l.ln ?? ""}
            </motion.div>
            <motion.div
              variants={lineVariants}
              className={"whitespace-pre px-3 " + (l.kind ? lineStyles[l.kind] : "")}
            >
              {l.text}
            </motion.div>
          </React.Fragment>
        ))}
      </motion.div>

      {/* Footer / hint bar */}
      <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:bg-zinc-800">→</span>
          <span>Add a follow-up</span>
        </div>
        <div>
          <span className="font-medium">a</span> to keep · <span className="font-medium">z</span> to undo · <span className="font-medium">←</span> <span className="font-medium">→</span> to switch files
        </div>
      </div>
    </div>
  );
}

export function TerminalControlSectionAnimated() {
  const [active, setActive] = useState(0);

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(items.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(items.length - 1);
      }
    },
    []
  );

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-400/20 via-fuchsia-400/10 to-cyan-400/20 blur-3xl" />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Full control from your terminal.
        </h2>
      </div>

      <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Left: bullets */}
        <div className="relative">
          {/* Vertical rail */}
          <div aria-hidden className="absolute left-3 top-2 h-[168px] w-px bg-gradient-to-b from-zinc-300 to-transparent dark:from-zinc-700" />

          <ul
            className="space-y-3 pl-8"
            role="tablist"
            aria-label="Ways to control the agent"
            onKeyDown={onKey}
          >
            {items.map((it, i) => {
              const isActive = i === active;
              return (
                <li key={it.title} role="presentation" className="relative">
                  <button
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className={[
                      "group w-full rounded-xl border px-4 py-3 text-left transition will-change-transform",
                      isActive
                        ? "border-zinc-900 bg-zinc-900 text-zinc-50 shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                        : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 hover:dark:bg-zinc-900/70",
                    ].join(" ")}
                  >
                    {/* Animated active background (shared layout) */}
                    {isActive && (
                      <motion.span
                        layoutId="activeTabBg"
                        className="absolute inset-0 -z-10 rounded-xl ring-1 ring-black/5"
                        transition={{ type: "spring", bounce: 0.22, duration: 0.48 }}
                      />
                    )}

                    <div className="text-base font-medium">{it.title}</div>
                    <div className={"text-sm mt-0.5 " + (isActive ? "opacity-90" : "text-zinc-500 dark:text-zinc-400")}>{it.desc}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: code diff panel */}
        <div role="tabpanel" aria-live="polite" aria-label={`Preview: ${items[active].title}`}
          className="[&_div]:scrollbar-thin [&_div]:scrollbar-track-transparent [&_div]:scrollbar-thumb-zinc-300 dark:[&_div]:scrollbar-thumb-zinc-700">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-3xl border border-zinc-200 bg-zinc-900 text-zinc-50 shadow-xl ring-1 ring-black/5 dark:border-zinc-800"
          >
            <div className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <CodeDiff key={items[active].title} diff={items[active].diff} />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}