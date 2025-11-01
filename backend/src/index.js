import { config } from "dotenv";
import express from "express";
import { verify, settle } from "x402/facilitator";
import { PaymentRequirementsSchema, PaymentPayloadSchema, createConnectedClient, createSigner, SupportedEVMNetworks, } from "x402/types";
config();
const EVM_PRIVATE_KEY = process.env.EVM_PRIVATE_KEY || "";
const RPC_URL = process.env.RPC_URL || "";
if (!EVM_PRIVATE_KEY || !RPC_URL) {
    throw new Error("EVM_PRIVATE_KEY or RPC_URL is not set");
}
const x402Config = { rpcUrl: process.env.RPC_URL };
const app = express();
app.use(express.json());
app.get("/verify", async (req, res) => {
    res.json({
        endpoint: "/verify",
        description: "POST to verify x402 payments",
        body: {
            paymentPayload: "PaymentPayload",
            paymentRequirements: "PaymentRequirements",
        },
    });
});
app.post("/verify", async (req, res) => {
    console.log("Verify request received POST");
    try {
        console.log("Verify request received POST");
        const body = req.body;
        const paymentRequirements = PaymentRequirementsSchema.parse(body.paymentRequirements);
        const paymentPayload = PaymentPayloadSchema.parse(body.paymentPayload);
        let client;
        if (SupportedEVMNetworks.includes(paymentRequirements.network)) {
            client = createConnectedClient(paymentRequirements.network);
        }
        else {
            throw new Error("Unsupported network");
        }
        const valid = await verify(client, paymentPayload, paymentRequirements, x402Config);
        res.json(valid);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal x420 Request" });
    }
});
app.get("/settle", async (req, res) => {
    console.log("Settle request received");
    res.json({
        endpoint: "/settle",
        description: "POST to settle x402 payments",
        body: {
            paymentPayload: "PaymentPayload",
            paymentRequirements: "PaymentRequirements",
        },
    });
});
app.post("/settle", async (req, res) => {
    console.log("Settle request received");
    try {
        const body = req.body;
        const paymentPayload = PaymentPayloadSchema.parse(body.paymentPayload);
        const paymentRequirements = PaymentRequirementsSchema.parse(body.paymentRequirements);
        let signer;
        if (SupportedEVMNetworks.includes(paymentRequirements.network)) {
            signer = await createSigner(paymentRequirements.network, EVM_PRIVATE_KEY);
        }
        else {
            throw new Error("Unsupported network");
        }
        const settled = await settle(signer, paymentPayload, paymentRequirements, x402Config);
        res.json(settled);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal x420 Request" });
    }
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
