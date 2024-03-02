document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.querySelector(".add-btn");
  const tableBody = document.querySelector("table tbody");

  // Ajoute une écoute sur le tableau pour la suppression de lignes
  tableBody.addEventListener("click", function (e) {
    if (e.target && e.target.matches(".delete-btn")) {
      deleteRow(e.target);
    }
  });

  function addRow() {
    const rowCount = tableBody.rows.length;
    const row = tableBody.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    cell1.innerHTML = rowCount + 1;
    cell2.innerHTML = `<input type="text" class="x" name="x_value_${rowCount}" />`;
    cell3.innerHTML = `<input type="text" class="y" name="y_value_${rowCount}" />`;
    cell4.innerHTML =
      rowCount !== 0
        ? `<button type="button" class="delete-btn">Supprimer</button>`
        : "";
  }

  function deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }

  addBtn.addEventListener("click", function () {
    addRow();
  });

  // Ajoute une ligne initiale
  addRow();
});
