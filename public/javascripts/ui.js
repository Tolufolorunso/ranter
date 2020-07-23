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
accountSwitch();

// const logoutBtn = document.getElementById("logout");

const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    await fetch("http://localhost:4000/users/logout", {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status == "success") location.reload(true);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
const form = document.getElementById("login-form");

const login = async (data) => {
  const loginResponse = await fetch("http://localhost:4000/users/login/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await loginResponse.json();
  if (json.status == "fail") {
    throw new Error(json.message);
  }
  return json;
};

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formObj = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    login(formObj)
      .then((res) => {
        alert("logined");
        window.setTimeout(() => {
          location.assign("/ranter/newsfeed");
        }, 1500);
      })
      .catch((error) => {
        console.log(("error: ", error));
      });
  });
}
const chatbox = document.querySelector(".chatbox");

window.addEventListener("scroll", function (e) {
  console.log(window.pageYOffset);
  if (window.pageYOffset > 446) {
    chatbox.classList.add("is_stuck");
  }
  if (window.pageYOffset < 446) {
    chatbox.classList.remove("is_stuck");
  }
});
