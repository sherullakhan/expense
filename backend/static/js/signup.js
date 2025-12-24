function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!name || !email || !password) {
    document.getElementById("msg").innerText = "All fields required";
    return;
  }

  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      role: role
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("msg").innerText = data.message;
  });
}
