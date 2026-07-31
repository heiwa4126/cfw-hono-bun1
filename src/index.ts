import { Hono } from "hono";
import { cors } from "hono/cors";

// const app = new Hono();
const app = new Hono().basePath("/hello");
// workers の "Custom Domains and Routes" で
// https://api.<your-domain>/hello/* でルーティングするようにしたいので1段階層下げている

const corsOrigin = (origin: string): string | null => {
	if (!origin) return null;

	try {
		const url = new URL(origin);
		const host = url.hostname.toLowerCase();

		if (host === "localhost" || host === "127.0.0.1") return origin;
		if (host === "pages.dev" || host.endsWith(".pages.dev")) return origin;

		return null;
	} catch {
		return null;
	}
};

app.use("*", cors({ origin: corsOrigin }));

app
	.get("/", (c) => {
		// "GET /" は作るべきではなかった...
		return c.text("Hello Hono!");
	})
	.get("/hello", (c) => {
		return c.json({ message: "Hello Hono!", timestamp: new Date().toISOString() });
	});

export default app;
