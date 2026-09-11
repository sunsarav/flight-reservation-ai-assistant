package se.lexicon.flightbooking_api.ai;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.lexicon.flightbooking_api.dto.AvailableFlightDTO;
import se.lexicon.flightbooking_api.service.FlightBookingService;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SearchAvailableFlightsToolTest {

    @Mock
    private FlightBookingService flightBookingService;

    @InjectMocks
    private SearchAvailableFlightsTool searchAvailableFlightsTool;

    @Test
    void execute_ShouldReturnAvailableFlights() {

        // Arrange
        AvailableFlightDTO flight = new AvailableFlightDTO(
                1L,
                "SK123",
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(2),
                "London",
                150.0
        );

        List<AvailableFlightDTO> expectedFlights = List.of(flight);

        when(flightBookingService.findAvailableFlights())
                .thenReturn(expectedFlights);

        // Act
        List<AvailableFlightDTO> result =
                searchAvailableFlightsTool.execute();

        // Assert
        assertEquals(1, result.size());
        assertEquals("SK123", result.get(0).flightNumber());
        assertEquals("London", result.get(0).destination());
    }
}