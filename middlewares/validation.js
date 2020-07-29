exports.registerValidaton = () => {
  return [
    check("email")
      .isEmail()
      .withMessage("please enter a valid email.")
      .custom((value, { req }) => {
        if (value === "admin@yahoo.com") {
          throw new Error("This email address is forbidden.");
        }
        return true;
      }),
    body(
      "password",
      "Please enter a password with only number and text and at least 3 characters."
    )
      .isLength({ min: 3 })
      .isAlphanumeric(),
    body("passwordConfirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ];
};
