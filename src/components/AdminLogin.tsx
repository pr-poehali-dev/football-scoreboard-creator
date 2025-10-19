import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminLoginProps {
  isAdmin: boolean;
  showAdminLogin: boolean;
  setShowAdminLogin: (show: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  handleAdminLogin: () => void;
  handleAdminLogout: () => void;
}

export const AdminLogin = ({
  isAdmin,
  showAdminLogin,
  setShowAdminLogin,
  password,
  setPassword,
  handleAdminLogin,
  handleAdminLogout,
}: AdminLoginProps) => {
  return (
    <div className="flex justify-end mb-4">
      {!isAdmin ? (
        <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Icon name="Lock" size={16} className="mr-2" />
              Режим редактирования
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Вход в режим редактирования</DialogTitle>
              <DialogDescription>
                Введите пароль для доступа к редактированию
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Пароль</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="Введите пароль"
                />
              </div>
              <Button onClick={handleAdminLogin} className="w-full">
                Войти
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdminLogout}
        >
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти
        </Button>
      )}
    </div>
  );
};
