// ============================================================
// POINT D'ENTRÉE DE L'APPLICATION REACT
// C'est le tout premier fichier qui s'exécute côté client.
// Il démarre l'application et l'attache à la page HTML.
// C'est comme appuyer sur le bouton "démarrer" du site.
// ============================================================

// On importe StrictMode — c'est un outil de développement qui aide à détecter
// les erreurs dans le code (il affiche des avertissements supplémentaires)
import { StrictMode } from 'react'

// createRoot permet de démarrer l'application React dans la page HTML
import { createRoot } from 'react-dom/client'

// On importe le fichier CSS principal avec tous les styles du site
import './index.css'

// On importe le composant principal App qui contient toute l'application
import App from './App.jsx'

// BrowserRouter gère la navigation entre les pages sans recharger le site
// (c'est ce qui permet d'aller de /products à /cart sans recharger la page)
import { BrowserRouter } from 'react-router-dom'

// AppContextProvider est la "boîte à partager" — elle permet à tous les composants
// d'accéder aux données communes (panier, utilisateur, produits, etc.)
import { AppContextProvider } from './context/AppContext.jsx'

// On démarre l'application React dans l'élément HTML avec l'id "root"
// (cet élément se trouve dans le fichier index.html)
createRoot(document.getElementById('root')).render(
  // StrictMode = mode strict pour développement (double vérifications)
  <StrictMode>
    {/* BrowserRouter active la navigation entre pages */}
    <BrowserRouter>
      {/* AppContextProvider rend les données globales accessibles partout */}
      <AppContextProvider>
          {/* App est le composant racine qui contient tout le site */}
          <App />
        </AppContextProvider>
      </BrowserRouter>
  </StrictMode>,
)
