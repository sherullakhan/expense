fetch("/pending-expenses")
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("expenseTable");

    data.forEach(exp => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${exp.id}</td>
        <td>${exp.user_id}</td>
        <td>₹${exp.amount}</td>
        <td>${exp.category}</td>
        <td>${exp.description || ""}</td>
        <td>
          <button onclick="updateStatus(${exp.id}, 'approved')">Approve</button>
          <button onclick="updateStatus(${exp.id}, 'rejected')">Reject</button>
        </td>
      `;

      table.appendChild(row);
    });
  });

function updateStatus(id, status) {
  fetch("/update-expense-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      expense_id: id,
      status: status
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    location.reload();
  });
}
