package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.service.FlightBookingService;

@Component
@RequiredArgsConstructor
@JsonClassDescription(
        "Cancels a flight booking. Use this tool only when the flight ID and passenger email are known."
)
public class CancelFlightTool {

    private final FlightBookingService flightBookingService;

    @JsonPropertyDescription(
            "The ID of the flight booking to cancel."
    )
    public Long flightId;

    @JsonPropertyDescription(
            "The email address associated with the booking."
    )
    public String passengerEmail;

    public String execute() {

        flightBookingService.cancelFlight(
                flightId,
                passengerEmail
        );

        return "Flight booking cancelled successfully.";
    }
}