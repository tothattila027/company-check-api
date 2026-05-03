const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/company-check", async (req, res) => {
  const cui = (req.query.cui || "").replace(/RO/gi, "").replace(/\D/g, "");

  if (!cui) return res.json({ valid: false });

  try {
    const response = await fetch(`https://www.firmeapi.ro/api/v1/firma/${cui}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        Accept: "application/json"
      }
    });

    const result = await response.json();
    const firma = result.data;

    if (!response.ok || !result.success || !firma) {
      return res.json({ valid: false, raw: result });
    }

    res.json({
      valid: true,
      company_name: firma.denumire || "",
      cui: firma.cui || cui,
      address: firma.adresa_completa || "",
      city: firma.adresa_sediu_social?.localitate || "",
      county: firma.adresa_sediu_social?.judet || "",
      postal_code: firma.adresa_sediu_social?.cod_postal || ""
    });

  } catch (e) {
    res.json({ valid: false, error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
