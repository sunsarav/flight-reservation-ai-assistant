package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.dto.AvailableFlightDTO;
import se.lexicon.flightbooking_api.service.FlightBookingService;

import java.util.List;

@Component
@JsonClassDescription(
        "Searches for all flights that are currently available for booking."
)
public class SearchAvailableFlightsTool {

    private final FlightBookingService flightBookingService;

    public SearchAvailableFlightsTool(
            FlightBookingService flightBookingService
    ) {
        this.flightBookingService = flightBookingService;
    }

    @Tool(
            name = "searchAvailableFlights",
            description = """
                    Returns ONLY flights whose current status is AVAILABLE.

                    Use this tool when the user wants to:
                    - see available flights
                    - find flights they can book
                    - search for bookable flights

                    Do NOT use this tool when the user asks for all flights,
                    including booked flights.
                    """
    )

    public List<AvailableFlightDTO> execute() {
        return flightBookingService.findAvailableFlights();
    }
}
