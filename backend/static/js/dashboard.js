// -------------------------------
// ROLE-BASED BUTTON SHOW / HIDE
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");

  // Buttons
  const addBtn = document.getElementById("addExpenseBtn");
  const managerBtn = document.getElementById("managerBtn");
  const adminBtn = document.getElementById("adminBtn");

  // Hide all by default
  if (addBtn) addBtn.style.display = "none";
  if (managerBtn) managerBtn.style.display = "none";
  if (adminBtn) adminBtn.style.display = "none";

  // Show based on role
  if (role === "employee" && addBtn) {
    addBtn.style.display = "block";
  }

  if (role === "manager" && managerBtn) {
    managerBtn.style.display = "block";
  }

  if (role === "admin" && adminBtn) {
    adminBtn.style.display = "block";
  }

  // Load analytics when dashboard opens
  loadAnalytics();

  // 🔄 Auto-refresh analytics every 10 seconds (optional)
  setInterval(loadAnalytics, 10000);
});

// -------------------------------
// ANALYTICS + CHART
// -------------------------------
let expenseChart = null;

function loadAnalytics() {
  fetch("/analytics")
    .then(res => res.json())
    .then(data => {
      console.log("Analytics:", data);

      // Total Expense
      const totalEl = document.getElementById("total");
      if (totalEl) {
        totalEl.innerText = data.total_expense;
      }

      // Category-wise data
      const labels = data.category_wise.map(item => item.category);
      const values = data.category_wise.map(item => item.total);

      const canvas = document.getElementById("chart");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // Destroy old chart (important)
      if (expenseChart) {
        expenseChart.destroy();
      }

      expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              "#3498db",
              "#2ecc71",
              "#f39c12",
              "#e74c3c",
              "#9b59b6"
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    })
    .catch(err => {
      console.error("Dashboard analytics error:", err);
    });
}

// -------------------------------
// LOGOUT
// -------------------------------
function logout() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("role");
  window.location.href = "/login-page";
}
