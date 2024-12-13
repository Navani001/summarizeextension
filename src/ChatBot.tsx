import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";

// Replace with your actual API key
const genAI = new GoogleGenerativeAI("AIzaSyAT4By5vK8T3gEpWZhKxqWUh6HeVnzHrS8");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default function ChatBot(): JSX.Element {
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Helper function to inject the mouseup listener into the active tab


  // Fetch chat history from storage
  const loadChatHistory = () => {
    chrome.storage.local.get(["chatHistory", "userInput"], (result) => {
      if (result.chatHistory) {
        setChatHistory(result.chatHistory);
      }
      if (result.userInput) {
        setUserInput(result.userInput);
      }
    });
  };

  // Store chat history and user input in storage
  const saveChatHistory = () => {
    chrome.storage.local.set(
      {
        chatHistory,
        userInput,
      },
      () => {
        console.log("Chat history and user input saved to storage.");
      }
    );
  };

  useEffect(() => {
    
    loadChatHistory(); // Load history on component mount
  }, []);

  useEffect(() => {
    saveChatHistory(); // Save history on change
  }, [chatHistory, userInput]);

  const handleUserInput = (value: string): void => {
    setUserInput(value);
  };

  const simulateTypingEffect = async (text: string): Promise<void> => {
    setIsTyping(true);
    let index = 0;
    const typingInterval = setInterval(() => {
      setChatHistory((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.type === "bot") {
          return [
            ...prev.slice(0, prev.length - 1),
            { ...lastMessage, message: text.slice(0, index) },
          ];
        } else {
          return [...prev, { type: "bot", message: text.slice(0, index) }];
        }
      });
      index++;
      if (index > text.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 50);
  };

  const sendMessage = async (messageText: string): Promise<void> => {
    if (!messageText.trim()) return;

    const conversationContext = chatHistory
      .map((msg) => `${msg.type === "user" ? "User" : "Bot"}: ${msg.message}`)
      .join("\n");

    const prompt = `${conversationContext}\nUser: ${messageText}\nBot:`;

    try {
      setChatHistory((prev) => [
        ...prev,
        { type: "user", message: messageText },
        { type: "bot", message: "" },
      ]);
      setUserInput("");

      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      await simulateTypingEffect(text);
    } catch (e) {
      console.error("Error occurred while fetching response:", e);
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", message: "Sorry, something went wrong." },
      ]);
    }
  };

  useEffect(() => {
    var data = "";
    const fetch = async () => {
      await chrome.storage.local.get("popupValue", function(result) {
        data = result.popupValue;
        if (data != "nothing") {
          sendMessage(data);
        }
        chrome.storage.local.set({ popupValue: "nothing" }, () => {
          console.log("Stored popupValue in chrome.storage.local");
        });
      });
    };
    fetch();
  });

  return (
    <div style={{ position: "relative", height: "500px", width: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {chatHistory.map((elt, i) => (
              <Message
                key={i}
                model={{
                  message: elt.message,
                  sentTime: "just now",
                  sender: elt.type === "user" ? "You" : "Bot",
                  direction: elt.type === "user" ? "outgoing" : "incoming",
                  position: "single",
                }}
              />
            ))}
            {isTyping && (
              <Message
                model={{
                  message: "Bot is typing...",
                  sentTime: "just now",
                  sender: "Bot",
                  direction: "incoming",
                  position: "single",
                }}
              />
            )}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={userInput}
            onChange={handleUserInput}
            onSend={() => sendMessage(userInput)}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
