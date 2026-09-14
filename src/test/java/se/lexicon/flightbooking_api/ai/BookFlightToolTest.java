package se.lexicon.flightbooking_api.ai;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.lexicon.flightbooking_api.dto.BookFlightRequestDTO;
import se.lexicon.flightbooking_api.dto.FlightBookingDTO;
import se.lexicon.flightbooking_api.service.FlightBookingService;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookFlightToolTest {

    @Mock
    private FlightBookingService flightBookingService;

    @InjectMocks
    private BookFlightTool bookFlightTool;

    @Test
    void execute_ShouldBookFlight() {

        // Arrange
        Long flightId = 1L;
        String passengerName = "John Smith";
        String passengerEmail = "john@example.com";

        BookFlightRequestDTO request =
                new BookFlightRequestDTO(
                        passengerName,
                        passengerEmail
                );

        FlightBookingDTO expectedBooking =
                new FlightBookingDTO(
                        1L,
                        "SK123",
                        passengerName,
                        passengerEmail,
                        LocalDateTime.now().plusDays(1),
                        LocalDateTime.now().plusDays(1).plusHours(2),
                        "BOOKED",
                        "London",
                        150.0
                );

        when(
                flightBookingService.bookFlight(
                        eq(flightId),
                        eq(request)
                )
        ).thenReturn(expectedBooking);

        // Act
        FlightBookingDTO result =
                bookFlightTool.execute(
                        flightId,
                        passengerName,
                        passengerEmail
                );

        // Assert
        assertEquals(1L, result.id());
        assertEquals("John Smith", result.passengerName());
        assertEquals("john@example.com", result.passengerEmail());
        assertEquals("BOOKED", result.status());
    }
}