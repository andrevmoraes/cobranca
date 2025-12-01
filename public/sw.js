const CACHE_NAME = 'cobranca-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
]

// Instalação do service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto')
        return cache.addAll(urlsToCache)
      })
  )
})

// Ativação do service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna da cache
        if (response) {
          return response
        }
        
        // Clone da requisição
        const fetchRequest = event.request.clone()
        
        return fetch(fetchRequest).then((response) => {
          // Verifica se recebeu uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          // Clone da resposta
          const responseToCache = response.clone()
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        })
      })
  )
})

// Gerenciar notificações
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { titulo, opcoes } = event.data
    self.registration.showNotification(titulo, opcoes)
  }
})

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})
