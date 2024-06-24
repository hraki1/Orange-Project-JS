const storeRegistrationData = (event) => {
  event.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const nameRegex = /^[A-Za-z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!nameRegex.test(firstName)) {
    alert("First Name must contain only alphabets.");
    return false;
  }

  if (!nameRegex.test(lastName)) {
    alert("Last Name must contain only alphabets.");
    return false;
  }

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!passwordRegex.test(password)) {
    alert(
      "Password must be at least 8 characters long and contain at least one letter, one number, and one special character."
    );
    return false;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }
  const userData = {
    firstName,
    lastName,
    email,
    password,
  };

  localStorage.setItem("user", JSON.stringify(userData));
  alert("Registration successful!");
  location.href = "http://127.0.0.1:5500/admin-dashboard.html";
};

const authenticateUser = (event) => {
  event.preventDefault();
  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;

  const storedUserData = JSON.parse(localStorage.getItem("user"));

  if (
    storedUserData &&
    storedUserData.email === loginEmail &&
    storedUserData.password === loginPassword
  ) {
    window.open("admin-dashboard.html", "_self");
    displayUserData(storedUserData);
  } else {
    alert("Invalid email or password.");
  }
};
