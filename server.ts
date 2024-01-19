import { Hono } from "https://deno.land/x/hono@v3.12.6/mod.ts";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";
import { encodeAscii85 } from "https://deno.land/std@0.212.0/encoding/ascii85.ts";

const app = new Hono();

app.post("/convert-pdf", async (c) => {
  const body = await c.req.arrayBuffer();
  const pdfDoc = await PDFDocument.load(body);
  const pdfBytes = await pdfDoc.save();
  const ascii85Encoded = encodeAscii85(new Uint8Array(pdfBytes));

  return c.text(ascii85Encoded);
});

app.get("/", (c) => c.text("Hello Hono!"));

Deno.serve({ port: 8787 }, app.fetch);
