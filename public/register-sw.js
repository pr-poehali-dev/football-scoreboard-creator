// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker зарегистрирован:', registration.scope);
        
        // Проверка обновлений каждые 60 секунд
        setInterval(() => {
          registration.update();
        }, 60000);
      })
      .catch((error) => {
        console.error('❌ Ошибка регистрации Service Worker:', error);
      });
  });

  // Обработка обновлений Service Worker
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

// Запрос разрешения на уведомления (опционально)
if ('Notification' in window && Notification.permission === 'default') {
  // Можно запросить позже при первом действии пользователя
}

// Обработка события установки приложения
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Показать кнопку установки приложения
  console.log('💡 Приложение можно установить');
});

window.addEventListener('appinstalled', () => {
  console.log('✅ Приложение установлено');
  deferredPrompt = null;
});
