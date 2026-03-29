package ai.money.mentor.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PortfolioXRayController {

    private final PortfolioXRayService portfolioXRayService;

    public PortfolioXRayController(PortfolioXRayService portfolioXRayService) {
        this.portfolioXRayService = portfolioXRayService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, String>> analyzePortfolio(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");

        if (prompt == null || prompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Portfolio data is required"));
        }

        try {
            String aiResponse = portfolioXRayService.analyzePortfolio(prompt);
            return ResponseEntity.ok(Map.of("response", aiResponse));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to analyze portfolio: " + e.getMessage()));
        }
    }
}
