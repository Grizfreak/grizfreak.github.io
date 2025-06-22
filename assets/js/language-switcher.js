document.addEventListener('DOMContentLoaded', function() {
    
    let typedInstance = null;
    const langToggle = document.getElementById('langToggle');
    const langToggleText = document.getElementById('langToggleText');

    const setLanguage = (lang) => {
      document.documentElement.lang = lang;
      
      document.querySelectorAll('[data-i18n-key]').forEach(elem => {
        const key = elem.getAttribute('data-i18n-key');
        let translation = translations[lang][key] || translations['en'][key];
        
        if (elem.hasAttribute('data-i18n-vars')) {
            const vars = JSON.parse(elem.getAttribute('data-i18n-vars'));
            Object.keys(vars).forEach(varKey => {
                translation = translation.replace(`{${varKey}}`, vars[varKey]);
            });
        }
        
        elem.innerHTML = translation;
      });

      document.querySelectorAll('[data-i18n-list]').forEach(ul => {
        const key = ul.getAttribute('data-i18n-list');
        const items = translations[lang][key] || translations['en'][key];
        if (items && Array.isArray(items)) {
          ul.innerHTML = '';
          items.forEach(itemText => {
            const li = document.createElement('li');
            li.innerHTML = itemText;
            ul.appendChild(li);
          });
        }
      });
      
      document.querySelectorAll('[data-i18n-title]').forEach(elem => {
        const key = elem.getAttribute('data-i18n-title');
        elem.setAttribute('title', translations[lang][key] || translations['en'][key]);
      });

      const typedElement = document.querySelector('[data-i18n-typed]');
      if (typedElement) {
        const key = typedElement.getAttribute('data-i18n-typed');
        const newStrings = translations[lang][key] || translations['en'][key];
        typedElement.setAttribute('data-typed-items', newStrings);
        
        if (typedInstance) {
          typedInstance.destroy();
        }
        
        const typedContainer = document.querySelector('.typed');
        if (typedContainer) {
            typedContainer.innerHTML = ''; 
        }

        typedInstance = new Typed('.typed', {
          strings: newStrings.split(','),
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000,
          loop: true
        });
      }

      localStorage.setItem('language', lang);
      langToggleText.textContent = lang === 'en' ? 'FR' : 'EN';
      
      if (typeof initGLightbox === 'function') {
        initGLightbox();
      }
    };

    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentLang = localStorage.getItem('language') || 'en';
      const newLang = currentLang === 'en' ? 'fr' : 'en';
      setLanguage(newLang);
    });

    // Set initial language
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (translations[browserLang] ? browserLang : 'en');
    setLanguage(initialLang);
  }); 