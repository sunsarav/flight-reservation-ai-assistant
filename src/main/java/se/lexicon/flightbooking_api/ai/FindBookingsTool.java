package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.dto.FlightBookingDTO;
import se.lexicon.flightbooking_api.service.FlightBookingService;

import java.util.List;

@Component
@RequiredArgsConstructor
@JsonClassDescription(
        "Finds all flight bookings associated with a passenger email address."
)
public class FindBookingsTool {

    private final FlightBookingService flightBookingService;

    @JsonPropertyDescription(
            "The passenger email address used when making the booking."
    )
    public String email;

    public List<FlightBookingDTO> execute() {
        return flightBookingService.findBookingsByEmail(email);
    }
}