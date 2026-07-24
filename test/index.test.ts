import { describe, expect, test } from "bun:test";
import app from "../src/index";
describe("src/index.ts", () => {
	test("GET / returns Hello Hono!", async () => {
		const res = await app.request("/");

		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello Hono!");
	});

	test("GET /hello returns message and ISO timestamp", async () => {
		const res = await app.request("/hello");

		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toContain("application/json");

		const body = (await res.json()) as { message: string; timestamp: string };
		expect(body.message).toBe("Hello Hono!");
		expect(typeof body.timestamp).toBe("string");
		expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
	});
});
