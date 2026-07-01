import type { BrowserWorker } from "@cloudflare/puppeteer";

declare global {
  interface CloudflareEnv {
    BROWSER?: BrowserWorker;
  }
}

export {};
