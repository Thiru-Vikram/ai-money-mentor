package ai.money.mentor.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.*;

@Service
public class CouplesMoneyPlannerService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    private static final String SYSTEM_PROMPT = """
        You are an expert Indian financial advisor specializing in joint couple financial planning.
        Given two partners' financial data, generate exactly 3 cross-income optimization insights.
        
        IMPORTANT: Respond ONLY with a valid JSON array (no markdown, no code fences, just raw JSON).
        Each object in the array must have:
        - "category": string (e.g. "HRA Optimization", "NPS Strategy", "SIP Split for Tax Efficiency", "Insurance Optimization")
        - "impactLabel": string (e.g. "High Impact", "Retirement Boost", "Portfolio Optimization")
        - "impactType": one of "high", "retirement", "portfolio"
        - "insight": string (max 2 sentences, specific to Indian tax context)
        - "estimatedSaving": string or null (e.g. "₹40,000/yr")
        
        Rules:
        - Reference Indian tax sections (80C, 80D, 80CCD, 24b, HRA exemption etc.)
        - Consider both Old and New tax regimes
        - Be specific with ₹ amounts using Indian numbering (lakhs/crores)
        - Focus on cross-income optimization opportunities unique to couples
        """;

    private final RestClient restClient;

    public CouplesMoneyPlannerService() {
        this.restClient = RestClient.create();
    }

    public String generateInsights(String prompt) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("YOUR_API_KEY_HERE")) {
            return "[{\"category\":\"Configuration Error\",\"impactLabel\":\"Error\",\"impactType\":\"high\",\"insight\":\"Gemini API Key is missing from server configuration.\",\"estimatedSaving\":null}]";
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
        userMsg.put("parts", List.of(Map.of("text", prompt)));
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
            return "[{\"category\":\"Error\",\"impactLabel\":\"Error\",\"impactType\":\"high\",\"insight\":\"Could not generate insights. Please try again.\",\"estimatedSaving\":null}]";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }
    }
}
