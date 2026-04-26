const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Analyzes deep compatibility between two users using Gemini AI
 * @param {Object} user - Current user profile
 * @param {Object} candidate - Candidate profile
 * @returns {Object} { score, reason, tags }
 */
exports.analyzeCompatibility = async (user, candidate) => {
  try {
    const prompt = `
      You are an expert relationship counselor and matchmaker for a premium matrimonial site "PhirseShaadi".
      Analyze the compatibility between User A and User B based on their profile data.
      
      User A:
      - Bio: ${user.bio || "Not provided"}
      - Education: ${user.education} ${user.educationDetail || ""}
      - Occupation: ${user.occupation} at ${user.companyName || "Private"}
      - About Family: ${user.aboutFamily || "Not provided"}
      - Religion/Community: ${user.religion} / ${user.community || "Not provided"}
      
      User B:
      - Bio: ${candidate.bio || "Not provided"}
      - Education: ${candidate.education} ${candidate.educationDetail || ""}
      - Occupation: ${candidate.occupation} at ${candidate.companyName || "Private"}
      - About Family: ${candidate.aboutFamily || "Not provided"}
      - Religion/Community: ${candidate.religion} / ${candidate.community || "Not provided"}
      
      Task:
      1. Calculate a compatibility score (0-100) based on shared values, professional alignment, and personality traits inferred from their bios.
      2. Provide a 1-2 sentence "Match Reason" explaining why they are compatible.
      3. Provide 2-3 short "Compatibility Tags" (e.g., "Career Focused", "Family Oriented", "Nature Lovers").
      
      Return ONLY a JSON object in this format:
      {
        "score": number,
        "reason": "string",
        "tags": ["string", "string"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (sometimes AI wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { score: 50, reason: "Profiles show moderate overlap in lifestyle.", tags: ["New Match"] };
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error.message);
    return { score: 0, reason: "Deep analysis unavailable at the moment.", tags: [] };
  }
};

/**
 * Checks if a message contains obscured personal contact info
 * @param {string} text - The message text to check
 * @returns {Promise<boolean>} - True if it contains contact info
 */
exports.checkMessageSafety = async (text) => {
  try {
    const prompt = `
      You are a security filter for a matrimonial site.
      Check if the following message contains any personal contact information such as:
      - Phone numbers (even if written as words like "nine eight..." or with spaces/symbols)
      - Email addresses (even if written like "user at gmail dot com")
      - Social media handles (Instagram, Snapchat, etc.)
      - External payment links or IDs
      
      Message: "${text}"
      
      If the message contains ANY contact information or attempts to bypass security to share contact info, return "BLOCKED".
      Otherwise, return "SAFE".
      
      Return ONLY the word "BLOCKED" or "SAFE".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text().trim().toUpperCase();
    
    return resultText.includes("BLOCKED");
  } catch (error) {
    console.error("Gemini Safety Check Error:", error.message);
    return false; // Default to safe if AI fails to prevent blocking genuine messages
  }
};
