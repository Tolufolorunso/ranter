const profile = document.getElementById("profile");

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
