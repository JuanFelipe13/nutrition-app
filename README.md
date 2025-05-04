# NutriSearch - Aplicación Móvil de Nutrición

Esta es una aplicación móvil desarrollada con React Native y Expo que permite buscar información nutricional de alimentos a través de texto, imagen o código de barras.

## Características

- Búsqueda de alimentos por nombre
- Captura de fotos para identificar alimentos y obtener información nutricional
- Escaneo de códigos de barras de productos
- Visualización detallada de información nutricional
- Interfaz amigable y responsiva para dispositivos móviles

## Requisitos previos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI

## Instalación

1. Clona este repositorio
2. Navega a la carpeta del proyecto: `cd nutrition-app`
3. Instala las dependencias: `npm install` o `yarn install`

## Ejecución

Para iniciar la aplicación en modo desarrollo:

```bash
npm start
# o
npx expo start
```

Esto iniciará el servidor de desarrollo de Expo. Puedes ejecutar la aplicación en:

- Dispositivo físico: Escanea el código QR con la app Expo Go (Android) o con la cámara (iOS)
- Emulador: Presiona 'a' para Android o 'i' para iOS en la terminal
- Web: Presiona 'w' para abrir en el navegador

## Configuración del Backend

La aplicación está configurada para conectarse a un backend en `http://localhost:8001/api/v1`. Si el backend se encuentra en otra dirección, debes modificar el archivo `src/constants/api.ts`.

## Estructura del proyecto

```
nutrition-app/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── constants/        # Constantes y configuración
│   ├── navigation/       # Configuración de navegación
│   ├── screens/          # Pantallas de la aplicación
│   ├── services/         # Servicios y llamadas a API
│   └── types/            # Definiciones de tipos
├── assets/               # Imágenes y recursos
├── App.tsx               # Componente principal
└── ...                   # Archivos de configuración
```

## Desarrollo

Para agregar nuevas características o modificar las existentes, consulta la documentación de:

- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Native Paper](https://callstack.github.io/react-native-paper/) 