import { Button, Drawer, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ChatSidebarProps, Message } from "./types";

import { styled } from "@mui/material/styles";
import { talk2DBService } from "../../../../api/talk2dbService";
import { AvatarIcon } from "../icons/AvatarIcon";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { MessageInput } from "../MessageInput";
import { Talk2DBHeader } from "../Talk2DBHeader";

const StyledDrawer = styled(Drawer)<{ expanded?: boolean }>(({ expanded }) => ({
  "& .MuiDrawer-paper": {
    width: expanded ? "100vw" : "400px",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
    boxShadow: expanded ? "none" : "-2px 0 8px rgba(0, 0, 0, 0.1)",
    transition: "width 0.3s ease-in-out",
    zIndex: 1050, // Below header z-index (1100) but above content
    position: "fixed",
    top: "96px", // Header height (64px) + global padding (32px)
    right: 0,
    height: "calc(100vh - 96px)", // Account for header height and global padding
    overflow: "hidden",
  },
  "@keyframes typing": {
    "0%, 60%, 100%": {
      opacity: 0.3,
    },
    "30%": {
      opacity: 1,
    },
  },
}));

const ChatContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded?: boolean }>(({ expanded }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  backgroundColor: expanded ? "#F8F9FA" : "#FFFFFF",
  padding: expanded ? "0" : "16px",
}));

const MessagesContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded?: boolean }>(({ expanded }) => ({
  flex: 1,
  overflow: "auto",
  padding: expanded ? "24px" : "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxWidth: expanded ? "1200px" : "100%",
  margin: expanded ? "0 auto" : "0",
  width: "100%",
}));

const MessageRow = styled("div")<{ type: "user" | "bot" }>(({ type }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  flexDirection: type === "user" ? "row-reverse" : "row",
}));

const MessageBubble = styled("div")<{ type: "user" | "bot" }>(({ type }) => ({
  maxWidth: "70%",
  padding: "12px 16px",
  borderRadius: "12px",
  backgroundColor: type === "user" ? "#4C4E64" : "#F3F4F6",
  color: type === "user" ? "#FFFFFF" : "#000000",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "left",
}));

const BotAvatar = styled("div")({
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  overflow: "hidden",
});

const UserAvatar = styled("div")({
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: "#4C4E64",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: 500,
  flexShrink: 0,
});

const TypingIndicator = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "8px 12px",
});

const TypingDot = styled("span")({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#666",
  animation: "typing 1.4s infinite",
  "&:nth-of-type(2)": {
    animationDelay: "0.2s",
  },
  "&:nth-of-type(3)": {
    animationDelay: "0.4s",
  },
});

const ChartImage = styled("img")({
  maxWidth: "100%",
  height: "auto",
  borderRadius: "8px",
  marginTop: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
});

const ResultsTableContainer = styled("div")({
  marginTop: "12px",
  maxHeight: "400px",
  overflowY: "auto",
  overflowX: "auto",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#FFFFFF",
});

const ResultsTable = styled("table")({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
  backgroundColor: "#FFFFFF",
});

const TableHeader = styled("th")({
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#F3F4F6",
  borderBottom: "1px solid #E5E7EB",
  fontWeight: 600,
  color: "#374151",
  position: "sticky",
  top: 0,
  zIndex: 1,
});

const TableCell = styled("td")({
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #E5E7EB",
  color: "#4B5563",
});

const TableRow = styled("tr")({
  "&:last-child td": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: "#F9FAFB",
  },
});

const ChartButton = styled(Button)({
  marginTop: "8px",
  textTransform: "none",
  fontSize: "12px",
  padding: "4px 12px",
  backgroundColor: "transparent",
  color: "#4C4E64",
  border: "1px solid #E5E7EB",
  "&:hover": {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
  },
});

const MessageInputContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded?: boolean }>(({ expanded }) => ({
  padding: expanded ? "24px" : "16px",
  maxWidth: expanded ? "1200px" : "100%",
  margin: expanded ? "0 auto" : "0",
  width: "100%",
}));

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingChartId, setLoadingChartId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello, I'm your personal assistant. I'm here to help determine the perfect product for your client. Tell me about your client!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Show typing indicator
    const typingMessage: Message = {
      id: "typing",
      type: "bot",
      content: "",
      timestamp: "",
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Send message to API
      const response = await talk2DBService.sendMessage(content);

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

      // Add bot response with thoughts and results
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.data.thoughts || "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        data: {
          generated_code: response.data.generated_code,
          thoughts: response.data.thoughts,
          results: response.data.results,
        },
        originalQuery: content,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch {
      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

      // Add error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  const handleGenerateChart = async (
    messageId: string,
    query: string,
    isRegenerate: boolean = false
  ) => {
    try {
      // Set loading state
      setLoadingChartId(messageId);

      // Find the message to get its results data
      const message = messages.find((msg) => msg.id === messageId);
      const data = message?.data?.results || [];

      const improvementIterations = isRegenerate ? 1 : 0;
      const response = await talk2DBService.generateChart(
        query,
        data,
        improvementIterations
      );

      // Update the message with the chart
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            return {
              ...msg,
              data: {
                ...msg.data,
                base_64_image: response.base64_chart,
              },
            };
          }
          return msg;
        })
      );
    } catch (error) {
      console.error("Error generating chart:", error);
    } finally {
      // Clear loading state
      setLoadingChartId(null);
    }
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
      expanded={expanded}
    >
      <ChatContainer expanded={expanded}>
        <Talk2DBHeader
          title="Talk2DB"
          onClose={onClose}
          onExpand={handleExpand}
          showBotIcon
          expanded={expanded}
        />
        <MessagesContainer expanded={expanded}>
          {messages.map((message) => (
            <MessageRow key={message.id} type={message.type}>
              {message.type === "bot" ? (
                <BotAvatar>
                  <AvatarIcon width={32} height={32} />
                </BotAvatar>
              ) : (
                <UserAvatar>U</UserAvatar>
              )}
              <MessageBubble type={message.type}>
                {message.isTyping ? (
                  <TypingIndicator>
                    <TypingDot />
                    <TypingDot />
                    <TypingDot />
                  </TypingIndicator>
                ) : (
                  <>
                    <MarkdownRenderer content={message.content} />
                    {message.data?.results &&
                      message.data.results.length > 0 && (
                        <>
                          <ResultsTableContainer>
                            <ResultsTable>
                              <thead>
                                <tr>
                                  {Object.keys(message.data.results[0]).map(
                                    (key) => (
                                      <TableHeader key={key}>{key}</TableHeader>
                                    )
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {message.data.results
                                  .slice(0, 500)
                                  .map((row, index) => (
                                    <TableRow key={index}>
                                      {Object.values(row).map(
                                        (value, cellIndex) => (
                                          <TableCell key={cellIndex}>
                                            {value !== null &&
                                            value !== undefined
                                              ? String(value)
                                              : "-"}
                                          </TableCell>
                                        )
                                      )}
                                    </TableRow>
                                  ))}
                              </tbody>
                            </ResultsTable>
                          </ResultsTableContainer>
                          {message.data.results.length > 500 && (
                            <Typography
                              variant="caption"
                              sx={{ display: "block", mt: 1, color: "#666" }}
                            >
                              Showing first 500 of {message.data.results.length}{" "}
                              records
                            </Typography>
                          )}
                          {!message.data.base_64_image &&
                            message.originalQuery && (
                              <ChartButton
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  handleGenerateChart(
                                    message.id,
                                    message.originalQuery!
                                  )
                                }
                                disabled={loadingChartId === message.id}
                              >
                                Generate Chart
                              </ChartButton>
                            )}
                          {loadingChartId === message.id &&
                            !message.data.base_64_image && (
                              <TypingIndicator>
                                <TypingDot />
                                <TypingDot />
                                <TypingDot />
                              </TypingIndicator>
                            )}
                        </>
                      )}
                    {message.data?.base_64_image && (
                      <>
                        <ChartImage
                          src={`data:image/png;base64,${message.data.base_64_image}`}
                          alt="Chart visualization"
                        />
                        {message.originalQuery && (
                          <>
                            <ChartButton
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                handleGenerateChart(
                                  message.id,
                                  message.originalQuery!,
                                  true
                                )
                              }
                              disabled={loadingChartId === message.id}
                            >
                              Regenerate Chart
                            </ChartButton>
                            {loadingChartId === message.id && (
                              <TypingIndicator>
                                <TypingDot />
                                <TypingDot />
                                <TypingDot />
                              </TypingIndicator>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </MessageBubble>
            </MessageRow>
          ))}
        </MessagesContainer>
        <MessageInputContainer expanded={expanded}>
          <MessageInput
            placeholder="Type your message"
            onSend={handleSendMessage}
          />
        </MessageInputContainer>
      </ChatContainer>
    </StyledDrawer>
  );
};
