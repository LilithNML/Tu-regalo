// data.js - Regalos codificados con seguridad básica

const GIFTS_DATA = [
  // Ejemplo de 5 regalos (puedes agregar más, hasta 100)
  {
    code: "amor2025", // código secreto
    type: "text",
    content: "VGVxdWllcm8gbWkgYW1vciwgdGVzIGVzdGUgbWVuc2FqZSBwZXJzb25hbGl6YWRvOiBOb3RyYSBoaXN0b3JpYSBlcyB1biBsaWJybyBkZSBhbW9yIGluZmluaXRvLg==", // Base64
    meta: { title: "Carta para Ti" }
  },
  {
    code: "estrella",
    type: "image",
    content: "YXNzZXRzL2VzdHJlbGxhLmpwZw==", // assets/estrella.jpg
    meta: { alt: "Una estrella para ti" }
  },
  {
    code: "musica",
    type: "audio",
    content: "YXNzZXRzL2NhbnRpb24ubXAz", // assets/cantion.mp3
    meta: { title: "Nuestra canción" }
  },
  {
    code: "video1",
    type: "video",
    content: "YXNzZXRzL3ZpZGVvLm1wNA==", // CORREGIDO: De .jpg a .mp4 para que el video funcione
    meta: { title: "Un Recuerdo Juntos" }
  },
  {
    code: "poema",
    type: "download",
    content: "YXNzZXRzL3BvZW1hLnBkZg==", // assets/poema.pdf
    meta: { title: "Poema Descargable" }
  }
  // ... hasta 100 regalos
];

