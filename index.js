const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/company-check", async (req, res) => {
  const cui = (req.query.cui || "")
    .replace(/RO/gi, "")
    .replace(/\D/g, "");

  if (!cui) {
    return res.json({
      valid: false,
      error: "missing_cui"
    });
  }

  try {
    const response = await fetch(
      `https://www.firmeapi.ro/api/free/firma/${cui}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.API_KEY,
          "Accept": "application/json"
        }
      }
    );

    const result = await response.json();

    if (!response.ok || !result || !result.data) {
      return res.json({
        valid: false,
        raw: result
      });
    }

    const firma = result.data;

    return res.json({
      valid: true,
      company_name: firma.denumire || "",
      cui: firma.cui || cui,
      address: firma.adresa_completa || "",
      city: firma.adresa_sediu_social?.localitate || firma.localitate || "",
      county: firma.adresa_sediu_social?.judet || firma.judet || "",
      postal_code: firma.adresa_sediu_social?.cod_postal || firma.cod_postal || "",
      status: firma.stare || ""
    });

  } catch (e) {
    return res.json({
      valid: false,
      error: e.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
