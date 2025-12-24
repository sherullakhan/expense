document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("addExpenseForm");

  if (!form) {
    console.error("Form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alert("Submit clicked"); // 🔥 DEBUG – idhu varanum

    const amount = document.getElementById("amount").value;
    const categoryId = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const receipt = document.getElementById("receipt").files[0];

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("amount", amount);
    formData.append("category_id", categoryId);
    formData.append("description", description);

    if (receipt) {
      formData.append("receipt", receipt);
    }

    try {
      const res = await fetch("/add-expense", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert("Expense added successfully ✅");
        window.location.href = "/dashboard-page";
      } else {
        alert(data.message || "Failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});
