package ai.money.mentor.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FirePlannerService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private static final String SYSTEM_PROMPT = """
        You are an expert Indian financial planner specializing in FIRE planning.
        Given the user's financial profile, return a FIRE roadmap as a SINGLE JSON object (no markdown, no code fences).

        The JSON MUST follow this exact structure:
        {
          "fireNumber": "₹X.XX Cr",
          "yearsToFire": "17 years",
          "requiredMonthlySip": "₹85,000",
          "currentSavingsRate": "40%",
          "requiredSavingsRate": "60%",
          "sipAllocation": [
            { "category": "Equity Index Funds", "amount": "₹40,000", "percentage": "47%", "recommendation": "Nifty 50 + Nifty Next 50 split" },
            { "category": "Flexi Cap / Mid Cap", "amount": "₹20,000", "percentage": "24%", "recommendation": "Parag Parikh or Mirae Asset" },
            { "category": "Debt / PPF / EPF", "amount": "₹15,000", "percentage": "18%", "recommendation": "PPF maxout + short duration fund" },
            { "category": "NPS (80CCD)", "amount": "₹4,167", "percentage": "5%", "recommendation": "₹50K/yr for extra 80CCD(1B) deduction" },
            { "category": "Gold / International", "amount": "₹5,833", "percentage": "7%", "recommendation": "SGBs or Motilal Nasdaq 100" }
          ],
          "goals": [
            { "name": "Goal Name", "target": "₹XX L", "monthlySlip": "₹X,XXX", "fundType": "Equity/Debt/Hybrid", "timelineYears": "7" }
          ],
          "milestones": [
            { "year": "2026", "portfolioValue": "₹30L", "action": "Max out 80C + start NPS", "allocation": "85% Equity / 15% Debt" },
            { "year": "2030", "portfolioValue": "₹1.2Cr", "action": "Coast FIRE reached", "allocation": "75% Equity / 25% Debt" }
          ],
          "insurance": {
            "termLife": { "recommended": "₹2 Cr", "note": "15x annual income" },
            "health": { "recommended": "₹25L", "note": "Family floater with super top-up" },
            "emergencyFund": { "target": "₹3L", "currentGap": "₹1.5L", "note": "6 months of expenses" }
          },
          "taxMoves": [
            { "section": "80C", "action": "ELSS + PPF + EPF", "saving": "₹46,800" },
            { "section": "80CCD(1B)", "action": "NPS contribution", "saving": "₹15,600" },
            { "section": "80D", "action": "Health insurance premium", "saving": "₹7,800" }
          ],
          "regimeRecommendation": "Old Regime",
          "fireImpact": "You can achieve FIRE by age 45 with disciplined investing."
        }

        RULES:
        1. Return ONLY the JSON object — no markdown, no explanation, no code fences
        2. Use ₹ with Indian formatting (₹1,50,000 or ₹1.5L or ₹2.3Cr)
        3. Assume 12% equity returns, 7% debt returns, 6% inflation unless specified
        4. Be specific with exact numbers
        5. Keep text fields SHORT (1 line max) — this is for card UI display
        6. Include 4-8 milestones in the timeline
        7. Adapt all values to the user's actual financial data
        """;

    private final RestClient restClient;

    public FirePlannerService() {
        this.restClient = RestClient.create();
    }

    public String generateFirePlan(Map<String, Object> userProfile) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("YOUR_API_KEY_HERE")) {
            return "Server configuration issue: Gemini API Key is missing. Please add it to application.properties.";
        }

        // Build natural language prompt from user profile
        StringBuilder userPrompt = new StringBuilder();
        userPrompt.append("Here is my financial profile. Please create my complete FIRE roadmap:\n\n");
        userPrompt.append("**Personal Info:**\n");
        userPrompt.append("- Current Age: ").append(userProfile.getOrDefault("currentAge", "Not provided")).append("\n");
        userPrompt.append("- Target Retirement Age: ").append(userProfile.getOrDefault("retirementAge", "Not provided")).append("\n\n");

        userPrompt.append("**Income & Expenses:**\n");
        userPrompt.append("- Monthly Income: ₹").append(userProfile.getOrDefault("monthlyIncome", "Not provided")).append("\n");
        userPrompt.append("- Monthly Expenses: ₹").append(userProfile.getOrDefault("monthlyExpenses", "Not provided")).append("\n");
        userPrompt.append("- Annual Bonus: ₹").append(userProfile.getOrDefault("annualBonus", "0")).append("\n\n");

        userPrompt.append("**Existing Investments:**\n");
        userPrompt.append("- Current Savings/Investments: ₹").append(userProfile.getOrDefault("currentSavings", "0")).append("\n");
        userPrompt.append("- Existing Monthly SIPs: ₹").append(userProfile.getOrDefault("existingSips", "0")).append("\n");
        userPrompt.append("- PPF/EPF Balance: ₹").append(userProfile.getOrDefault("ppfEpfBalance", "0")).append("\n");
        userPrompt.append("- Emergency Fund: ₹").append(userProfile.getOrDefault("emergencyFund", "0")).append("\n\n");

        // Parse life goals
        Object goalsObj = userProfile.get("lifeGoals");
        if (goalsObj instanceof List) {
            List<Map<String, Object>> goals = (List<Map<String, Object>>) goalsObj;
            if (!goals.isEmpty()) {
                userPrompt.append("**Life Goals:**\n");
                for (Map<String, Object> goal : goals) {
                    userPrompt.append("- ").append(goal.getOrDefault("name", "Goal"));
                    userPrompt.append(" in ").append(goal.getOrDefault("years", "?")).append(" years");
                    userPrompt.append(" — Target: ₹").append(goal.getOrDefault("amount", "?")).append("\n");
                }
            }
        }

        // Construct the Gemini API payload
        Map<String, Object> payload = new HashMap<>();

        // System instruction
        Map<String, Object> systemInstruction = new HashMap<>();
        systemInstruction.put("parts", List.of(Map.of("text", SYSTEM_PROMPT)));
        payload.put("systemInstruction", systemInstruction);

        // User content
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", List.of(Map.of("text", userPrompt.toString())));
        contents.add(userContent);
        payload.put("contents", contents);

        try {
            Map response = restClient.post()
                    .uri(GEMINI_API_URL + "?key=" + geminiApiKey)
                    .header("Content-Type", "application/json")
                    .body(payload)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                    // Check if blocked by safety filters
                    Object finishReason = candidates.get(0).get("finishReason");
                    if ("SAFETY".equals(finishReason)) {
                        return "The AI could not generate a response due to content safety filters. Please try rephrasing your goals.";
                    }
                }
            }
            // Check for API error messages
            if (response != null && response.containsKey("error")) {
                Map<String, Object> error = (Map<String, Object>) response.get("error");
                return "Gemini API error: " + error.getOrDefault("message", "Unknown error. Please check your API key.");
            }
            return "Sorry, I could not generate a FIRE roadmap. Please try again.";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }
    }
}
