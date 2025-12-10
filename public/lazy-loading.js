// public/js/lazy-loading.js

// Configuración del IntersectionObserver
const lazyLoadConfig = {
    rootMargin: '100px 0px', // Cargar 100px antes de que sea visible
    threshold: 0.01,
    fallbackDelay: 200 // ms para el fallback
};

// Función principal de lazy loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src].lazy');
    
    if (images.length === 0) {
        console.log('No se encontraron imágenes con lazy loading');
        return;
    }
    
    console.log(`Iniciando lazy loading para ${images.length} imágenes`);
    
    // Verificar soporte de IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver no soportado, cargando todas las imágenes');
        loadAllImages(images);
        return;
    }
    
    // Crear el observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, lazyLoadConfig);
    
    // Observar cada imagen
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Fallback: cargar imágenes que no se hayan cargado después de un tiempo
    setTimeout(() => {
        images.forEach(img => {
            if (img.classList.contains('lazy') && img.dataset.src) {
                console.log('Fallback: cargando imagen', img.dataset.src);
                loadImage(img);
            }
        });
    }, lazyLoadConfig.fallbackDelay);
}

// Función para cargar una imagen individual
function loadImage(imgElement) {
    if (!imgElement.dataset.src) return;
    
    const src = imgElement.dataset.src;
    
    console.log(`Cargando imagen: ${src}`);
    
    // Pre-cargar la imagen
    const tempImg = new Image();
    
    tempImg.onload = () => {
        // Cuando la imagen se carga exitosamente
        imgElement.src = src;
        imgElement.classList.remove('lazy');
        imgElement.classList.add('loaded');
        
        // Disparar evento personalizado
        imgElement.dispatchEvent(new CustomEvent('lazyloaded', {
            detail: { src: src }
        }));
        
        console.log(`✅ Imagen cargada: ${src}`);
    };
    
    tempImg.onerror = () => {
        // Manejar error de carga
        console.error(`❌ Error al cargar imagen: ${src}`);
        imgElement.classList.remove('lazy');
        imgElement.classList.add('error');
        
        // Usar imagen de fallback si está definida
        if (imgElement.dataset.fallback) {
            imgElement.src = imgElement.dataset.fallback;
        }
    };
    
    // Iniciar la carga
    tempImg.src = src;
}

// Función para cargar todas las imágenes (fallback)
function loadAllImages(images) {
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        }
    });
}

// Función para observar nuevas imágenes dinámicas
function observeNewImages(container = document) {
    const newImages = container.querySelectorAll('img[data-src].lazy:not([data-observed])');
    
    newImages.forEach(img => {
        img.setAttribute('data-observed', 'true');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, lazyLoadConfig);
            
            observer.observe(img);
        } else {
            loadImage(img);
        }
    });
}

// Exportar funciones para uso global
window.lazyLoadModule = {
    lazyLoadImages,
    loadImage,
    observeNewImages,
    loadAllImages
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// También inicializar cuando la página se cargue completamente
window.addEventListener('load', () => {
    // Revisar imágenes que pudieron no detectarse antes
    setTimeout(lazyLoadImages, 500);
});