const accountSwitch = () => {
  const account = document.getElementById("account");
  if (account) {
    account.addEventListener("click", () => {
      const registerForm = document.getElementById("register-form");
      const loginForm = document.getElementById("login-form");
      if (registerForm.classList.contains("active")) {
        registerForm.classList.remove("active");
        loginForm.classList.add("active");
        account.innerText = "You dont Have an Account";
        account.setAttribute("href", "#login");
      } else if (loginForm.classList.contains("active")) {
        loginForm.classList.remove("active");
        registerForm.classList.add("active");
        account.innerText = "Already have an account?";
        account.setAttribute("href", "#register");
      }
    });
  }
};

// hard reload from the server
// const logout = () => {
//   const logoutBtn = document.getElementById("logout");
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", function (e) {
//       console.log("logout");
//       location.href("/");
//       // e.preventDefault();
//     });
//   }
// };

// logout();
// accountSwitch();

const logoutBtn = document.getElementById("logout");

if (!logoutBtn) {
  console.log(logoutBtn);
} else {
  const logout = async () => {
    console.log(logoutBtn);

    await fetch("http://localhost:4000/users/logout", {
      method: "POST",
    })
      .then((e) => {
        console.log("hhhh");
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
