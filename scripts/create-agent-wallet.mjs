import algosdk from "algosdk";

const account = algosdk.generateAccount();

console.log("\n=== InferPay Agent TestNet Wallet ===\n");
console.log("Address:");
console.log(account.addr.toString());

console.log("\nRecovery phrase:");
console.log(algosdk.secretKeyToMnemonic(account.sk));

console.log("\nAVM_PRIVATE_KEY:");
console.log(Buffer.from(account.sk).toString("base64"));

console.log("\nKeep the recovery phrase and private key PRIVATE.\n");