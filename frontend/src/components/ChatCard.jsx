import { useState, useRef, useEffect } from "react";

function ChatBubbleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 2h10a1 1 0 011 1v6a1 1 0 01-1 1H5L2 13V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

function GhostAvatarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5V10l1-1 1 1 1-1 1 1 1-1 1 1V4.5C9.5 2.57 7.93 1 6 1z" fill="currentColor" opacity="0.8"/>
      <circle cx="4.75" cy="5" r="0.7" fill="var(--bg-card)"/>
      <circle cx="7.25" cy="5" r="0.7" fill="var(--bg-card)"/>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1"/>
      <path d="M3 5l1.5 1.5L7 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ConfidenceBadge({ level }) {
  const styles = {
    high:   { bg: "var(--green-badge-bg)",  color: "var(--green-badge)"  },
    medium: { bg: "var(--amber-badge-bg)",  color: "var(--amber-badge)"  },
    low:    { bg: "var(--red-badge-bg)",    color: "var(--red-badge)"    },
  };
  const s = styles[level] || styles.medium;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "3px",
      background: s.bg,
      color: s.color,
      borderRadius: "20px",
      padding: "2px 7px",
      fontSize: "11px",
      fontWeight: 500,
      marginLeft: "8px",
      verticalAlign: "middle",
    }}>
      <CheckCircleIcon />
      {level}
    </span>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", padding: "2px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "var(--text-tertiary)",
          display: "inline-block",
          animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function ChatCard({ onAsk, disabled }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleAsk = async () => {
    if (!input.trim() || thinking) return;
    const question = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setThinking(true);

    try {
      const answer = await onAsk(question);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: answer.text || answer,
        confidence: answer.confidence || "medium",
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
        confidence: "low",
      }]);
    } finally {
      setThinking(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); }
  };

  return (
    <div
      className="card animate-in"
      style={{ overflow: "hidden", animationDelay: "0.2s" }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 16px",
        fontSize: "14px",
        fontWeight: 500,
        color: "var(--text-primary)",
        borderBottom: "0.5px solid var(--border)",
      }}>
        <span style={{ color: "var(--text-secondary)" }}><ChatBubbleIcon /></span>
        Ask about this repository
      </div>

      {/* Messages */}
      <div style={{
        padding: "16px",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
        {messages.length === 0 && !thinking && (
          <p style={{
            fontSize: "13px",
            color: "var(--text-tertiary)",
            textAlign: "center",
            marginTop: "24px",
          }}>
            Ask anything about the repository…
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            {/* Avatar */}
            <div style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 500,
              background: msg.role === "user" ? "var(--accent-light)" : "var(--bg-code)",
              color: msg.role === "user" ? "var(--accent-text)" : "var(--text-secondary)",
            }}>
              {msg.role === "user" ? "U" : <GhostAvatarIcon />}
            </div>

            {/* Message body */}
            <div style={{ flex: 1, paddingTop: "3px" }}>
              <span style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
              }}>
                {msg.text}
              </span>
              {msg.role === "assistant" && msg.confidence && (
                <ConfidenceBadge level={msg.confidence} />
              )}
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {thinking && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--bg-code)", color: "var(--text-secondary)",
            }}>
              <GhostAvatarIcon />
            </div>
            <div style={{ flex: 1, paddingTop: "8px" }}>
              <ThinkingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{
        borderTop: "0.5px solid var(--border)",
        padding: "10px 12px",
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="How does the dependency injection system work?"
          disabled={disabled || thinking}
          style={{
            flex: 1,
            height: "36px",
            padding: "0 12px",
            border: "0.5px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-page)",
            color: "var(--text-primary)",
            fontSize: "13px",
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
        <button
          className="btn btn-dark"
          onClick={handleAsk}
          disabled={!input.trim() || thinking || disabled}
          style={{ height: "36px", padding: "0 14px", fontSize: "13px" }}
        >
          {thinking ? <span className="spinner" /> : "Ask"}
        </button>
      </div>
    </div>
  );
}
