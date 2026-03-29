package ai.money.mentor.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.*;

@Service
public class HealthScoreService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private static final String SYSTEM_PROMPT = """
        You are an expert Indian financial health analyst embedded in the Economic Times platform.
        Given a user's financial data from their health assessment quiz, analyze their financial health across 6 dimensions and provide a comprehensive report.

        IMPORTANT: Respond ONLY with valid JSON (no markdown, no code fences, just raw JSON) matching this exact structure:
        {
          "overall": 63,
          "overallLabel": "Needs Attention",
          "dimensions": [
            { "label": "Emergency Fund", "dimension": "Emergency", "value": 72, "color": "#10B981", "desc": "3.6 months of expenses covered. Aim for 6 months." },
            { "label": "Insurance Coverage", "dimension": "Insurance", "value": 58, "color": "#F59E0B", "desc": "Life cover gap: ₹48L based on dependents." },
            { "label": "Investment Diversification", "dimension": "Diversification", "value": 81, "color": "#10B981", "desc": "Well spread across asset classes." },
            { "label": "Debt Health", "dimension": "Debt Health", "value": 65, "color": "#10B981", "desc": "EMI-to-income ratio is manageable." },
            { "label": "Tax Efficiency", "dimension": "Tax Efficiency", "value": 43, "color": "#EF4444", "desc": "₹54,000 in deductions missed." },
            { "label": "Retirement Readiness", "dimension": "Retirement", "value": 56, "color": "#F59E0B", "desc": "FIRE gap: ₹82L at age 60." }
          ],
          "recommendations": [
            {
              "priority": "Critical",
              "color": "text-red-600 bg-red-50 border-red-200",
              "title": "Action title here",
              "detail": "Detailed explanation with ₹ amounts"
            },
            {
              "priority": "High",
              "color": "text-amber-600 bg-amber-50 border-amber-200",
              "title": "Action title here",
              "detail": "Detailed explanation"
            },
            {
              "priority": "Medium",
              "color": "text-blue-600 bg-blue-50 border-blue-200",
              "title": "Action title here",
              "detail": "Detailed explanation"
            },
            {
              "priority": "Good",
              "color": "text-green-600 bg-green-50 border-green-200",
              "title": "Positive observation",
              "detail": "What's going well"
            }
          ],
          "biggestOpportunity": "Tax Efficiency (+₹54,000/yr)"
        }

        Rules:
        - Score each dimension 0-100 based on the actual data provided
        - color should be "#10B981" for scores >= 70, "#F59E0B" for 50-69, "#EF4444" for below 50
        - overallLabel should be "Excellent" for >= 80, "Good" for >= 70, "Needs Attention" for >= 50, "Critical" for below 50
        - All amounts in Indian Rupees with Indian numbering (lakhs/crores)
        - Reference Indian tax sections (80C, 80D, 80CCD, 24b, etc.)
        - Be specific with ₹ amounts, not vague
        - Provide exactly 4 recommendations sorted by priority
        - Base analysis entirely on the user's actual financial data
        """;

    private final RestClient restClient;

    public HealthScoreService() {
        this.restClient = RestClient.create();
    }

    public String analyzeHealth(String userDataPrompt) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("YOUR_API_KEY_HERE")) {
            return "{\"error\": \"Gemini API Key is missing from server configuration.\"}";
        }

        Map<String, Object> payload = new HashMap<>();

        // System instruction
        Map<String, Object> systemInstruction = new HashMap<>();
        systemInstruction.put("parts", List.of(Map.of("text", SYSTEM_PROMPT)));
        payload.put("systemInstruction", systemInstruction);

        // User message
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("parts", List.of(Map.of("text", userDataPrompt)));
        contents.add(userMsg);
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
            return "{\"error\": \"Could not generate health analysis. Please try again.\"}";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }
    }
}
