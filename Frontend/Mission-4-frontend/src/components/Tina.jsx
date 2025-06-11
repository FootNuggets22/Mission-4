import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import "./Tina.css";

export default function Tina() {
  
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [hasFinalResponse, setHasFinalResponse] = useState(false);
  const sending = useRef(false);
  const bottomRef = useRef(null);

  // Scrolls the chat to the bottom whenever chatHistory changes
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Auto-scroll on new message
  }, [chatHistory]);

  // Starts the conversation with Tina's opening message
  const startConversation = () => {
    setChatHistory([
      {
        role: "assistant",
        content:
          "I'm Tina. I help you choose the right insurance policy. May I ask you a few questions to recommend the best policy for you?",
      },
    ]);
    setHasFinalResponse(false); // Reset end-of-conversation state
  };

  // Handles sending a user message
  const sendMessage = async () => {
    // Prevent sending if input is empty, already sending, or conversation ended
    if (!userInput.trim() || sending.current || hasFinalResponse) return;

    // Sanitize user input to prevent XSS attacks
    const sanitized = DOMPurify.sanitize(userInput);
    // Create user message object
    const userMessage = { role: "user", content: sanitized };

    // Add user message to chat history
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setUserInput(""); // Clear input box
    sending.current = true; // Mark as sending

    try {
      // Send chat history to backend API for Tina's response
      const res = await fetch("http://localhost:4000/api/insurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: updatedHistory }),
      });
      const data = await res.json();
      // Use reply from backend or fallback message
      const reply = data.reply || "Sorry, something went wrong.";

      // Add Tina's reply to chat history
      const updated = [
        ...updatedHistory,
        { role: "assistant", content: reply },
      ];
      setChatHistory(updated);

      // If user has sent 6 or more messages, end the conversation
      if (updated.filter((msg) => msg.role === "user").length >= 6) {
        setHasFinalResponse(true);
      }
    } catch (err) {
      // On error, show error message from Tina
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was a problem contacting the server.",
        },
      ]);
    } finally {
      sending.current = false; // Allow sending again
    }
  };

  return (
    <div className="interview-wrapper">
      <div className="interview-container">
        <h1 className="title">Tina – Insurance Assistant</h1>

        {/* Chat history display */}
        <div className="chat-box">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              {/* Show who is speaking */}
              <strong>{msg.role === "assistant" ? "Tina" : "Me"}:</strong>{" "}
              {/* Render message content with markdown support */}
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}
          {/* Dummy div for scrolling to bottom */}
          <div ref={bottomRef} />
        </div>

        {/* Input row for user messages */}
        <div className="input-row">
          <input
            type="text"
            placeholder={
              hasFinalResponse ? "Recommendation given." : "Type your message"
            }
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} // Update input state
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send on Enter
            className="response-input"
            disabled={hasFinalResponse} // Disable input if conversation ended
          />
          <button
            className="submit-button"
            onClick={sendMessage}
            disabled={hasFinalResponse}
          >
            Submit
          </button>
        </div>

        {/* Show Start button if chat hasn't started */}
        {!chatHistory.length && (
          <button className="start-button" onClick={startConversation}>
            Start
          </button>
        )}
      </div>
    </div>
  );
}
