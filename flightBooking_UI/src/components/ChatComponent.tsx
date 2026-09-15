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
            text: 'Hello! 👋 I am your Flight Reservation Assistant. I can help you search for flights, make bookings, find your bookings, and cancel bookings.'
        }
    ]);

    /*
     * Reference to the bottom of the messages area.
     * We will use this for automatic scrolling.
     */
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    /*
     * Reference to the input field.
     * We use this to focus the input after sending.
     */
    const inputRef = useRef<HTMLInputElement | null>(null);


    /*
     * Automatically scroll to the newest message.
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages, loading]);


    /*
     * Sends the user's message to Spring Boot.
     */
    const sendMessageToBackend = async (): Promise<void> => {

        const trimmedMessage = message.trim();

        /*
         * Do not send empty messages.
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
         * Clear the input field.
         */
        setMessage('');


        /*
         * Show loading state.
         */
        setLoading(true);


        const encodedChatId = encodeURIComponent(chatId);

        const encodedMessage =
            encodeURIComponent(trimmedMessage);


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
             * Spring Boot returns a String,
             * so we use response.text().
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
                            'Sorry, something went wrong while contacting the flight service. ' +
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
     * Clear the current conversation.
     */
    const clearChat = (): void => {

        setMessages([
            {
                id: Date.now(),
                sender: 'assistant',
                text:
                    'Hello! 👋 I am your Flight Reservation Assistant. How can I help you today?'
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

            <div className="messages-container">

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


                {/* Automatic scroll target */}
                <div ref={messagesEndRef} />

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
                />


                <button
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