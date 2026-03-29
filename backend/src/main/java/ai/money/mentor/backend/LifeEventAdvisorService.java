package ai.money.mentor.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.*;

@Service
public class LifeEventAdvisorService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private static final String SYSTEM_PROMPT = """
        You are an expert Indian financial advisor embedded in Economic Times' Editorial Intelligence platform.
        You provide institutional-grade, SEBI-compliant financial advice for major life events.

        IMPORTANT: You must respond ONLY with valid JSON matching this exact structure (no markdown, no code fences, just raw JSON):
        {
          "headline": "Strategy for your [event description]",
          "confidence": 95,
          "taxImpact": {
            "estimatedLiability": "₹X,XX,XXX",
            "priority": "HIGH",
            "description": "Brief tax impact analysis (2-3 sentences)"
          },
          "immediateActions": [
            { "title": "Action title", "amount": "₹X,XX,XXX", "description": "Brief description" }
          ],
          "longTermAllocation": [
            { "title": "Investment name", "amount": "₹X,XX,XXX", "description": "Brief description" }
          ],
          "healthImpact": { "points": 12, "quarterData": [45, 52, 48, 55, 67] },
          "fireImpact": "Brief FIRE impact statement (1 sentence)",
          "checklist": [
            "Action item 1",
            "Action item 2",
            "Action item 3",
            "Action item 4"
          ]
        }

        Rules:
        - All amounts in Indian Rupees with Indian numbering (lakhs/crores)
        - Reference Indian tax sections (80C, 80D, 80CCD, 24b, etc.)
        - Consider both Old and New tax regimes
        - Be specific with numbers, not vague
        - immediateActions should have 3 items
        - longTermAllocation should have 3 items
        - checklist should have 4 items
        - healthImpact quarterData should be 5 numbers for Q1-Q4 + post-event
        - confidence should be 90-99
        """;

    private final RestClient restClient;

    public LifeEventAdvisorService() {
        this.restClient = RestClient.create();
    }

    public String generateAdvisory(String userPrompt) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("YOUR_API_KEY_HERE")) {
            return "{\"error\": \"Server configuration issue: Gemini API Key is missing.\"}";
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
        userMsg.put("parts", List.of(Map.of("text", userPrompt)));
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
            return "{\"error\": \"Could not generate advisory. Please try again.\"}";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }
    }
}
