import { Hono } from "https://deno.land/x/hono@v3.12.6/mod.ts";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";
import { encodeAscii85 } from "https://deno.land/std@0.212.0/encoding/ascii85.ts";

const app = new Hono();

app.use((c, next) => {
  c.res.headers.set("Access-Control-Allow-Origin", "*"); // Adjust as needed for security
  c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  c.res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return next();
});

app.post("/convert-pdf", async (c) => {
  const body = await c.req.arrayBuffer();
  const pdfDoc = await PDFDocument.load(body);
  const pdfBytes = await pdfDoc.save();
  const ascii85Encoded = encodeAscii85(new Uint8Array(pdfBytes));

  return c.text(ascii85Encoded);
});

app.options("/convert-pdf", (c) => {
  // An OPTIONS request is made as part of the CORS preflight process.
  return c.text("CORS preflight response");
});

app.get("/", (c) => c.text("Hello Hono!"));

Deno.serve({ port: 8787 }, app.fetch);
