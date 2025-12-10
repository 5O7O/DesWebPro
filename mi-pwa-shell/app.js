class AppShell {
  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    window.addEventListener('hashchange', () => this.handleNavigation());
    this.handleNavigation();
  }

  handleNavigation() {
    const route = window.location.hash || '#home';  // Si no hay hash, default a 'home'
    const contentArea = document.getElementById('contenido-principal');
    
    if (route === '#home') {
      contentArea.innerHTML = '<h2>Bienvenidos a la Tienda</h2>';
    } else if (route === '#productos') {
      contentArea.innerHTML = '<h2>Productos Disponibles</h2>';
    } else if (route === '#carrito') {
      contentArea.innerHTML = '<h2>Tu Carrito</h2>';
    }
  }
}

// Crear una nueva instancia de la app para inicializar
new AppShell();
