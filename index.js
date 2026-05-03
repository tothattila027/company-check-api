const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/company-check", async (req, res) => {
  const cui = (req.query.cui || "").replace(/RO/gi, "").replace(/\D/g, "");

  if (!cui) {
    return res.json({ valid: false, error: "missing_cui" });
  }

  try {
    const response = await fetch(
      `https://api.firmenoi.ro/api/v1/companies/search?cui=${encodeURIComponent(cui)}`,
      {
        headers: {
          "X-API-Key": process.env.API_KEY,
          "Authorization": `Bearer ${process.env.API_KEY}`
        }
      }
    );

    const data = await response.json();

    const firma = data.firma || data.company || data.data || data;

    if (!response.ok || !firma || (!firma.denumire && !firma.name)) {
      return res.json({ valid: false, status: response.status, raw: data });
    }

    res.json({
      valid: true,
      company_name: firma.denumire || firma.name || "",
      cui: firma.cui || cui,
      address: firma.adresa || firma.address || "",
      city: firma.localitate || firma.city || "",
      county: firma.judet || firma.county || "",
      postal_code: firma.cod_postal || firma.postal_code || ""
    });

  } catch (e) {
    res.json({ valid: false, error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
