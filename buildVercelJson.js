const fs = require("fs");

const inputFile = "campaigns.csv";
const outputFile = "vercel.json";

// Read CSV file
const csvData = fs.readFileSync(inputFile, "utf8");

// Split into lines & remove empty ones
const lines = csvData
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(line => line && !line.startsWith("#")); // optional comment support

// Extract headers
const headers = lines.shift().split(",").map(h => h.trim().toLowerCase());

// Determine column indexes
const adgroupIdIndex = headers.indexOf("adgroupid");
const landingPageIndex = headers.indexOf("landing_page");

if (adgroupIdIndex === -1 || landingPageIndex === -1) {
  console.error("❌ CSV must contain 'adgroupid' and 'landing_page' columns.");
  process.exit(1);
}

const redirects = [];

// Loop through lines
for (const line of lines) {
  const cols = line.split(",");
  const agid = cols[adgroupIdIndex]?.trim();
  const destination = cols[landingPageIndex]?.trim();

  if (agid && destination) {
    redirects.push({
      source: "/redirect",
      has: [
        {
          type: "query",
          key: "agid",
          value: agid
        }
      ],
      destination,
      permanent: false // 302 redirect
    });
  }
}

// Write vercel.json
const vercelConfig = {
  cleanUrls: true,
  redirects
};

fs.writeFileSync(outputFile, JSON.stringify(vercelConfig, null, 2));

console.log(`✅ Generated ${outputFile} with ${redirects.length} redirects`);
