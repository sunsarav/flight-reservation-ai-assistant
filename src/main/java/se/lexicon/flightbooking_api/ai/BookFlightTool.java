package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.dto.BookFlightRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightBookingDTO;
import se.lexicon.flightbooking_api.service.FlightBookingService;

@Component
@RequiredArgsConstructor
@JsonClassDescription(
        "Books a flight for a passenger."
)
public class BookFlightTool {

    private final FlightBookingService flightBookingService;

    @Tool(
            name = "bookFlight",
            description = """
                    Books a flight for a passenger.

                    The flightId must be the numeric database ID of the flight.
                    The passenger name and passenger email are required.
                    """
    )
    public FlightBookingDTO execute(

            @JsonPropertyDescription(
                    "The numeric database ID of the flight to book."
            )
            Long flightId,

            @JsonPropertyDescription(
                    "The full name of the passenger."
            )
            String passengerName,

            @JsonPropertyDescription(
                    "The email address of the passenger."
            )
            String passengerEmail

    ) {

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