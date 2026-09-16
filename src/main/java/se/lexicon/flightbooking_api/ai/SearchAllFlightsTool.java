package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import se.lexicon.flightbooking_api.dto.FlightListDTO;
import se.lexicon.flightbooking_api.service.FlightBookingService;

import java.util.List;

@Component
@RequiredArgsConstructor
@JsonClassDescription(
        "Returns all flights in the flight reservation system."
)
public class SearchAllFlightsTool {

    private final FlightBookingService flightBookingService;

    @Tool(
            name = "searchAllFlights",
            description = """
                    Returns ALL flights in the system.

                    The result can include both AVAILABLE and BOOKED flights.

                    Use this tool when the user explicitly asks for:
                    - all flights
                    - the complete flight list
                    - every flight
                    - the full list of flights

                    Do NOT use this tool when the user specifically asks
                    only for available or bookable flights.
                    """
    )
    public List<FlightListDTO> execute() {
        return flightBookingService.findAll();
    }
}