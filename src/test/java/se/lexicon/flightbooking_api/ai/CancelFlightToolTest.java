package se.lexicon.flightbooking_api.ai;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.lexicon.flightbooking_api.service.FlightBookingService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CancelFlightToolTest {

    @Mock
    private FlightBookingService flightBookingService;

    @InjectMocks
    private CancelFlightTool cancelFlightTool;

    @Test
    void execute_ShouldCancelFlight() {

        // Arrange
        cancelFlightTool.flightId = 1L;
        cancelFlightTool.passengerEmail =
                "john@example.com";

        // Act
        String result =
                cancelFlightTool.execute();

        // Assert
        verify(flightBookingService)
                .cancelFlight(
                        1L,
                        "john@example.com"
                );

        assertEquals(
                "Flight booking cancelled successfully.",
                result
        );
    }
}