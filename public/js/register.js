const initializeRegister = () => {
  document.getElementById("registerForm").addEventListener("submit", (event) => {
      handleRegistration(event);
  });
};

const handleRegistration = async (event) => {
  event.preventDefault();

  const formData = {
      email: event.target.email.value,
      username: event.target.username.value,
      password: event.target.password.value,
      isAdmin: event.target.isAdmin.checked,
  };

  try {
      const response = await fetch("/api/user/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      });

      if (!response.ok) {
          const errorData = await response.json();
          document.getElementById("error").innerText = errorData.error || "Error when trying to register. Please try again.";
      } else {
          window.location.href = "/login.html";
      }
  } catch (error) {
      console.log(`Error while trying to register: ${error.message}`);
      document.getElementById("error").innerText = "An unexpected error occurred. Please try again later.";
  }
};

document.addEventListener("DOMContentLoaded", initializeRegister);
