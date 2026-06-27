import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = process.cwd();
const port = Number(process.argv[2] || 8088);
const host = "127.0.0.1";
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

http.createServer((request, response) => {
  try {
    const parsed = new URL(request.url || "/", `http://${host}:${port}`);
    const pathname = parsed.pathname === "/" ? "/index.html" : parsed.pathname;
    const filePath = path.normalize(path.join(root, decodeURIComponent(pathname)));

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream"
      });
      response.end(data);
    });
  } catch (error) {
    response.writeHead(500);
    response.end(String(error));
  }
}).listen(port, host, () => {
  console.log(`VedaPath preview server: http://${host}:${port}/`);
});
