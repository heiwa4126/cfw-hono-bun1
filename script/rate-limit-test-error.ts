/**
 * レート制限テスト（エラーになるパターン）
 *
 * Cloudflare のレート制限ルール: リクエスト 2 回/10 秒 を超えるとブロック
 * このスクリプトは 10 回を短い間隔（100-200ms）で連続送信してレート制限をトリガーします。
 */

const domain = process.env.DOMAIN_NAME;

if (!domain) {
	console.error("❌ Error: DOMAIN_NAME environment variable is not set");
	console.error("Please set DOMAIN_NAME in .env file or as an environment variable");
	process.exit(1);
}

const apiUrl = `https://api.${domain}/hello/hello`;
const requestCount = 10;
const intervalMs = 150; // 100-200ms 間隔

console.log("🚀 Rate Limit Test (Error Pattern)");
console.log(`📍 API URL: ${apiUrl}`);
console.log(`📊 Total Requests: ${requestCount}`);
console.log(`⏱️  Interval: ${intervalMs}ms`);
console.log(
	"📌 Expected: First 2 requests should succeed (200), rest may be blocked (429) or error\n"
);

type RequestResult = {
	requestNo: number;
	timestamp: string;
	status?: number;
	statusText?: string;
	message?: string;
	error?: string;
};

const results: RequestResult[] = [];

async function sendRequest(requestNo: number): Promise<void> {
	const timestamp = new Date().toISOString();

	try {
		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {
				"User-Agent": "Rate-Limit-Test/1.0"
			}
		});

		let message: string | undefined;
		try {
			const data = (await response.json()) as {
				message?: string;
				timestamp?: string;
			};
			message = data.message;
		} catch {
			// JSON parse error (likely HTML error page from rate limit)
			message = undefined;
		}

		const result: RequestResult = {
			requestNo,
			timestamp,
			status: response.status,
			statusText: response.statusText,
			message: message
		};

		results.push(result);

		// ステータスに応じたログ出力
		if (response.status === 200) {
			console.log(
				`✅ [${requestNo}] ${timestamp} | Status: ${response.status} | Message: ${message}`
			);
		} else if (response.status === 429) {
			console.log(
				`⚠️  [${requestNo}] ${timestamp} | Status: ${response.status} (Too Many Requests) | ${response.statusText}`
			);
		} else {
			console.log(
				`⛔ [${requestNo}] ${timestamp} | Status: ${response.status} | ${response.statusText}`
			);
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);

		const result: RequestResult = {
			requestNo,
			timestamp,
			error: errorMessage
		};

		results.push(result);

		console.log(`❌ [${requestNo}] ${timestamp} | Error: ${errorMessage}`);
	}
}

async function main(): Promise<void> {
	console.log("Starting requests...\n");

	for (let i = 1; i <= requestCount; i++) {
		await sendRequest(i);

		// 最後のリクエスト以外は待機
		if (i < requestCount) {
			await new Promise((resolve) => setTimeout(resolve, intervalMs));
		}
	}

	console.log("\n" + "=".repeat(60));
	console.log("📋 Summary");
	console.log("=".repeat(60));

	const successful = results.filter((r) => r.status === 200).length;
	const rateLimited = results.filter((r) => r.status === 429).length;
	const errors = results.filter((r) => r.error).length;
	const other = results.filter((r) => r.status && r.status !== 200 && r.status !== 429).length;

	console.log(`✅ Success (200): ${successful}`);
	console.log(`⚠️  Rate Limited (429): ${rateLimited}`);
	console.log(`⛔ Other Errors: ${other}`);
	console.log(`❌ Network Errors: ${errors}`);
	console.log(`📊 Total: ${results.length}`);
}

main();

export {}; // IDEをだまくらかすために必要。これがないと警告だらけに
