document.addEventListener("DOMContentLoaded", () => {
  var socket = new WebSocket("ws://localhost:8765");

  // Récupère le nom d'utilisateur du localStorage
  const username = localStorage.getItem("username") || "Anonyme"; // Utilise 'Anonyme' si aucun nom d'utilisateur n'est trouvé

  const messageForm = document.querySelector(".chat-input");
  const messageInput = messageForm.querySelector("input");
  const messageContainer = document.querySelector(".chat-messages");
  const sendButton = document.querySelector(".send-btn");

  sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    const messageToSend = username + ": " + message;
    socket.send(messageToSend);
    messageInput.value = "";
  });

  socket.addEventListener("message", (event) => {
    const message = event.data;
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageContainer.append(messageElement);
  });
});
