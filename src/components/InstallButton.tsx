import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Проверяем iOS устройство
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Проверяем, установлено ли приложение
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (!isStandalone && !isIOSStandalone && iOS) {
      setShowInstallButton(true);
    } else if (!isStandalone && !iOS) {
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Пользователь установил приложение');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <>
      <Button
        onClick={handleInstallClick}
        variant="default"
        size="sm"
        className="gap-2 bg-accent hover:bg-accent/90"
      >
        <Icon name="Download" size={16} />
        {isIOS ? 'Установить на iPhone' : 'Установить приложение'}
      </Button>

      {showIOSInstructions && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 p-4"
          onClick={() => setShowIOSInstructions(false)}
        >
          <div 
            className="bg-background rounded-t-3xl p-6 max-w-md w-full animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Установить на iPhone</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowIOSInstructions(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Нажмите кнопку "Поделиться"</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Share" size={18} />
                    <span>внизу экрана в Safari</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Выберите "На экран Домой"</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="PlusSquare" size={18} />
                    <span>в меню действий</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Нажмите "Добавить"</p>
                  <p className="text-muted-foreground">Приложение появится на домашнем экране!</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ Откройте этот сайт в Safari, если используете другой браузер
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}