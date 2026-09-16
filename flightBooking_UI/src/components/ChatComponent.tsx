import React, { useEffect, useRef, useState } from 'react';

type MessageSender = 'user' | 'assistant' | 'error';

interface ChatMessage {
    id: number;
    sender: MessageSender;
    text: string;
}

const ChatComponent: React.FC = () => {

    /*
     * The user's current input.
     */
    const [message, setMessage] = useState<string>('');

    /*
     * A unique ID for this conversation.
     *
     * The same chatId is used for the entire React component session,
     * allowing Spring AI to keep the conversation history.
     */
    const [chatId] = useState<string>(() => crypto.randomUUID());

    /*
     * Shows whether we are waiting for Spring Boot.
     */
    const [loading, setLoading] = useState<boolean>(false);

    /*
     * Stores all messages displayed in the chat.
     */
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: 'assistant',
            text:
                'Hello! 👋 I am your Flight Reservation Assistant. ' +
                'I can help you search for flights, make bookings, ' +
                'find your bookings, and cancel bookings.'
        }
    ]);

    /*
     * Reference to the actual scrollable messages container.
     *
     * IMPORTANT:
     * We scroll this element itself.
     * We do NOT use scrollIntoView(), because that can scroll
     * the entire webpage instead of only the chatbot.
     */
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    /*
     * Reference to the input field.
     *
     * We use this to focus the input after sending a message.
     */
    const inputRef = useRef<HTMLInputElement | null>(null);


    /*
     * Automatically scroll the CHAT MESSAGE AREA
     * to the newest message.
     *
     * This keeps the webpage itself in the same position.
     */
    useEffect(() => {
        const messagesContainer = chatMessagesRef.current;

        if (messagesContainer) {
            messagesContainer.scrollTop =
                messagesContainer.scrollHeight;
        }
    }, [messages, loading]);


    /*
     * Sends the user's message to Spring Boot.
     */
    const sendMessageToBackend = async (): Promise<void> => {

        const trimmedMessage = message.trim();

        /*
         * Do not send empty messages.
         * Do not allow another request while loading.
         */
        if (!trimmedMessage || loading) {
            return;
        }


        /*
         * Immediately display the user's message.
         */
        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: 'user',
            text: trimmedMessage
        };

        setMessages((previousMessages) => [
            ...previousMessages,
            userMessage
        ]);


        /*
         * Clear the input field immediately.
         */
        setMessage('');


        /*
         * Show loading state.
         */
        setLoading(true);


        /*
         * Encode the values before adding them to the URL.
         */
        const encodedChatId = encodeURIComponent(chatId);

        const encodedMessage =
            encodeURIComponent(trimmedMessage);


        /*
         * Spring Boot AI endpoint.
         */
        const url =
            `http://localhost:8080/api/v1/ai/chat` +
            `?chatId=${encodedChatId}` +
            `&message=${encodedMessage}`;


        try {

            console.log(`Sending request to: ${url}`);


            const response = await fetch(url);


            console.log(
                'Response Status:',
                response.status
            );


            /*
             * Spring Boot returns the assistant response
             * as a String, so response.text() is correct.
             */
            const responseText = await response.text();


            /*
             * If Spring returns an error status,
             * show a friendly error message.
             */
            if (!response.ok) {

                console.error(
                    'Backend error:',
                    response.status,
                    responseText
                );


                setMessages((previousMessages) => [
                    ...previousMessages,
                    {
                        id: Date.now() + 1,
                        sender: 'error',
                        text:
                            'Sorry, something went wrong while contacting ' +
                            'the flight service. ' +
                            `Server status: ${response.status}`
                    }
                ]);

                return;
            }


            /*
             * Display the assistant's response.
             */
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    id: Date.now() + 1,
                    sender: 'assistant',
                    text: responseText
                }
            ]);

        } catch (error) {

            console.error(
                'Connection failed:',
                error
            );


            /*
             * Display a friendly connection error.
             */
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    id: Date.now() + 1,
                    sender: 'error',
                    text:
                        'I could not connect to the flight service. ' +
                        'Please make sure the Spring Boot application is running.'
                }
            ]);

        } finally {

            /*
             * Stop loading state.
             */
            setLoading(false);


            /*
             * Put the cursor back into the input.
             */
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };


    /*
     * Handle keyboard input.
     *
     * Pressing Enter sends the message.
     */
    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ): void => {

        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {
            event.preventDefault();

            sendMessageToBackend();
        }
    };


    /*
     * Clear the current conversation displayed in the UI.
     *
     * NOTE:
     * The existing Spring AI conversation memory is associated
     * with the current chatId. This button resets the visible
     * frontend messages and input.
     */
    const clearChat = (): void => {

        setMessages([
            {
                id: Date.now(),
                sender: 'assistant',
                text:
                    'Hello! 👋 I am your Flight Reservation Assistant. ' +
                    'How can I help you today?'
            }
        ]);

        setMessage('');


        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };


    return (
        <div className="chat-app">

            {/* =========================
                Header
            ========================= */}

            <header className="chat-header">

                <div className="header-title">

                    <div className="flight-icon">
                        ✈️
                    </div>

                    <div>
                        <h1>
                            Flight Reservation Assistant
                        </h1>

                        <p>
                            Your personal flight assistant
                        </p>
                    </div>

                </div>


                <button
                    type="button"
                    className="clear-button"
                    onClick={clearChat}
                    disabled={loading}
                >
                    🧹 Clear Chat
                </button>

            </header>


            {/* =========================
                Chat messages
            ========================= */}

            <div
                ref={chatMessagesRef}
                className="messages-container"
            >

                {messages.map((chatMessage) => (

                    <div
                        key={chatMessage.id}
                        className={`message-row ${chatMessage.sender}`}
                    >

                        {chatMessage.sender !== 'user' && (
                            <div className="avatar assistant-avatar">
                                ✈️
                            </div>
                        )}


                        <div
                            className={`message-bubble ${chatMessage.sender}`}
                        >
                            {chatMessage.text}
                        </div>


                        {chatMessage.sender === 'user' && (
                            <div className="avatar user-avatar">
                                👤
                            </div>
                        )}

                    </div>

                ))}


                {/* =========================
                    Loading indicator
                ========================= */}

                {loading && (

                    <div className="message-row assistant">

                        <div className="avatar assistant-avatar">
                            ✈️
                        </div>

                        <div className="message-bubble assistant loading-message">

                            <span>
                                Thinking
                            </span>

                            <span className="typing-dots">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </span>

                        </div>

                    </div>

                )}

            </div>


            {/* =========================
                Input area
            ========================= */}

            <div className="input-section">

                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(event) =>
                        setMessage(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about flights, bookings, or cancellations..."
                    disabled={loading}
                    aria-label="Chat message"
                />


                <button
                    type="button"
                    className="send-button"
                    onClick={sendMessageToBackend}
                    disabled={
                        loading ||
                        !message.trim()
                    }
                >
                    {loading
                        ? 'Sending...'
                        : 'Send ✈️'}
                </button>

            </div>


            <div className="input-help">
                Press <strong>Enter</strong> to send
            </div>

        </div>
    );
};

export default ChatComponent;