function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message === "Login successful") {
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("role", data.user.role); 
      window.location.href = "/dashboard-page";

    } else {
      document.getElementById("msg").innerText = data.message;
    }
  });
}
