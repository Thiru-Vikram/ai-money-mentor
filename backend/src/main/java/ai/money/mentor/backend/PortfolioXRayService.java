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
        Given a CAMS or KFintech mutual fund statement (as a PDF or image), extract ALL fund holdings
        and provide a comprehensive portfolio X-Ray as a SINGLE JSON object.

        If the user provides text-based holdings instead of a document, still analyze and return JSON.

        The JSON MUST follow this exact structure:
        {
          "portfolioValue": "₹12.5L",
          "totalFunds": "6",
          "estimatedXIRR": "14.2%",
          "expenseDrag": "₹8,400/yr",
          "allocation": [
            { "category": "Large Cap", "percentage": "45%", "value": "₹5.6L" },
            { "category": "Mid Cap", "percentage": "25%", "value": "₹3.1L" },
            { "category": "Small Cap", "percentage": "15%", "value": "₹1.9L" },
            { "category": "Debt", "percentage": "10%", "value": "₹1.25L" },
            { "category": "International", "percentage": "5%", "value": "₹62,500" }
          ],
          "funds": [
            {
              "name": "Fund Name",
              "category": "Large Cap",
              "currentValue": "₹3L",
              "expenseRatio": "0.35%",
              "rating": "Good",
              "remark": "Low cost index fund, keep"
            }
          ],
          "overlap": [
            { "stock": "HDFC Bank", "funds": "3 funds", "exposure": "8.5%", "risk": "HIGH" },
            { "stock": "Infosys", "funds": "2 funds", "exposure": "5.2%", "risk": "MEDIUM" }
          ],
          "benchmarkComparison": {
            "portfolioReturn": "14.2%",
            "nifty50Return": "12.8%",
            "alpha": "+1.4%",
            "verdict": "Outperforming Nifty 50 by 1.4%"
          },
          "rebalancing": [
            { "action": "SELL", "fund": "Fund Name", "reason": "High overlap + expensive ER", "priority": "Critical", "amount": "₹1.5L" },
            { "action": "BUY", "fund": "Replacement Fund", "reason": "Lower cost, better category exposure", "priority": "High", "amount": "₹1.5L" }
          ],
          "annualSavings": "₹4,200",
          "healthScore": "72/100",
          "summary": "Your portfolio is equity-heavy with moderate overlap. 2 funds need replacement to reduce costs."
        }

        RULES:
        1. Return ONLY the JSON object — no markdown, no code fences, no explanation
        2. Use ₹ with Indian formatting (₹1,50,000 or ₹1.5L or ₹2.3Cr)
        3. Extract EVERY fund from the uploaded statement
        4. Calculate realistic XIRR based on fund categories and market conditions
        5. Keep text fields SHORT (1 line max) — this is for card UI display
        6. Rate each fund: Good, Average, or Poor
        7. Identify ALL overlapping stocks across funds
        8. Prioritize rebalancing actions by impact: Critical > High > Medium
        9. If you cannot extract exact values, make reasonable estimates and note them
        """;

    private final RestClient restClient;

    public PortfolioXRayService() {
        this.restClient = RestClient.create();
    }

    @SuppressWarnings("unchecked")
    public String analyzePortfolio(String userText, Map<String, Object> inlineData) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("YOUR_API_KEY_HERE")) {
            return "{\"error\": \"Server configuration issue: Gemini API Key is missing.\"}";
        }

        Map<String, Object> payload = new HashMap<>();

        // System instruction
        Map<String, Object> systemInstruction = new HashMap<>();
        systemInstruction.put("parts", List.of(Map.of("text", SYSTEM_PROMPT)));
        payload.put("systemInstruction", systemInstruction);

        // User content with text + optional file
        List<Map<String, Object>> parts = new ArrayList<>();

        if (userText != null && !userText.isBlank()) {
            parts.add(Map.of("text", userText));
        }

        if (inlineData != null && inlineData.containsKey("data")) {
            parts.add(Map.of("inlineData", inlineData));
        }

        if (parts.isEmpty()) {
            parts.add(Map.of("text", "Analyze this mutual fund portfolio."));
        }

        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", parts);

        payload.put("contents", List.of(userContent));

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
                        List<Map<String, Object>> responseParts = (List<Map<String, Object>>) content.get("parts");
                        if (responseParts != null && !responseParts.isEmpty()) {
                            return (String) responseParts.get(0).get("text");
                        }
                    }
                }
            }
            return "{\"error\": \"Could not analyze the portfolio. Please try again.\"}";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }
    }
}
