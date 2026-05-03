const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/company-check", async (req, res) => {
  const cui = req.query.cui;

  try {
    const response = await fetch(`https://api.firmeapi.ro/api/company/${cui}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`
      }
    });

    const data = await response.json();

    if (!data || !data.name) {
      return res.json({ valid: false });
    }

    res.json({
      valid: true,
      company_name: data.name,
      address: data.address,
      city: data.city,
      county: data.county,
      postal_code: data.postal_code
    });

  } catch (e) {
    res.json({ valid: false });
  }
});

app.listen(3000, () => console.log("Server running"));
