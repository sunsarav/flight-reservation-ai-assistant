package se.lexicon.flightbooking_api.ai;

import com.fasterxml.jackson.annotation.JsonClassDescription;
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

    public List<AvailableFlightDTO> execute() {
        return flightBookingService.findAvailableFlights();
    }
}