package se.lexicon.flightbooking_api.ai;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.lexicon.flightbooking_api.dto.FlightBookingDTO;
import se.lexicon.flightbooking_api.service.FlightBookingService;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FindBookingsToolTest {

    @Mock
    private FlightBookingService flightBookingService;

    @InjectMocks
    private FindBookingsTool findBookingsTool;

    @Test
    void execute_ShouldReturnBookingsByEmail() {

        // Arrange
        findBookingsTool.email = "john@example.com";

        FlightBookingDTO booking =
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
                flightBookingService.findBookingsByEmail(
                        "john@example.com"
                )
        ).thenReturn(List.of(booking));

        // Act
        List<FlightBookingDTO> result =
                findBookingsTool.execute();

        // Assert
        assertEquals(1, result.size());
        assertEquals(
                "john@example.com",
                result.get(0).passengerEmail()
        );
        assertEquals(
                "SK123",
                result.get(0).flightNumber()
        );
    }
}