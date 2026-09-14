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
            description = "Returns all flights in the flight reservation system."
    )
    public List<FlightListDTO> execute() {
        return flightBookingService.findAll();
    }
}