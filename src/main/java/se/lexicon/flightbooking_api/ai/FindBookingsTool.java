package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
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

    @Tool(
            name = "findBookings",
            description = """
                    Finds all active flight bookings for a passenger.

                    The passenger email address is required.
                    """
    )
    public List<FlightBookingDTO> execute(

            @ToolParam(
                    description = "The passenger email address used when making the booking."
            )
            String email

    ) {

        return flightBookingService.findBookingsByEmail(email);
    }
}