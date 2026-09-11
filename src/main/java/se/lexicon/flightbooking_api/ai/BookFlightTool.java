package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.dto.BookFlightRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightBookingDTO;
import se.lexicon.flightbooking_api.service.FlightBookingService;

@Component
@RequiredArgsConstructor
@JsonClassDescription(
        "Books a flight for a passenger. "
                + "Only use this tool when the flight ID, passenger name, "
                + "and passenger email are known."
)
public class BookFlightTool {

    private final FlightBookingService flightBookingService;

    @JsonPropertyDescription(
            "The ID of the flight the passenger wants to book."
    )
    public Long flightId;

    @JsonPropertyDescription(
            "The full name of the passenger."
    )
    public String passengerName;

    @JsonPropertyDescription(
            "The email address of the passenger."
    )
    public String passengerEmail;

    public FlightBookingDTO execute() {

        BookFlightRequestDTO request =
                new BookFlightRequestDTO(
                        passengerName,
                        passengerEmail
                );

        return flightBookingService.bookFlight(
                flightId,
                request
        );
    }
}