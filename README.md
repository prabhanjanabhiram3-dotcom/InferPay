
# InferPay

InferPay is a pay per use LLM inference router built using x402 and Algorand.

The idea is simple. A user sends a prompt and InferPay checks the task, complexity, budget and priority. It then selects a suitable model and the user pays only for that inference using x402.

Payments are made using USDC on Algorand TestNet through Pera Wallet.

## Why InferPay

Using different AI models usually means different API keys, accounts, credits and subscriptions.

InferPay tries to make this simpler.

The user sends a prompt, the router selects a model and x402 handles the payment before the inference is completed.

There is no subscription. Payment happens per request.

## How it works

```text
User enters prompt
        ↓
InferPay analyzes the request
        ↓
Router selects a suitable model
        ↓
API returns HTTP 402
        ↓
Pera Wallet opens
        ↓
User approves USDC payment
        ↓
GoPlausible verifies the payment
        ↓
Payment settles on Algorand
        ↓
Model runs the inference
        ↓
Response is returned
```

## What InferPay does

- Routes prompts based on task and complexity
- Considers budget and user priority
- Uses real LLM responses
- Uses x402 for pay per request payments
- Supports Pera Wallet
- Settles USDC payments on Algorand TestNet
- Stores inference and payment history
- Shows token usage and cost
- Stores the Algorand transaction ID
- Lets users verify transactions in Lora
- Supports x402 Bazaar discovery

## x402 inference endpoint

InferPay has a public paid API

```text
POST https://inferpay-api.onrender.com/api/inference
```

Example request

```json
{
  "prompt": "Explain x402 in simple terms",
  "priority": "balanced",
  "budget": 0.01
}
```

The inference costs

```text
$0.01 USDC
```

If there is no payment the API returns

```text
402 Payment Required
```

The x402 client then creates the payment and asks the user to approve it through Pera Wallet.

After the payment is verified the inference runs and the response is returned.

## x402 discovery

InferPay also supports x402 Bazaar discovery.

The 402 response contains Bazaar metadata about the inference API including the request format and example response.

InferPay can be discovered in the GoPlausible x402 TestNet resource catalog.

Public metadata is also available at

```text
https://inferpay-api.onrender.com/.well-known/x402
```

and

```text
https://inferpay-api.onrender.com/llms.txt
```

## Tech used

Frontend

```text
React
TypeScript
Vite
Tailwind CSS
```

Backend

```text
Node.js
Express
TypeScript
```

AI

```text
Google Gemini
Custom routing logic
```

Payments

```text
x402
Algorand
USDC
Pera Wallet
GoPlausible Facilitator
```

Deployment

```text
Render
GitHub
```

## Run locally

Clone the project

```bash
git clone https://github.com/prabhanjanabhiram3-dotcom/InferPay.git
cd InferPay
```

Install packages

```bash
npm install
```

Create a `.env` file and add the required API and payment configuration.

For local frontend development

```env
VITE_API_BASE_URL=http://localhost:3001
```

Start the backend

```bash
npm run server
```

Start the frontend in another terminal

```bash
npm run dev
```

## Demo flow

```text
Connect Pera Wallet
        ↓
Enter a prompt
        ↓
InferPay analyzes it
        ↓
Submit inference
        ↓
Approve the x402 payment
        ↓
Receive the AI response
        ↓
Open Transactions
        ↓
View the Algorand transaction in Lora
```

## Current status

InferPay currently works on Algorand TestNet.

The complete flow from HTTP 402 to wallet approval, payment settlement and AI response is working.

The inference API is publicly deployed and is also discoverable through the x402 Bazaar system.

## Next step

The next planned feature is MCP tool routing.

This would allow AI agents to discover external tools, pay for individual tool calls using x402 and use the result without needing separate subscriptions for every service.