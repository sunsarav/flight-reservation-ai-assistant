package se.lexicon.flightbooking_api.assistant;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;
import se.lexicon.flightbooking_api.ai.BookFlightTool;
import se.lexicon.flightbooking_api.ai.CancelFlightTool;
import se.lexicon.flightbooking_api.ai.FindBookingsTool;
import se.lexicon.flightbooking_api.ai.SearchAllFlightsTool;
import se.lexicon.flightbooking_api.ai.SearchAvailableFlightsTool;

@Service
public class FlightAssistant {

    private final ChatClient chatClient;
    private final ChatMemory chatMemory;

    public FlightAssistant(
            ChatClient.Builder chatClientBuilder,
            ChatMemory chatMemory,
            SearchAvailableFlightsTool searchAvailableFlightsTool,
            SearchAllFlightsTool searchAllFlightsTool,
            BookFlightTool bookFlightTool,
            FindBookingsTool findBookingsTool,
            CancelFlightTool cancelFlightTool
    ) {

        this.chatMemory = chatMemory;

        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        You are a helpful flight reservation assistant.

                        Your job is to help users:
                        1. Search for available flights.
                        2. Book a flight.
                        3. Find existing bookings.
                        4. Cancel a flight booking.

                        Always be polite, clear, and helpful.

                        When the user wants to search for flights, use the appropriate flight search tool.

                        When the user wants to book a flight, make sure you have:
                        - the flight ID or enough information to identify the flight
                        - passenger name
                        - passenger email

                        If required information is missing, ask the user for it.
                        Do not invent missing information.

                        When the user wants to cancel a booking, make sure you have:
                        - the flight ID
                        - passenger email

                        If the user asks about their bookings, ask for their email if it is not provided.

                        Use the available tools to perform flight operations.

                        Never pretend that a booking, cancellation, or search was successful if the tool did not successfully perform the operation.

                        Explain the result clearly to the user.
                        """)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build()
                )
                .defaultTools(
                        searchAvailableFlightsTool,
                        searchAllFlightsTool,
                        bookFlightTool,
                        findBookingsTool,
                        cancelFlightTool
                )
                .build();
    }

    public String chat(String chatId, String message) {

        return chatClient
                .prompt()
                .user(message)
                .advisors(advisor -> advisor.param(
                        ChatMemory.CONVERSATION_ID,
                        chatId
                ))
                .call()
                .content();
    }
}