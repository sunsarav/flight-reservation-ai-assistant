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
        bookFlightTool.flightId = 1L;
        bookFlightTool.passengerName = "John Smith";
        bookFlightTool.passengerEmail = "john@example.com";

        BookFlightRequestDTO request =
                new BookFlightRequestDTO(
                        "John Smith",
                        "john@example.com"
                );

        FlightBookingDTO expectedBooking =
                new FlightBookingDTO(
                        1L,
                        "SK123",
                        "John Smith",
                        "john@example.com",
                        LocalDateTime.now().plusDays(1),
                        LocalDateTime.now().plusDays(1).plusHours(2),
                        "BOOKED",
                        "London",
                        150.0
                );

        when(
                flightBookingService.bookFlight(
                        eq(1L),
                        eq(request)
                )
        ).thenReturn(expectedBooking);

        // Act
        FlightBookingDTO result =
                bookFlightTool.execute();

        // Assert
        assertEquals(1L, result.id());
        assertEquals("John Smith", result.passengerName());
        assertEquals(
                "john@example.com",
                result.passengerEmail()
        );
        assertEquals("BOOKED", result.status());
    }
}