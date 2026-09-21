import React, { useEffect, useRef, useState } from 'react';
import './ChatComponent.css';

type MessageSender = 'user' | 'assistant' | 'error';

interface ChatMessage {
    id: number;
    sender: MessageSender;
    text: string;
}

const ChatComponent: React.FC = () => {

    const [message, setMessage] = useState<string>('');

    /*
     * One conversation ID for this chat session.
     *
     * Spring AI uses this ID to maintain the conversation
     * memory on the backend.
     */
    const [chatId] = useState<string>(
        () => crypto.randomUUID()
    );

    const [loading, setLoading] = useState<boolean>(false);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: 'assistant',
            text:
                'Hello! 👋 I am SkyMate, your personal flight assistant. ' +
                'I can help you search for flights, make bookings, ' +
                'find your bookings, and cancel bookings.'
        }
    ]);

    /*
     * IMPORTANT:
     *
     * This is the actual scrollable chat container.
     * We scroll ONLY this element.
     *
     * We do NOT use scrollIntoView(),
     * because that can move the entire webpage.
     */
    const chatMessagesRef =
        useRef<HTMLDivElement>(null);

    const inputRef =
        useRef<HTMLInputElement | null>(null);


    /*
     * Scroll only the chat messages area
     * whenever a new message arrives.
     */
    useEffect(() => {

        const messagesContainer =
            chatMessagesRef.current;

        if (messagesContainer) {

            messagesContainer.scrollTop =
                messagesContainer.scrollHeight;
        }

    }, [messages, loading]);


    /*
     * Send message to Spring Boot.
     */
    const sendMessageToBackend =
        async (): Promise<void> => {

            const trimmedMessage =
                message.trim();

            if (
                !trimmedMessage ||
                loading
            ) {
                return;
            }


            /*
             * Display user's message immediately.
             */
            const userMessage: ChatMessage = {
                id: Date.now(),
                sender: 'user',
                text: trimmedMessage
            };

            setMessages(
                previousMessages => [
                    ...previousMessages,
                    userMessage
                ]
            );


            setMessage('');

            setLoading(true);


            /*
             * Encode URL parameters.
             */
            const encodedChatId =
                encodeURIComponent(chatId);

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

                console.log(
                    `Sending request to: ${url}`
                );


                const response =
                    await fetch(url);


                console.log(
                    'Response Status:',
                    response.status
                );


                const responseText =
                    await response.text();


                /*
                 * Handle backend errors.
                 */
                if (!response.ok) {

                    console.error(
                        'Backend error:',
                        response.status,
                        responseText
                    );


                    setMessages(
                        previousMessages => [
                            ...previousMessages,
                            {
                                id:
                                    Date.now() + 1,

                                sender: 'error',

                                text:
                                    'Sorry, something went wrong ' +
                                    'while contacting the flight service. ' +
                                    `Server status: ${response.status}`
                            }
                        ]
                    );

                    return;
                }


                /*
                 * Display assistant response.
                 */
                setMessages(
                    previousMessages => [
                        ...previousMessages,
                        {
                            id:
                                Date.now() + 1,

                            sender: 'assistant',

                            text: responseText
                        }
                    ]
                );

            } catch (error) {

                console.error(
                    'Connection failed:',
                    error
                );


                setMessages(
                    previousMessages => [
                        ...previousMessages,
                        {
                            id:
                                Date.now() + 1,

                            sender: 'error',

                            text:
                                'I could not connect to the flight service. ' +
                                'Please make sure the Spring Boot application ' +
                                'is running.'
                        }
                    ]
                );

            } finally {

                setLoading(false);


                /*
                 * Return focus to input.
                 */
                setTimeout(() => {

                    inputRef.current?.focus();

                }, 100);
            }
        };


    /*
     * Press Enter to send.
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
     * Clear visible chat messages.
     *
     * The existing chatId remains unchanged,
     * so the Spring AI server-side memory also remains
     * associated with the same conversation.
     */
    const clearChat = (): void => {

        setMessages([
            {
                id: Date.now(),

                sender: 'assistant',

                text:
                    'Hello! 👋 I am SkyMate, your personal flight assistant. ' +
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
                CHAT HEADER
            ========================= */}

            <header className="chat-header">

                <div className="header-title">

                    <div className="flight-icon">
                        ✈️
                    </div>

                    <div>

                        <h1>
                            SkyMate
                        </h1>

                        <p>
                            Your Personal Flight Assistant
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="clear-button"
                    onClick={clearChat}
                    disabled={loading}
                    aria-label="Clear chat"
                >
                    🧹 Clear Chat
                </button>

            </header>


            {/* =========================
                CHAT MESSAGES
            ========================= */}

            <div
                ref={chatMessagesRef}
                className="messages-container"
            >

                {messages.map(
                    (chatMessage) => (

                        <div
                            key={chatMessage.id}
                            className={
                                `message-row ${chatMessage.sender}`
                            }
                        >

                            {chatMessage.sender !== 'user' && (

                                <div className="avatar assistant-avatar">
                                    ✈️
                                </div>

                            )}


                            <div
                                className={
                                    `message-bubble ${chatMessage.sender}`
                                }
                            >
                                {chatMessage.text}
                            </div>


                            {chatMessage.sender === 'user' && (

                                <div className="avatar user-avatar">
                                    👤
                                </div>

                            )}

                        </div>

                    )
                )}


                {/* =========================
                    LOADING INDICATOR
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
                INPUT
            ========================= */}

            <div className="input-section">

                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(event) =>
                        setMessage(
                            event.target.value
                        )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={
                        "Ask SkyMate about flights, bookings, or cancellations..."
                    }
                    disabled={loading}
                    aria-label="Chat message"
                />


                <button
                    type="button"
                    className="send-button"
                    onClick={
                        sendMessageToBackend
                    }
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