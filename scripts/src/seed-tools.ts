import { db, toolsTable, adZonesTable } from "@workspace/db";

const tools = [
  {
    name: "Password Generator",
    slug: "password-generator",
    category: "utility",
    description: "Generate strong, secure passwords with custom length and character options",
    logicFunction: "generatePassword",
    keywords: ["password", "secure password", "random password", "strong password"],
    faqData: [
      { question: "How secure are the generated passwords?", answer: "Our passwords are generated using cryptographically secure random algorithms and never stored on our servers." },
      { question: "Can I customize the password length?", answer: "Yes! You can set any length from 4 to 128 characters and choose which character types to include." },
    ],
  },
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    category: "developer",
    description: "Format, validate and beautify your JSON code instantly",
    logicFunction: "formatJSON",
    keywords: ["json formatter", "json validator", "beautify json", "json parser"],
    faqData: [
      { question: "Does this work offline?", answer: "Yes! JSON formatting is done entirely in your browser — no data is sent to our servers." },
      { question: "What's the maximum JSON size?", answer: "You can format JSON files up to 10MB in size." },
    ],
  },
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    category: "utility",
    description: "Generate QR codes for URLs, text, contact info and more — download as PNG",
    logicFunction: "generateQRCode",
    keywords: ["qr code", "qr generator", "qr code maker", "barcode generator"],
    faqData: [
      { question: "What file formats can I download?", answer: "You can download your QR code as a high-quality PNG image." },
      { question: "Is there a limit to text length?", answer: "QR codes can hold up to 4,296 alphanumeric characters." },
    ],
  },
  {
    name: "Word Counter",
    slug: "word-counter",
    category: "writing",
    description: "Count words, characters, sentences and reading time for any text",
    logicFunction: "countWords",
    keywords: ["word counter", "character counter", "word count", "text analyzer"],
    faqData: [
      { question: "Does it count spaces?", answer: "The tool shows separate counts for characters with and without spaces." },
      { question: "How is reading time calculated?", answer: "Based on an average reading speed of 200-250 words per minute." },
    ],
  },
  {
    name: "Base64 Encoder/Decoder",
    slug: "base64-encoder",
    category: "developer",
    description: "Encode and decode Base64 strings quickly and easily",
    logicFunction: "encodeBase64",
    keywords: ["base64 encoder", "base64 decoder", "base64 converter"],
    faqData: [
      { question: "What is Base64 encoding?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format." },
    ],
  },
  {
    name: "URL Encoder/Decoder",
    slug: "url-encoder",
    category: "developer",
    description: "Encode and decode URL strings for safe web transmission",
    logicFunction: "encodeURL",
    keywords: ["url encoder", "url decoder", "percent encoding", "url escape"],
    faqData: [
      { question: "When do I need to URL encode?", answer: "When passing special characters in query strings or URL paths to avoid breaking the URL structure." },
    ],
  },
  {
    name: "GST Calculator",
    slug: "gst-calculator",
    category: "business",
    description: "Calculate GST (Goods and Services Tax) for any amount and tax rate",
    logicFunction: "calculateGST",
    keywords: ["gst calculator", "tax calculator", "goods and services tax"],
    faqData: [
      { question: "What GST rates are supported?", answer: "You can enter any GST rate from 0% to 100%." },
      { question: "Can I calculate GST exclusive and inclusive?", answer: "Yes! The tool calculates both GST-exclusive and GST-inclusive amounts." },
    ],
  },
  {
    name: "Age Calculator",
    slug: "age-calculator",
    category: "utility",
    description: "Calculate exact age in years, months, and days from a birthdate",
    logicFunction: "calculateAge",
    keywords: ["age calculator", "birthday calculator", "how old am i"],
    faqData: [
      { question: "How accurate is the age calculation?", answer: "The calculator gives your exact age in years, months, and days based on the current date." },
    ],
  },
  {
    name: "Unit Converter",
    slug: "unit-converter",
    category: "utility",
    description: "Convert between units of length, weight, temperature, volume, and more",
    logicFunction: "convertUnit",
    keywords: ["unit converter", "length converter", "temperature converter", "weight converter"],
    faqData: [
      { question: "What types of units can I convert?", answer: "Length, weight/mass, temperature, volume, area, speed, and time." },
    ],
  },
  {
    name: "Profit Margin Calculator",
    slug: "profit-margin-calculator",
    category: "business",
    description: "Calculate profit margin, markup percentage, and gross profit for your business",
    logicFunction: "calculateProfit",
    keywords: ["profit margin calculator", "markup calculator", "gross profit"],
    faqData: [
      { question: "What's the difference between margin and markup?", answer: "Margin is profit as a percentage of revenue. Markup is profit as a percentage of cost." },
    ],
  },
  {
    name: "Discount Calculator",
    slug: "discount-calculator",
    category: "business",
    description: "Calculate the final price after applying a discount percentage",
    logicFunction: "calculateDiscount",
    keywords: ["discount calculator", "sale price calculator", "percentage off"],
    faqData: [
      { question: "Can I calculate multiple discounts?", answer: "Yes, you can chain multiple discounts to find the final price." },
    ],
  },
  {
    name: "CSS Gradient Generator",
    slug: "gradient-generator",
    category: "design",
    description: "Create beautiful CSS gradients with a visual editor and copy the code",
    logicFunction: "generateGradient",
    keywords: ["gradient generator", "css gradient", "color gradient maker"],
    faqData: [
      { question: "What types of gradients are supported?", answer: "Linear, radial, and conic gradients with full color stop control." },
    ],
  },
  {
    name: "Color Picker",
    slug: "color-picker",
    category: "design",
    description: "Pick colors and convert between HEX, RGB, and HSL formats",
    logicFunction: "pickColor",
    keywords: ["color picker", "hex to rgb", "color converter", "color palette"],
    faqData: [
      { question: "What color formats are supported?", answer: "HEX, RGB, RGBA, HSL, and HSLA formats." },
    ],
  },
  {
    name: "Image Compressor",
    slug: "image-compressor",
    category: "image",
    description: "Compress images online without losing quality — reduce file size instantly",
    logicFunction: "compressImage",
    keywords: ["image compressor", "compress image", "reduce image size", "image optimizer"],
    faqData: [
      { question: "What image formats are supported?", answer: "JPEG, PNG, WebP, and GIF formats." },
      { question: "Is my image uploaded to your servers?", answer: "No! All compression happens directly in your browser using client-side processing." },
    ],
  },
  {
    name: "YouTube Title Generator",
    slug: "youtube-title-generator",
    category: "creator",
    description: "Generate catchy, SEO-optimized YouTube video titles for your content",
    logicFunction: "generateYouTubeTitle",
    keywords: ["youtube title generator", "video title ideas", "youtube seo"],
    faqData: [
      { question: "How many title variations are generated?", answer: "The tool generates 10+ title variations based on your topic and style." },
    ],
  },
  {
    name: "Instagram Hashtag Generator",
    slug: "instagram-hashtag-generator",
    category: "creator",
    description: "Generate relevant Instagram hashtags to boost your post reach and engagement",
    logicFunction: "generateHashtags",
    keywords: ["instagram hashtag generator", "hashtag finder", "instagram tags"],
    faqData: [
      { question: "How many hashtags are generated?", answer: "Up to 30 hashtags (Instagram's maximum) optimized for reach." },
    ],
  },
  {
    name: "Text Case Converter",
    slug: "text-case-converter",
    category: "writing",
    description: "Convert text to uppercase, lowercase, title case, camelCase, and more",
    logicFunction: "convertCase",
    keywords: ["text case converter", "uppercase converter", "title case", "camelcase"],
    faqData: [
      { question: "What case formats are available?", answer: "UPPER CASE, lower case, Title Case, camelCase, PascalCase, snake_case, and kebab-case." },
    ],
  },
  {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    category: "developer",
    description: "Generate Lorem Ipsum placeholder text for your designs and mockups",
    logicFunction: "generateLoremIpsum",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text"],
    faqData: [
      { question: "Can I choose the output format?", answer: "Yes — generate words, sentences, or full paragraphs." },
    ],
  },
  {
    name: "MD5 Hash Generator",
    slug: "md5-hash-generator",
    category: "developer",
    description: "Generate MD5 hashes from any text string instantly",
    logicFunction: "generateMD5",
    keywords: ["md5 hash", "md5 generator", "hash generator", "checksum"],
    faqData: [
      { question: "Is MD5 secure for passwords?", answer: "MD5 is NOT recommended for password hashing. Use bcrypt or argon2 instead." },
    ],
  },
  {
    name: "Binary Converter",
    slug: "binary-converter",
    category: "developer",
    description: "Convert between binary, decimal, hexadecimal, and octal number systems",
    logicFunction: "convertBinary",
    keywords: ["binary converter", "decimal to binary", "hex converter", "number system converter"],
    faqData: [
      { question: "What number bases are supported?", answer: "Binary (base 2), Octal (base 8), Decimal (base 10), and Hexadecimal (base 16)." },
    ],
  },
];

async function seed() {
  console.log("Seeding tools...");
  
  for (const tool of tools) {
    try {
      await db.insert(toolsTable).values(tool).onConflictDoNothing();
      console.log(`✓ ${tool.name}`);
    } catch (err) {
      console.log(`⚠ ${tool.name}: already exists or error`);
    }
  }
  
  console.log("Done seeding!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
