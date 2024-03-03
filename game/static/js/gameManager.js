let turnCount = 0;
let survival_rules = "";
let birth_rules = "";
let isGameStarted = false;
let gameLoopTimeout;

// Fonction pour vérifier les coordonnées des cellules vivantes
function checkCellsAliveTab() {
  var cellCoordinates = [];
  var tableRows = document.querySelectorAll(
    ".cell-table-container table tbody tr"
  );
  var errors = [];
  if (
    tableRows.length <= 1 &&
    tableRows[0].querySelector(".x").value.trim() === "" &&
    tableRows[0].querySelector(".y").value.trim() === ""
  ) {
    alert("Il faut au minimum 1 cellule vivante !");
    return null;
  }

  tableRows.forEach(function (row, index) {
    var x = row.querySelector(".x").value.trim();
    var y = row.querySelector(".y").value.trim();

    if (x === "" && y === "") {
      // Si la ligne est vide, on passe à la suivante sans ajouter les coordonnées
      return;
    } else if (x === "" || y === "") {
      errors.push("La ligne " + (index + 1) + " contient une colonne vide !");
    } else if (isNaN(x) || isNaN(y)) {
      errors.push(
        "La ligne " + (index + 1) + " contient des valeurs non numériques !"
      );
    } else {
      cellCoordinates.push({ x: parseInt(x, 10), y: parseInt(y, 10) });
    }
  });

  if (errors.length > 0) {
    alert("Erreurs :\n" + errors.join("\n"));
    return null;
  }

  return cellCoordinates;
}

//  Retourne la plus grande dimension plus 50 comme la taille de la grille
function getMaxSize(cellCoordinates) {
  let maxX = 0;
  let maxY = 0;

  cellCoordinates.forEach((coord) => {
    maxX = Math.max(maxX, coord.x);
    maxY = Math.max(maxY, coord.y);
  });

  return Math.max(maxX, maxY) + 50;
}

// Dessine une grille de jeu de la taille spécifiée
function drawGrid(gridSize) {
  const gameGrid = document.querySelector(".game-grid");

  // Taille de la grille
  var gridDimensions = "800px";

  // Ajuste les styles CSS pour les colonnes et les rangées de la grille
  gameGrid.style.display = "grid";
  gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  gameGrid.style.width = gridDimensions;
  gameGrid.style.height = gridDimensions;

  // Vide le contenu actuel de la grille
  gameGrid.innerHTML = "";

  // Crée les cellules de la grille
  for (let i = 0; i < gridSize * gridSize; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
  }
}

function placeAliveCells(cellCoordinates, gridSize) {
  const cells = document.querySelectorAll(".game-grid .cell");

  // Initialise toutes les cellules à mortes par défaut
  cells.forEach((cell) => {
    cell.style.backgroundColor = "white"; // Couleur pour les cellules mortes
    cell.setAttribute("value", "0"); // Marque la cellule comme morte
  });

  // Met à jour l'état et la couleur des cellules vivantes
  cellCoordinates.forEach((coord) => {
    const index = coord.y * gridSize + coord.x;
    if (index < cells.length) {
      cells[index].style.backgroundColor = "blue"; // Couleur pour les cellules vivantes
      cells[index].setAttribute("value", "1"); // Marque la cellule comme vivante
    }
  });
}

// Met à jour l'interface utilisateur pour la fin de la partie
function updateEndPanel(validateButton, ruleSelect, addBtn) {
  // Annule la boucle de jeu
  clearTimeout(gameLoopTimeout);
  turnCount = 0;
  // Sélectionne toutes les lignes du tableau sauf la première
  const rows = document.querySelectorAll(
    ".cell-table-container table tbody tr:not(:first-child)"
  );
  const gameGrid = document.querySelector(".game-grid");

  gameGrid.innerHTML = "";
  validateButton.textContent = "Valider";
  validateButton.classList.remove("end-game-style");
  document.getElementById("gameName").textContent = "";
  document.getElementById("ruleName").textContent = "";
  document.getElementById("turnCount").textContent = turnCount;
  ruleSelect.disabled = false;
  addBtn.disabled = false;
  document.querySelectorAll(".cell-table-container input").forEach((input) => {
    input.disabled = false;
  });

  // Supprime chaque ligne sélectionnée
  rows.forEach((row) => row.remove());

  // Vide les inputs de la première ligne
  const firstRowInputs = document.querySelectorAll(
    ".cell-table-container table tbody tr:first-child input"
  );
  firstRowInputs.forEach((input) => {
    input.value = "";
  });

  // Ajoute ou supprime l'écouteur d'événements du bouton "Ajouter" en fonction de l'état du jeu
  if (!isGameStarted) {
    addBtn.addEventListener("click", addBtn);
  } else {
    addBtn.removeEventListener("click", addBtn);
  }
}

// Met à jour l'interface utilisateur pour le début de la partie
function updateStartPanel(
  validateButton,
  addBtn,
  ruleSelect,
  selectedRuleText
) {
  validateButton.textContent = "Fin de partie";
  validateButton.classList.add("end-game-style"); // Classe CSS à définir pour le style en rouge

  // Désactive la sélection de règle et le tableau
  ruleSelect.disabled = true;
  addBtn.disabled = true;
  document.querySelectorAll(".cell-table-container input").forEach((input) => {
    input.disabled = true;
  });

  // Mets à jour les informations de la partie ici
  console.log("Début d'une partie");
  document.getElementById("gameName").textContent =
    localStorage.getItem("config_name");
  document.getElementById("ruleName").textContent = selectedRuleText;
  document.getElementById("turnCount").textContent = turnCount;

  // Supprime l'écouteur d'événements du bouton "Ajouter"
  addBtn.removeEventListener("click", addBtn);
}

function calculateNextState(cellCoordinates, gridSize) {
  console.log("survivalRules: " + survival_rules);
  console.log("birthRules: " + birth_rules);
  const survivalRulesArray = survival_rules.split(",").map(Number);
  const birthRulesArray = birth_rules.split(",").map(Number);

  let newCellCoordinates = [];
  // Parcours chaque cellule de la grille pour déterminer son état futur
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let neighborCount = countNeighbors(x, y, cellCoordinates);
      let isAlive = cellCoordinates.some(
        (coord) => coord.x === x && coord.y === y
      );

      // Applique les règles de survie ou de naissance
      if (isAlive && survivalRulesArray.includes(neighborCount)) {
        newCellCoordinates.push({ x, y });
      } else if (!isAlive && birthRulesArray.includes(neighborCount)) {
        newCellCoordinates.push({ x, y });
      }
    }
  }

  // Retourne les nouvelles coordonnées des cellules vivantes
  return newCellCoordinates;
}

function countNeighbors(x, y, cellCoordinates) {
  let count = 0;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  directions.forEach(([dx, dy]) => {
    if (
      cellCoordinates.some((coord) => coord.x === x + dx && coord.y === y + dy)
    ) {
      count++;
    }
  });

  return count;
}

let previousCellCoordinates = [];

function gameLoop(
  cellCoordinates,
  gridSize,
  survivalRulesStr,
  birthRulesStr,
  validateButton,
  ruleSelect,
  addBtn
) {
  // Convertit les règles en tableaux de nombres
  const survivalRules = survivalRulesStr.split(",").map(Number);
  const birthRules = birthRulesStr.split(",").map(Number);

  // Calcule l'état suivant
  const newCellCoordinates = calculateNextState(
    cellCoordinates,
    gridSize,
    survivalRules,
    birthRules
  );

  // Vérifie si l'état a changé
  if (arraysAreEqual(cellCoordinates, newCellCoordinates)) {
    // Si l'état n'a pas changé, arrêtez le jeu
    alert("Aucune évolution possible.");
    console.log("Aucun changement d'état possible, fin du jeu.");
    updateEndPanel(validateButton, ruleSelect, addBtn);
    return;
  }

  // Mets à jour le nombre de tours dans l'interface utilisateur
  turnCount++;
  document.getElementById("turnCount").textContent = turnCount;

  // Place les cellules vivantes sur la grille
  placeAliveCells(newCellCoordinates, gridSize);

  // Prévoit le prochain appel de la boucle de jeu
  gameLoopTimeout = setTimeout(() => {
    gameLoop(
      newCellCoordinates,
      gridSize,
      survivalRulesStr,
      birthRulesStr,
      validateButton,
      ruleSelect,
      addBtn
    );
  }, 1000);
}

// Fonction utilitaire pour comparer deux tableaux d'objets {x, y}
function arraysAreEqual(arr1, arr2) {
  console.log(arr1.length, arr2.length);
  if (arr1.length !== arr2.length) return false;
  return arr1.every((obj1, index) => {
    const obj2 = arr2[index];
    return obj1.x === obj2.x && obj1.y === obj2.y;
  });
}

// Fonction pour gérer les événements des boutons "Valider", "Ajouter", "Fin de partie"
document.addEventListener("DOMContentLoaded", function () {
  var validateButton = document.querySelector(".validate-btn");
  var ruleSelect = document.querySelector("#rule-select");
  var addBtn = document.querySelector(".add-btn");

  validateButton.addEventListener("click", function () {
    var cellCoordinates = checkCellsAliveTab();
    if (!isGameStarted) {
      if (cellCoordinates !== null) {
        // Récupère la règle sélectionnée
        var selectedRuleId = ruleSelect.value;
        var selectedRuleText =
          ruleSelect.options[ruleSelect.selectedIndex].text;

        // Envoie une requête pour récupérer les détails de la règle sélectionnée
        fetch("/get-rule-details/" + selectedRuleId)
          .then((response) => response.json())
          .then((data) => {
            isGameStarted = true;
            // Stocke les informations dans le localStorage
            var configName = cellCoordinates.length + "A";
            localStorage.setItem("config_name", configName);
            survival_rules = data.survival_rules;
            birth_rules = data.birth_rules;

            var maxGridSize = getMaxSize(cellCoordinates);
            drawGrid(maxGridSize);
            placeAliveCells(cellCoordinates, maxGridSize);

            updateStartPanel(
              validateButton,
              addBtn,
              ruleSelect,
              selectedRuleText
            );
            gameLoop(
              cellCoordinates,
              maxGridSize,
              survival_rules,
              birth_rules,
              validateButton,
              ruleSelect,
              addBtn
            );
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la récupération des détails de la règle:",
              error
            );
          });
      }
    } else {
      // Réinitialise pour une nouvelle partie
      isGameStarted = false;
      updateEndPanel(validateButton, ruleSelect, addBtn);
    }
  });
});
