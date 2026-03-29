package ai.money.mentor.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.*;

@Service
public class PortfolioXRayService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private static final String SYSTEM_PROMPT = """
        You are an expert Indian mutual fund portfolio analyst.
        Given a user's mutual fund holdings, provide a comprehensive portfolio analysis in markdown format.
        
        Your analysis MUST include:
        
        ## Portfolio Overview
        - Total estimated portfolio value
        - Number of unique funds
        - Key observations
        
        ## Asset Allocation Breakdown
        - Estimated allocation across Large Cap, Mid Cap, Small Cap, Debt, International, Gold
        - Whether the allocation is appropriate for the user
        
        ## Fund Overlap Analysis
        - Identify stocks that appear across multiple funds
        - Calculate approximate overlap percentage
        - Flag concentrated positions
        
        ## Expense Ratio Audit
        - List each fund's approximate expense ratio
        - Flag high-cost funds (>1% ER)
        - Calculate total annual expense drag in ₹
        
        ## Benchmark Comparison
        - Compare estimated portfolio XIRR vs Nifty 50
        - Category-wise performance assessment
        
        ## AI Rebalancing Recommendations
        - Specific, actionable recommendations with priority (Critical/High/Medium/Good)
        - Exact ₹ amounts and fund names
        - Estimated annual savings from changes
        
        Rules:
        - Use ₹ with Indian numbering (lakhs/crores)
        - Be specific — give exact numbers, not vague ranges
        - Reference actual popular Indian mutual funds and schemes
        - Keep the tone professional but accessible
        """;

    private final RestClient restClient;

    public PortfolioXRayService() {
        this.restClient = RestClient.create();
    }

    @SuppressWarnings("unchecked")
    public String analyzePortfolio(String userPrompt) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("YOUR_API_KEY_HERE")) {
            return "Server configuration issue: Gemini API Key is missing.";
        }

        Map<String, Object> payload = new HashMap<>();

        Map<String, Object> systemInstruction = new HashMap<>();
        systemInstruction.put("parts", List.of(Map.of("text", SYSTEM_PROMPT)));
        payload.put("systemInstruction", systemInstruction);

        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", List.of(Map.of("text", userPrompt)));
        contents.add(userContent);
        payload.put("contents", contents);

        try {
            Map<String, Object> response = restClient.post()
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
                }
            }
            return "Sorry, I could not analyze the portfolio. Please try again.";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }
    }
}
