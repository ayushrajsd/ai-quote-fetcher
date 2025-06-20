const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/quote", async (req, res) => {
  const category = req.query.category || "inspiration";
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({
      quote: `This is a mock ${category} quote. Add your OpenAI API key in .env to get real quotes.`,
    });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a wise quote generator." },
          { role: "user", content: `Give me a ${category} quote.` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiQuote = response.data.choices[0].message.content.trim();
    res.json({ quote: aiQuote });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
