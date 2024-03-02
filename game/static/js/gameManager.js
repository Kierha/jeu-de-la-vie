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

function getMaxSize(cellCoordinates) {
  let maxX = 0;
  let maxY = 0;

  cellCoordinates.forEach((coord) => {
    maxX = Math.max(maxX, coord.x);
    maxY = Math.max(maxY, coord.y);
  });

  // Retourne la plus grande dimension plus 50 comme la taille de la grille
  return Math.max(maxX, maxY) + 50;
}

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
    cell.classList.add("cell"); // Assure-toi que cette classe correspond à celle définie dans ton CSS
    gameGrid.appendChild(cell);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var validateButton = document.querySelector(".validate-btn");
  var ruleSelect = document.querySelector("#rule-select");

  validateButton.addEventListener("click", function () {
    var cellCoordinates = checkCellsAliveTab();

    if (cellCoordinates !== null) {
      // Récupère la règle sélectionnée
      var selectedRuleId = ruleSelect.value;
      var selectedRuleText = ruleSelect.options[ruleSelect.selectedIndex].text;

      // Envoie une requête pour récupérer les détails de la règle sélectionnée
      fetch("/get-rule-details/" + selectedRuleId)
        .then((response) => response.json())
        .then((data) => {
          // Stocke les informations dans le localStorage
          var configName = cellCoordinates.length + "A";
          localStorage.setItem("config_name", configName);

          // Affiche les informations
          console.log(
            `rule_name: ${selectedRuleText}, survival_rules: ${
              data.survival_rules
            }, birth_rules: ${
              data.birth_rules
            }, config_start: ${configName}, cells_alive: ${JSON.stringify(
              cellCoordinates
            )}`
          );
          var maxGridSize = getMaxSize(cellCoordinates);
          console.log(maxGridSize);
          drawGrid(maxGridSize);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des détails de la règle:",
            error
          );
        });
    }
  });
});
