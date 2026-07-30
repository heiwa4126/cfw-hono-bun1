import { Hono } from "hono";

// const app = new Hono();
const app = new Hono().basePath("/hello");
// workers の "Custom Domains and Routes" で
// https://api.<your-domain>/hello/* でルーティングするようにしたいので1段階層下げている

app
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.get("/hello", (c) => {
		return c.json({ message: "Hello Hono!", timestamp: new Date().toISOString() });
	});

export default app;
