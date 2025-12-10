// Animación login/signup
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const signupForm = document.querySelector("form.signup");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const wrapper = document.querySelector(".wrapper");

signupBtn.onclick = () => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
    wrapper.classList.add("signup-active");
};
loginBtn.onclick = () => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
    wrapper.classList.remove("signup-active");
};
signupLink.onclick = () => {
    signupBtn.click();
    return false;
};

// Login con fetch y JWT
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok && result.token) {
            // Guardar token en localStorage
            localStorage.setItem("token", result.token);
            // Redirigir a carrito.html
            window.location.href = "/carrito.html";
        } else {
            alert(result.message || "Usuario o contraseña incorrectos");
        }
    } catch (err) {
        console.error(err);
        alert("Error al iniciar sesión");
    }
    
});
// Solicitar permiso para mostrar notificaciones
function requestNotificationPermission() {
  if ("Notification" in window) {
    // Verificar si el navegador soporta notificaciones
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("¡Permiso para notificaciones concedido!");
      } else {
        console.log("Permiso para notificaciones denegado");
      }
    });
  } else {
    alert("Este navegador no soporta notificaciones");
  }
}
function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("¡Nuevo producto en oferta!", {
      body: "¡Aprovecha el descuento en nuestra Laptop Gamer!",
      icon: "/images/laptop.jpg"  // Puedes usar un icono específico
    });
  } else {
    alert("El permiso para notificaciones no ha sido concedido.");
  }
}

