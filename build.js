// build.js
const fs = require('fs');
const path = require('path');

// 1. IMPORT YOUR DATA
// This line imports the giant adgroupContent object from your content.js file.
const { adgroupContent } = require('./content.js');

// 2. DEFINE FILE PATHS
const templatePath = path.join(__dirname, 'index.html');
const templateHtml = fs.readFileSync(templatePath, 'utf-8');
const outputDir = path.join(__dirname, 'public');

// Create the 'public' folder if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log('Starting build process...');

// 3. LOOP THROUGH EVERY AD GROUP
for (const adgroupName in adgroupContent) {
  const content = adgroupContent[adgroupName];
  let pageHtml = templateHtml;

  // 4. REPLACE ALL PLACEHOLDERS WITH DATA
  
  // --- Hero Section ---
  pageHtml = pageHtml.replace('%%TITLE%%', content.title);
  pageHtml = pageHtml.replace('%%HEADLINE%%', content.headline);
  pageHtml = pageHtml.replace('%%SUBHEADLINE%%', content.subheadline);
  pageHtml = pageHtml.replace('%%CTATEXT%%', content.ctaText);

  // --- Services Section ---
  pageHtml = pageHtml.replace('%%SERVICESHEADLINE%%', content.servicesHeadline);
  pageHtml = pageHtml.replace('%%SERVICESSUBHEADLINE%%', content.servicesSubheadline);

  // Loop through the 4 services for this ad group
  content.services.forEach((service, index) => {
    const i = index + 1; // Placeholder index is 1, 2, 3, 4
    pageHtml = pageHtml.replace(`%%SERVICE${i}_ICON%%`, service.icon);
    pageHtml = pageHtml.replace(`%%SERVICE${i}_TITLE%%`, service.title);
    pageHtml = pageHtml.replace(`%%SERVICE${i}_DESC%%`, service.description);
  });

  // --- FAQ Section ---
  pageHtml = pageHtml.replace('%%FAQHEADLINE%%', content.faqHeadline);

  // Loop through the 3 FAQs for this ad group
  content.faqs.forEach((faq, index) => {
    const i = index + 1; // Placeholder index is 1, 2, 3
    pageHtml = pageHtml.replace(`%%FAQ${i}_Q%%`, faq.question);
    pageHtml = pageHtml.replace(`%%FAQ${i}_A%%`, faq.answer);
  });
  const fileName = adgroupName === 'index' ? 'index.html' : `${adgroupName}.html`;
  // 5. SAVE THE FINAL HTML FILE
  const outputFilePath = path.join(outputDir, fileName);
  fs.writeFileSync(outputFilePath, pageHtml);
  console.log(`Generated: ${fileName}`);
}

console.log('Build process complete!');