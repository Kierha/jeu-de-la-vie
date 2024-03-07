document.addEventListener("DOMContentLoaded", () => {
  var socket = new WebSocket("ws://localhost:8765");
  const username = localStorage.getItem("username") || "Anonyme";

  const messageForm = document.querySelector(".chat-input");
  const messageInput = messageForm.querySelector("input");
  const messageContainer = document.querySelector(".chat-messages");
  const sendButton = document.querySelector(".send-btn");

  sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    const messageToSend = username + ": " + message;
    // Si message commence par un "/", c'est une commande
    if (message.startsWith("/")) {
      // Utiliser une expression régulière pour extraire la commande et les arguments
      const regex = /^\/(\d+)A$/; // Recherche d'un chiffre suivi de la lettre 'A'
      const match = message.match(regex);
      
      if (match) {
        // Extraire la valeur numérique de la commande
        const value = parseInt(match[1], 10);
        
        // Gérer la commande spécifique avec la valeur dynamique
        // Par exemple, vous pouvez lancer un vote pour modifier la règle de naissance
        const voteMessage = `Vote lancé pour modifier la règle de naissance à ${value} alives.`;
        const voteElement = document.createElement("div");
        voteElement.innerText = voteMessage;
        messageContainer.append(voteElement);
      } else {
        // Si la commande n'est pas reconnue, afficher un message d'erreur dans le tchat
        const errorMessage = "Commande non reconnue. Veuillez utiliser un format valide, par exemple '/5A'.";
        const errorElement = document.createElement("div");
        errorElement.innerText = errorMessage;
        messageContainer.append(errorElement);
      }
    } else {
    socket.send(messageToSend);
    messageInput.value = "";
    }
  });

  socket.addEventListener("message", (event) => {
    const message = event.data;
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageContainer.append(messageElement);

    // Vérifier si le message commence par '/'
    if (message.startsWith("/")) {
      // Utiliser une expression régulière pour extraire la commande et les arguments
      const regex = /^\/(\d+)A$/; // Recherche d'un chiffre suivi de la lettre 'A'
      const match = message.match(regex);
      
      if (match) {
        // Extraire la valeur numérique de la commande
        const value = parseInt(match[1], 10);
        
        // Gérer la commande spécifique avec la valeur dynamique
        // Par exemple, vous pouvez lancer un vote pour modifier la règle de naissance
        const voteMessage = `Vote lancé pour modifier la règle de naissance à ${value} alives.`;
        const voteElement = document.createElement("div");
        voteElement.innerText = voteMessage;
        messageContainer.append(voteElement);
      } else {
        // Si la commande n'est pas reconnue, afficher un message d'erreur dans le tchat
        const errorMessage = "Commande non reconnue. Veuillez utiliser un format valide, par exemple '/5A'.";
        const errorElement = document.createElement("div");
        errorElement.innerText = errorMessage;
        messageContainer.append(errorElement);
      }
    }
  });
});
