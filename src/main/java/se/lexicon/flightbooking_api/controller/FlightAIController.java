package se.lexicon.flightbooking_api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.lexicon.flightbooking_api.assistant.FlightAssistant;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000"
})
public class FlightAIController {

    private final FlightAssistant flightAssistant;

    @GetMapping("/chat")
    public String chat(
            @RequestParam String chatId,
            @RequestParam String message
    ) {

        return flightAssistant.chat(chatId, message);
    }
}