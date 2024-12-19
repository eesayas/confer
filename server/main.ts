import { Server } from "./socket.ts";
import { extname, join } from "https://deno.land/std@0.197.0/path/mod.ts";

Deno.serve(async (req) => {
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = new Server(req);

    socket.on("JOIN", (room: string) => {
      socket.join(room);

      // Let peers know new one joined
      socket.to(room).send("NEW", socket.client);
    });

    socket.on("OFFER", (data) => {
      const { id, rtc } = data;
      socket.to(id).send("OFFER", {
        id: socket.client,
        rtc,
      });
    });

    socket.on("ANSWER", (data) => {
      const { id, rtc } = data;
      socket.to(id).send("ANSWER", {
        id: socket.client,
        rtc,
      });
    });

    socket.on("ICE", (data) => {
      const { id, ice } = data;
      socket.to(id).send("ICE", {
        id: socket.client,
        ice,
      });
    });

    socket.on("LEAVE", (room: string) => {
      socket.to(room).send("LEFT", socket.client);
    });
    return response;
  }

  // Serve static files for non-WebSocket requests
  const url = new URL(req.url);
  const filePath = join(
    "../dist",
    url.pathname === "/" ? "index.html" : url.pathname
  );

  try {
    const file = await Deno.readFile(filePath);
    const contentType = getContentType(extname(filePath));
    return new Response(file, { headers: { "Content-Type": contentType } });
  } catch {
    const fallback = await Deno.readFile(join("../dist", "index.html"));
    return new Response(fallback, { headers: { "Content-Type": "text/html" } });
  }
});

const getContentType = (ext: string): string => {
  return (
    {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    }[ext] || "application/octet-stream"
  );
};
