package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.service.FlightBookingService;

@Component
@RequiredArgsConstructor
@JsonClassDescription(
        "Cancels a flight booking for a passenger."
)
public class CancelFlightTool {

    private final FlightBookingService flightBookingService;

    @Tool(
            name = "cancelFlight",
            description = """
                    Cancels a booked flight.

                    The flightId must be the numeric database ID of the booked flight.
                    The passenger email must match the email used for the booking.
                    Both values are required.
                    """
    )
    public String execute(

            @ToolParam(
                    description = "The numeric database ID of the booked flight to cancel."
            )
            Long flightId,

            @ToolParam(
                    description = "The email address associated with the booking."
            )
            String passengerEmail

    ) {

        flightBookingService.cancelFlight(
                flightId,
                passengerEmail
        );

        return "Flight booking cancelled successfully.";
    }
}