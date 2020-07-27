const profile = document.getElementById("profile");

const updateProfile = (() => {
  const formData = {
    name: document.getElementById("name"),
    zip: document.getElementById("zip"),
    gender: document.getElementById("gender"),
    bio: document.getElementById("bio"),
    edit: document.getElementById("edit"),
    submitBtn: document.getElementById("submitBtn"),
    form: document.getElementById("form"),
    userId: document.getElementById("user-id"),
    // cancel: document.querySelector(".cancel"),
    cancel: document.getElementById("cancel"),
  };

  let {
    name,
    zip,
    gender,
    bio,
    edit,
    submitBtn,
    cancel,
    form,
    userId,
  } = formData;

  const changeUpdateState = (e) => {
    e.preventDefault();
    name.disabled = false;
    zip.disabled = false;
    gender.disabled = false;
    bio.disabled = false;
    edit.style.display = "none";
    cancel.style.display = "block";
    submitBtn.style.display = "block";
  };

  const cancelUpdateState = (e) => {
    e.preventDefault();
    name.disabled = true;
    zip.disabled = true;
    gender.disabled = true;
    bio.disabled = true;
    cancel.style.display = "none";
    edit.style.display = "block";
    submitBtn.style.display = "none";
  };

  const postUpdatedProfile = async (data) => {
    const response = await fetch("http://localhost:4000/users/me/profile/", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.status == "fail") {
      throw new Error(res.message);
    }
    // displayProfile(result);
    return result;
  };

  const postData = (e) => {
    e.preventDefault();
    const updatedProfile = {
      name: name.value,
      zip: zip.value,
      gender: gender.value,
      aboutme: bio.value,
      userId: userId.value,
    };
    postUpdatedProfile(updatedProfile)
      .then((data) => {
        cancel.style.display = "none";
        edit.style.display = "Block";
        submitBtn.style.display = "none";
        name.disabled = true;
        zip.disabled = true;
        gender.disabled = true;
        bio.disabled = true;
        console.log("result is", data);
      })
      .catch((error) => {
        console.log("error is", error.message);
      });
  };

  if (profile) {
    edit.addEventListener("click", changeUpdateState);
    cancel.addEventListener("click", cancelUpdateState);
    form.addEventListener("submit", postData);
  }
})();

var upload = async (data) => {
  const fd = new FormData();
  fd.append("avatar", data);
  const result = await fetch("http://localhost:4000/users/me/avatar/", {
    method: "PATCH",
    body: fd,
  });
  const res = await result.json();

  if (res.status == "fail") {
    throw new Error(res.message);
  }
  return res;
};

if (profile) {
  const avatar = document.getElementById("avatar");
  avatar.addEventListener("change", function (e) {
    console.log(avatar.files);
    e.preventDefault();
    upload(avatar.files[0])
      .then((res) => {
        const img = document.getElementById("profile-pic");
        // img.src = `http://localhost:4000/users/${res._id}/avatar`;
        img.src = `data:image/png;base64,${res.avatar}`;
      })
      .catch((error) => {
        console.log(("error: ", error));
      });
  });
}
