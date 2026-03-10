// frontend/app.js
// Handles all frontend logic:
// - Sending and receiving chat messages
// - Conversation history (memory)
// - File upload handling
// - Tool activation

// ---- STATE ----
// conversationHistory stores every message sent/received.
// It is sent to the backend with every request so the AI has full context.
let conversationHistory = [];
let activeTool = null;

const API_BASE = "";  // Empty string = same origin (works for both local and deployed)


// ---- CORE CHAT FUNCTION ----
async function sendMessage() {
    const input = document.getElementById("message-input");
    const userText = input.value.trim();
    
    if (!userText) return;
    
    // Clear input and disable send button
    input.value = "";
    autoResize(input);
    setSendDisabled(true);
    
    // Apply tool context to user message if a tool is active
    let processedText = userText;
    if (activeTool === "email") {
        processedText = `Generate a professional business email: ${userText}`;
        deactivateTool();
    } else if (activeTool === "research") {
        processedText = `Research this company and provide a detailed business report: ${userText}`;
        deactivateTool();
    }
    
    // Add user message to UI and history
    appendMessage("user", userText);
    conversationHistory.push({ role: "user", content: processedText });
    
    // Show loading indicator
    const loadingId = showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: conversationHistory })
        });
        
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        const data = await response.json();
        const aiResponse = data.response;
        
        // Add AI response to history and UI
        conversationHistory.push({ role: "assistant", content: aiResponse });
        removeLoading(loadingId);
        appendMessage("assistant", aiResponse);
        
    } catch (error) {
        removeLoading(loadingId);
        appendMessage("assistant", `⚠️ Error: ${error.message}. Please check your connection and try again.`);
    }
    
    setSendDisabled(false);
    scrollToBottom();
}


// ---- FILE UPLOAD ----
async function handleFileUpload(input, type) {
    const file = input.files[0];
    if (!file) return;
    
    // Show user that file is being uploaded
    appendMessage("user", `📎 Uploading ${file.name}...`);
    const loadingId = showLoading();
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
        const endpoint = type === "pdf" ? "/api/upload/pdf" : "/api/upload/csv";
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            body: formData
        });
        
        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
        
        const data = await response.json();
        const result = type === "pdf" ? data.summary : data.analysis;
        
        // Add to conversation history so AI can reference this analysis later
        conversationHistory.push({
            role: "user",
            content: `I uploaded a file called "${file.name}". Here is the analysis:`
        });
        conversationHistory.push({
            role: "assistant",
            content: result
        });
        
        removeLoading(loadingId);
        appendMessage("assistant", result);
        
    } catch (error) {
        removeLoading(loadingId);
        appendMessage("assistant", `⚠️ Upload error: ${error.message}`);
    }
    
    // Reset file input so the same file can be uploaded again
    input.value = "";
    scrollToBottom();
}


// ---- TOOL MANAGEMENT ----
function activateTool(tool) {
    activeTool = tool;
    const indicator = document.getElementById("tool-indicator");
    const text = document.getElementById("tool-indicator-text");
    
    const labels = {
        email: "✉️ Email Generator — describe the email you need",
        research: "🔍 Company Research — enter a company name"
    };
    
    text.textContent = labels[tool];
    indicator.style.display = "flex";
    document.getElementById("message-input").focus();
}

function deactivateTool() {
    activeTool = null;
    document.getElementById("tool-indicator").style.display = "none";
}


// ---- UI HELPERS ----
function appendMessage(role, content) {
    const chatWindow = document.getElementById("chat-window");
    
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role === "user" ? "user-message" : "assistant-message"}`;
    
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = role === "user" ? "You" : "AI";
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    
    // Convert markdown-like formatting to HTML
    contentDiv.innerHTML = formatMessage(content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatWindow.appendChild(messageDiv);
    
    scrollToBottom();
}

function formatMessage(text) {
    // Basic markdown formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>")
        .replace(/^/, "<p>")
        .replace(/$/, "</p>");
}

function showLoading() {
    const chatWindow = document.getElementById("chat-window");
    const id = "loading-" + Date.now();
    
    const messageDiv = document.createElement("div");
    messageDiv.className = "message assistant-message";
    messageDiv.id = id;
    
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "AI";
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.innerHTML = `<div class="loading-dots"><span></span><span></span><span></span></div>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatWindow.appendChild(messageDiv);
    
    scrollToBottom();
    return id;
}

function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    const chatWindow = document.getElementById("chat-window");
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function clearChat() {
    conversationHistory = [];
    activeTool = null;
    document.getElementById("tool-indicator").style.display = "none";
    const chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML = `
        <div class="message assistant-message">
            <div class="message-avatar">AI</div>
            <div class="message-content">
                <p>Chat cleared. How can I help you?</p>
            </div>
        </div>
    `;
}

function handleKeyDown(event) {
    // Send message on Enter (but allow Shift+Enter for new lines)
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize(textarea) {
    // Auto-expand textarea as user types
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
}

function setSendDisabled(disabled) {
    document.getElementById("send-btn").disabled = disabled;
}