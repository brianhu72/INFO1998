const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

app.get("/api/opportunities", async (req, res) => {
  try {
    const { data } = await axios.get("https://uwtc.org/volunteer/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });


    const $ = cheerio.load(data);
    const opportunities = [];

    // Opportunities are h2 headings followed by p tags inside the "Volunteer Opportunity List" section.
    let listSection = null;
    $(".et_pb_text_inner").each((_, section) => {
      if ($(section).find("h1").text().includes("Volunteer Opportunity List")) {
        listSection = section;
      }
    });

    if (!listSection) return res.json({ opportunities });

    $(listSection).find("h2").each((_, h2) => {
        const title = $(h2).text().trim();
        if (!title) return;

        // Collect all <p> siblings after this h2 until the next h2
        const descParts = [];
        let link = null;
        let node = $(h2).next();
        while (node.length && !node.is("h2")) {
          if (node.is("p")) {
            const text = node.text().trim();
            if (text) descParts.push(text);
            if (!link) link = node.find("a[href]").attr("href") || null;
          }
          node = node.next();
        }

        opportunities.push({
          title,
          description: descParts.join(" "),
          url: link,
        });
    });

    res.json({ opportunities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));