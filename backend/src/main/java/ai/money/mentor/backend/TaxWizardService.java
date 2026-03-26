package ai.money.mentor.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TaxWizardService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    
    private static final String SYSTEM_PROMPT = """
        You are an expert Indian tax advisor embedded in the Economic Times.
        PERSONA: Sharp, friendly, speaks like a knowledgeable friend — not a CA robot. Keep responses concise but complete. Use bullet points and comparisons where helpful.
        RULES:
        1. Always format monetary values with the ₹ symbol (e.g. ₹1.5L, ₹50,000).
        2. Be specific with Indian tax slabs for FY 2024-25.
        3. Mention CA verification for complex cases.
        4. If the user provides manual inputs (Gross salary, 80C, HRA, etc.), ALWAYS show an Old vs New tax regime comparison with their specific numbers.
        5. Always list deductions they're NOT using but could (80C, 80D, NPS 80CCD, HRA, LTA, etc).
        6. Provide tax-saving investment recommendations ranked by risk profile and liquidity.
        7. If they upload a Form 16 PDF or text, explicitly extract and analyze it: state Employer name, Gross Salary, TDS deducted, etc.
        
        FLOW: 
        If it's the start of the conversation, greet them and ask if they want to enter data manually or upload their Form 16 PDF.
        """;

    private final RestClient restClient;

    public TaxWizardService() {
        this.restClient = RestClient.create();
    }

    public String generateTaxAdvice(List<Map<String, Object>> history) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("YOUR_API_KEY_HERE")) {
            return "Server configuration issue: Gemini API Key is missing. Please add it to application.properties.";
        }

        // Construct the Gemini API payload
        Map<String, Object> payload = new HashMap<>();
        
        // Add System Instruction
        Map<String, Object> systemInstruction = new HashMap<>();
        systemInstruction.put("parts", List.of(Map.of("text", SYSTEM_PROMPT)));
        payload.put("systemInstruction", systemInstruction);

        // Map frontend history to Gemini history format
        List<Map<String, Object>> contents = new ArrayList<>();
        for (Map<String, Object> msg : history) {
            Map<String, Object> contentMsg = new HashMap<>();
            contentMsg.put("role", msg.get("role").equals("assistant") ? "model" : "user");
            
            List<Map<String, Object>> parts = new ArrayList<>();
            if (msg.containsKey("text")) {
                parts.add(Map.of("text", msg.get("text")));
            }
            if (msg.containsKey("inlineData")) {
                parts.add(Map.of("inlineData", msg.get("inlineData")));
            }
            
            contentMsg.put("parts", parts);
            contents.add(contentMsg);
        }
        payload.put("contents", contents);

        try {
            Map response = restClient.post()
                    .uri(GEMINI_API_URL + "?key=" + geminiApiKey)
                    .header("Content-Type", "application/json")
                    .body(payload)
                    .retrieve()
                    .body(Map.class);

            // Navigate the JSON response perfectly
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return "Sorry, I could not generate a response. Please try again.";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage());
        }
    }
}
