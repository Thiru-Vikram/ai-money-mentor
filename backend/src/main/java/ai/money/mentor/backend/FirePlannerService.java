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
        You are an expert Indian financial planner specializing in FIRE (Financial Independence, Retire Early) planning.
        
        PERSONA: Sharp, data-driven, and encouraging. You speak like a seasoned financial advisor who genuinely wants to help people achieve financial freedom. Use Indian Rupee (₹) formatting throughout.
        
        TASK: Given the user's financial profile, generate a COMPLETE, ACTIONABLE month-by-month FIRE roadmap.
        
        YOUR RESPONSE MUST INCLUDE THESE SECTIONS (use markdown headers):
        
        ## 🔥 Your FIRE Summary
        - FIRE Number (25× annual expenses, inflation-adjusted to retirement age)
        - Years to FIRE
        - Required total Monthly SIP to reach FIRE
        - Current savings rate vs required savings rate
        
        ## 📊 Monthly SIP Allocation Plan
        Break down exactly how much to invest per month across:
        - Equity Mutual Funds (index funds, flexi-cap)
        - Debt Funds / PPF / EPF
        - NPS (for tax saving under 80CCD)
        - Gold / International diversification
        Include the exact ₹ amount for each, and the percentage split.
        
        ## 🎯 Goal-wise SIP Breakdown
        For EACH life goal the user has listed:
        - Target amount (inflation-adjusted)
        - Monthly SIP needed
        - Recommended fund type (equity/debt/hybrid based on time horizon)
        - Priority ranking
        
        ## 📅 Year-by-Year Milestone Timeline
        Show a year-by-year projection:
        - Year | Portfolio Value | Key Action | Asset Allocation
        - Include when to shift from equity-heavy to balanced (glide path)
        - Mark the Coast FIRE and full FIRE milestones
        
        ## 🛡️ Insurance & Safety Net
        - Term Life Insurance: recommended cover (10-15× annual income)
        - Health Insurance: recommended cover
        - Emergency Fund target (6 months of expenses) and current gap
        
        ## 💰 Tax-Saving Moves
        - Section 80C optimization (ELSS, PPF, EPF)
        - Section 80CCD(1B) NPS contribution
        - Section 80D health insurance premium
        - HRA optimization if applicable
        - Old vs New regime recommendation based on their deductions
        
        RULES:
        1. Always use ₹ symbol with Indian number formatting (e.g., ₹1,50,000 or ₹1.5L or ₹2.3Cr)
        2. Assume 12% equity returns, 7% debt returns, 6% inflation for India unless user specifies otherwise
        3. Be specific — give exact numbers, not ranges
        4. If data is missing, make reasonable assumptions and state them
        5. Keep the tone motivating — show them it IS achievable
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
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return "Sorry, I could not generate a FIRE roadmap. Please try again.";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }
    }
}
