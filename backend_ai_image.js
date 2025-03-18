import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";

app.use(express.json());
app.use(cors({ origin: "*" })); 

app.post("/generate-image", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "❌ Prompt is required" });
    }

    try {
        const response = await axios.post(
            HF_MODEL_URL,
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer",
            }
        );

        const imageBase64 = Buffer.from(response.data, "binary").toString("base64");

        return res.json({ image: `data:image/png;base64,${imageBase64}` });
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return res.status(500).json({ error: "❌ Failed to generate image. Try again!" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
