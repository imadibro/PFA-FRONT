# 📁 Structure des composants de Layout

## 📂 Organisation

```
src/components/layout/
├── auth/                    # Composants d'authentification
│   └── AuthIllustrationV1Wrapper.tsx
├── horizontal/              # Layout horizontal
│   ├── Footer.tsx
│   ├── FooterContent.tsx
│   ├── Header.tsx
│   ├── HorizontalMenu.tsx
│   ├── NavToggle.tsx
│   ├── NavbarContent.tsx
│   ├── Navigation.tsx
│   └── VerticalNavContent.tsx
├── vertical/                # Layout vertical
│   ├── Footer.tsx
│   ├── FooterContent.tsx
│   ├── NavToggle.tsx
│   ├── Navbar.tsx
│   ├── NavbarContent.tsx
│   ├── Navigation.tsx
│   └── VerticalMenu.tsx
└── shared/                  # Composants partagés
    ├── DrawerForm.tsx
    ├── Logo.tsx
    ├── ModeDropdown.tsx
    └── UserDropdown.tsx
```

## 🎯 Utilisation

### Auth Components

- **AuthIllustrationV1Wrapper** : Wrapper pour les pages de login/register avec illustrations décoratives

### Horizontal Layout

- **Header** : En-tête du layout horizontal
- **Footer** : Pied de page du layout horizontal
- **HorizontalMenu** : Menu de navigation horizontal
- **Navigation** : Composant de navigation principal

### Vertical Layout

- **Navigation** : Menu de navigation vertical (sidebar)
- **Navbar** : Barre de navigation supérieure
- **Footer** : Pied de page du layout vertical
- **VerticalMenu** : Menu vertical avec items et sous-menus

### Shared Components

- **Logo** : Logo de l'application avec animation
- **UserDropdown** : Menu déroulant utilisateur (profil, déconnexion)
- **ModeDropdown** : Sélecteur de thème (light/dark/system)
- **DrawerForm** : Formulaire dans un drawer

## 📝 Import Examples

```typescript
// Auth
import AuthIllustrationV1Wrapper from '@components/layout/auth/AuthIllustrationV1Wrapper'

// Horizontal
import Header from '@components/layout/horizontal/Header'
import Footer from '@components/layout/horizontal/Footer'

// Vertical
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'

// Shared
import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'
```

## ✅ Migration complétée

Tous les composants de layout sont maintenant centralisés dans `src/components/layout/`.
Les anciens composants de `src/@layouts/components/` ont été déplacés ou supprimés.
