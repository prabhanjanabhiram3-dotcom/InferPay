import dotenv from "dotenv";
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { toClientAvmSigner } from "@x402/avm";

dotenv.config();

const API_URL = "https://inferpay-api.onrender.com/api/inference";

const privateKey = process.env.AGENT_AVM_PRIVATE_KEY;

if (!privateKey) {
  throw new Error(
    "AGENT_AVM_PRIVATE_KEY is missing from your local .env file"
  );
}

const signer = toClientAvmSigner(privateKey);

const prompt =
  process.argv.slice(2).join(" ") ||
  "Explain how x402 helps AI agents pay for services.";

async function main() {
  console.log("\n=== InferPay Agent Demo ===\n");

  console.log("Agent wallet:");
  console.log(signer.address);

  console.log("\nTask:");
  console.log(prompt);

  console.log("\n1. Discovering paid inference resource...");
  console.log(API_URL);

  // First request only demonstrates that the resource is actually protected.
  const unpaidResponse = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      priority: "balanced",
      budget: 0.01,
    }),
  });

  console.log(`\n2. Initial server response: ${unpaidResponse.status}`);

  if (unpaidResponse.status !== 402) {
    console.log(
      "Expected HTTP 402 but received:",
      unpaidResponse.status
    );
    return;
  }

  console.log("Payment required ✅");
  console.log("Agent will now handle the x402 payment automatically.");

  const client = new x402Client();

  client.setSpendControls(false);

  client.register(
    "algorand:*",
    new ExactAvmScheme(signer)
  );

  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  console.log("\n3. Paying through x402...");

  const response = await fetchWithPayment(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      priority: "balanced",
      budget: 0.01,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Paid inference failed with HTTP ${response.status}`
    );
  }

  const data = await response.json();

  console.log("\n4. Payment accepted ✅");
  console.log("5. Inference completed ✅");

  const paymentHeader =
    response.headers.get("PAYMENT-RESPONSE");

  if (paymentHeader) {
    try {
      const decodedPayment = JSON.parse(
        Buffer.from(paymentHeader, "base64").toString("utf8")
      );

      console.log("\n=== x402 Settlement ===");
      console.log("Success:", decodedPayment.success);
      console.log("Network:", decodedPayment.network);
      console.log("Transaction:", decodedPayment.transaction);
      if (decodedPayment?.transaction && data?.inferenceId) {
  await fetch(
    `https://inferpay-api.onrender.com/api/inference/${data.inferenceId}/payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionId: decodedPayment.transaction,
        network: decodedPayment.network,
      }),
    }
  );
}

    } catch (error) {
      console.log(
        "\nPayment succeeded but settlement header could not be decoded."
      );
    }
  }

  console.log("\n=== InferPay Routing ===");

  if (data.routing) {
    console.log("Task:", data.routing.taskType);
    console.log("Complexity:", data.routing.complexity);
    console.log(
      "Router:",
      data.routing.selectedProvider?.name
    );
  }

  console.log("Model:", data.model);

  if (data.usage) {
    console.log("Input tokens:", data.usage.inputTokens);
    console.log("Output tokens:", data.usage.outputTokens);
    console.log("Total tokens:", data.usage.totalTokens);
  }

  console.log("\n=== AI Response ===\n");
  console.log(data.text);

  console.log("\n=== Agent Flow Complete ===\n");
}

main().catch((error) => {
  console.error("\nAgent demo failed:");
  console.error(error);
  process.exit(1);
});