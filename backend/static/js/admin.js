// -------------------
// LOAD USERS
// -------------------
fetch("/admin/users")
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById("users");
    ul.innerHTML = "";

    data.forEach(u => {
      const li = document.createElement("li");
      li.innerText = `${u.id} - ${u.name} (${u.email}) [${u.role}]`;
      ul.appendChild(li);
    });
  });

// -------------------
// LOAD EXPENSES
// -------------------
fetch("/admin/expenses")
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById("expenses");
    ul.innerHTML = "";

    data.forEach(e => {
      const li = document.createElement("li");
      li.innerText =
        `#${e.id} | User ${e.user_id} | ₹${e.amount} | ${e.category} | ${e.status}`;
      ul.appendChild(li);
    });
  });
