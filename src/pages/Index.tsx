import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type Screen = 'login' | 'main' | 'card-type' | 'payment-system' | 'card-variant';
type CardType = 'plastic' | 'virtual';
type PaymentSystem = 'mastercard' | 'visa' | 'mir';
type CardVariant = 'debit' | 'credit' | 'child' | 'youth' | 'super-credit';

interface BankCard {
  id: string;
  type: CardType;
  paymentSystem: PaymentSystem;
  variant: CardVariant;
  number: string;
  fullNumber: string;
  cvv: string;
  expiryDate: string;
  customName?: string;
  isBlocked: boolean;
  limit?: number;
}

interface Transaction {
  id: string;
  name: string;
  amount: number;
  icon: string;
  color: string;
  date: string;
}

interface FamilyMember {
  phone: string;
  name: string;
}

interface UserData {
  phone: string;
  name: string;
  email?: string;
  balance: number;
  cards: BankCard[];
  transactions: Transaction[];
  familyCode?: string;
  familyMembers: FamilyMember[];
  isPremium: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [screen, setScreen] = useState<Screen>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  
  const [tempCardType, setTempCardType] = useState<CardType | null>(null);
  const [tempPaymentSystem, setTempPaymentSystem] = useState<PaymentSystem | null>(null);

  const [familyAction, setFamilyAction] = useState<'view' | 'create' | 'join'>('view');
  const [joinCode, setJoinCode] = useState('');

  const [selectedCard, setSelectedCard] = useState<BankCard | null>(null);
  const [cardMenuOpen, setCardMenuOpen] = useState(false);
  const [editingCardName, setEditingCardName] = useState('');
  const [cardLimit, setCardLimit] = useState('');

  const [transferType, setTransferType] = useState<'own' | 'card' | 'phone' | 'bank'>('own');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTarget, setTransferTarget] = useState('');
  const [transferFromCard, setTransferFromCard] = useState('');

  const [editProfile, setEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`user_${currentUser.phone}`, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const handleLogin = () => {
    if (phone && name) {
      const savedData = localStorage.getItem(`user_${phone}`);
      
      if (savedData) {
        const userData = JSON.parse(savedData);
        setCurrentUser(userData);
        setName(userData.name);
      } else {
        const newUser: UserData = {
          phone,
          name,
          balance: 0,
          cards: [],
          transactions: [],
          familyMembers: [],
          isPremium: false
        };
        setCurrentUser(newUser);
        localStorage.setItem(`user_${phone}`, JSON.stringify(newUser));
      }
      
      setScreen('main');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPhone('');
    setName('');
    setScreen('login');
    setActiveTab('main');
  };

  const handleDeleteAccount = () => {
    if (currentUser && confirm('Вы уверены, что хотите удалить аккаунт? Все данные будут потеряны.')) {
      localStorage.removeItem(`user_${currentUser.phone}`);
      handleLogout();
      toast({
        title: "Аккаунт удалён",
        description: "Ваши данные успешно удалены"
      });
    }
  };

  const handleSaveProfile = () => {
    if (!currentUser) return;

    const oldPhone = currentUser.phone;
    const updatedUser = {
      ...currentUser,
      name: editName || currentUser.name,
      phone: editPhone || currentUser.phone,
      email: editEmail || currentUser.email
    };

    if (oldPhone !== updatedUser.phone) {
      localStorage.removeItem(`user_${oldPhone}`);
    }

    setCurrentUser(updatedUser);
    localStorage.setItem(`user_${updatedUser.phone}`, JSON.stringify(updatedUser));
    setEditProfile(false);
    
    toast({
      title: "Профиль обновлён",
      description: "Ваши данные успешно сохранены"
    });
  };

  const handleCardTypeSelect = (type: CardType) => {
    setTempCardType(type);
    setScreen('payment-system');
  };

  const handlePaymentSystemSelect = (system: PaymentSystem) => {
    setTempPaymentSystem(system);
    setScreen('card-variant');
  };

  const handleCardVariantSelect = (variant: CardVariant) => {
    if (!currentUser || !tempCardType || !tempPaymentSystem) return;

    const lastDigits = Math.floor(1000 + Math.random() * 9000);
    const fullNumber = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${lastDigits}`;

    const newCard: BankCard = {
      id: Date.now().toString(),
      type: tempCardType,
      paymentSystem: tempPaymentSystem,
      variant: variant,
      number: `•••• •••• •••• ${lastDigits}`,
      fullNumber: fullNumber,
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      expiryDate: '12/28',
      isBlocked: false
    };

    setCurrentUser({
      ...currentUser,
      cards: [...currentUser.cards, newCard]
    });

    setTempCardType(null);
    setTempPaymentSystem(null);
    setScreen('main');
    setActiveTab('cards');
    
    toast({
      title: "Карта оформлена!",
      description: "Ваша новая карта готова к использованию"
    });
  };

  const openCardMenu = (card: BankCard) => {
    setSelectedCard(card);
    setEditingCardName(card.customName || '');
    setCardLimit(card.limit?.toString() || '');
    setCardMenuOpen(true);
  };

  const handleBlockCard = () => {
    if (!currentUser || !selectedCard) return;

    const updatedCards = currentUser.cards.map(c =>
      c.id === selectedCard.id ? { ...c, isBlocked: !c.isBlocked } : c
    );

    setCurrentUser({ ...currentUser, cards: updatedCards });
    setSelectedCard({ ...selectedCard, isBlocked: !selectedCard.isBlocked });
    
    toast({
      title: selectedCard.isBlocked ? "Карта разблокирована" : "Карта заблокирована",
      description: selectedCard.isBlocked ? "Карта снова активна" : "Операции по карте приостановлены"
    });
  };

  const handleDeleteCard = () => {
    if (!currentUser || !selectedCard) return;

    if (confirm('Вы уверены, что хотите удалить карту?')) {
      const updatedCards = currentUser.cards.filter(c => c.id !== selectedCard.id);
      setCurrentUser({ ...currentUser, cards: updatedCards });
      setCardMenuOpen(false);
      
      toast({
        title: "Карта удалена",
        description: "Карта успешно удалена из вашего аккаунта"
      });
    }
  };

  const handleRenameCard = () => {
    if (!currentUser || !selectedCard) return;

    const updatedCards = currentUser.cards.map(c =>
      c.id === selectedCard.id ? { ...c, customName: editingCardName } : c
    );

    setCurrentUser({ ...currentUser, cards: updatedCards });
    setSelectedCard({ ...selectedCard, customName: editingCardName });
    
    toast({
      title: "Название изменено",
      description: "Карта успешно переименована"
    });
  };

  const handleSetLimit = () => {
    if (!currentUser || !selectedCard) return;

    const limit = cardLimit ? parseInt(cardLimit) : undefined;
    const updatedCards = currentUser.cards.map(c =>
      c.id === selectedCard.id ? { ...c, limit } : c
    );

    setCurrentUser({ ...currentUser, cards: updatedCards });
    setSelectedCard({ ...selectedCard, limit });
    
    toast({
      title: limit ? "Лимит установлен" : "Лимит снят",
      description: limit ? `Лимит: ${limit.toLocaleString()} ₽` : "Лимит по карте снят"
    });
  };

  const handleTransfer = () => {
    if (!currentUser || !transferAmount || !transferFromCard) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const amount = parseInt(transferAmount);
    if (amount <= 0 || amount > currentUser.balance) {
      toast({
        title: "Ошибка",
        description: "Недостаточно средств или неверная сумма",
        variant: "destructive"
      });
      return;
    }

    let transactionName = '';
    let targetName = '';

    if (transferType === 'own') {
      transactionName = 'Перевод между счетами';
      targetName = 'На свою карту';
    } else if (transferType === 'card') {
      transactionName = 'Перевод по номеру карты';
      targetName = transferTarget;
    } else if (transferType === 'phone') {
      transactionName = 'Перевод по номеру телефона';
      targetName = transferTarget;
    } else if (transferType === 'bank') {
      transactionName = 'Перевод в другой банк';
      targetName = transferTarget;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name: transactionName,
      amount: -amount,
      icon: 'Send',
      color: 'from-accent to-secondary',
      date: new Date().toLocaleString('ru-RU', { 
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance - amount,
      transactions: [newTransaction, ...currentUser.transactions]
    });

    setTransferAmount('');
    setTransferTarget('');
    setTransferFromCard('');

    toast({
      title: "Перевод выполнен",
      description: `${amount.toLocaleString()} ₽ → ${targetName}`
    });
  };

  const activatePremium = () => {
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      isPremium: true
    });

    setShowPremium(false);

    toast({
      title: "🎉 Добро пожаловать в Премиум!",
      description: "Все привилегии активированы"
    });
  };

  const generateFamilyCode = () => {
    if (!currentUser) return;
    
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCurrentUser({
      ...currentUser,
      familyCode: code
    });
    
    toast({
      title: "Код семьи создан!",
      description: `Поделитесь кодом: ${code}`
    });
  };

  const handleJoinFamily = () => {
    if (!currentUser || !joinCode) return;

    const allUsers = Object.keys(localStorage)
      .filter(key => key.startsWith('user_'))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}'));

    const familyOwner = allUsers.find((user: UserData) => user.familyCode === joinCode.toUpperCase());

    if (familyOwner) {
      const updatedOwner = {
        ...familyOwner,
        familyMembers: [
          ...familyOwner.familyMembers,
          { phone: currentUser.phone, name: currentUser.name }
        ]
      };
      localStorage.setItem(`user_${familyOwner.phone}`, JSON.stringify(updatedOwner));

      setCurrentUser({
        ...currentUser,
        familyCode: joinCode.toUpperCase()
      });

      setJoinCode('');
      setFamilyAction('view');
      
      toast({
        title: "Вы вступили в семью!",
        description: `Теперь вы часть семьи ${familyOwner.name}`
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Неверный код семьи",
        variant: "destructive"
      });
    }
  };

  const getFamilyData = () => {
    if (!currentUser?.familyCode) return [];

    const allUsers = Object.keys(localStorage)
      .filter(key => key.startsWith('user_'))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}'));

    return allUsers.filter((user: UserData) => 
      user.familyCode === currentUser.familyCode || user.phone === currentUser.phone
    );
  };

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-lg border-border/50 animate-scale-in">
          <CardContent className="pt-8 pb-8 px-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <Icon name="Landmark" size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Юган Банк
              </h1>
              <p className="text-muted-foreground mt-2">Ваш современный банк</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground/80 mb-2 block">Номер телефона</label>
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground/80 mb-2 block">Ваше имя</label>
                <Input
                  type="text"
                  placeholder="Введите имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity text-white font-semibold py-6 text-lg"
              >
                Войти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (screen === 'card-type') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 p-4">
        <div className="max-w-2xl mx-auto pt-8 animate-fade-in">
          <Button
            onClick={() => setScreen('main')}
            variant="ghost"
            className="mb-6 text-foreground/80"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>

          <h2 className="text-3xl font-bold mb-8">Выберите вид карты</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              onClick={() => handleCardTypeSelect('plastic')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-primary/10 border-2 border-transparent hover:border-primary"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="CreditCard" size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Пластиковая карта</h3>
                <p className="text-muted-foreground">Физическая карта с доставкой</p>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleCardTypeSelect('virtual')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-accent/10 border-2 border-transparent hover:border-accent"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                  <Icon name="Smartphone" size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Виртуальная карта</h3>
                <p className="text-muted-foreground">Моментальный выпуск</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'payment-system') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 p-4">
        <div className="max-w-2xl mx-auto pt-8 animate-fade-in">
          <Button
            onClick={() => setScreen('card-type')}
            variant="ghost"
            className="mb-6 text-foreground/80"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>

          <h2 className="text-3xl font-bold mb-8">Платёжная система</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              onClick={() => handlePaymentSystemSelect('mastercard')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-accent/10 border-2 border-transparent hover:border-accent"
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">💳</div>
                <h3 className="text-xl font-bold">Mastercard</h3>
              </CardContent>
            </Card>

            <Card
              onClick={() => handlePaymentSystemSelect('visa')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-primary/10 border-2 border-transparent hover:border-primary"
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-xl font-bold">Visa</h3>
              </CardContent>
            </Card>

            <Card
              onClick={() => handlePaymentSystemSelect('mir')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-secondary/10 border-2 border-transparent hover:border-secondary"
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold">МИР</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'card-variant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 p-4">
        <div className="max-w-3xl mx-auto pt-8 animate-fade-in">
          <Button
            onClick={() => setScreen('payment-system')}
            variant="ghost"
            className="mb-6 text-foreground/80"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>

          <h2 className="text-3xl font-bold mb-8">Тип карты</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              onClick={() => handleCardVariantSelect('debit')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-primary/10 border-2 border-transparent hover:border-primary"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Дебетовая</h3>
                <p className="text-muted-foreground">Для повседневных покупок</p>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleCardVariantSelect('credit')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-accent/10 border-2 border-transparent hover:border-accent"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Кредитная</h3>
                <p className="text-muted-foreground">До 100 дней без процентов</p>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleCardVariantSelect('child')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-secondary/10 border-2 border-transparent hover:border-secondary"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Детская</h3>
                <p className="text-muted-foreground">Для детей от 6 лет</p>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleCardVariantSelect('youth')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-primary/10 border-2 border-transparent hover:border-primary"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Молодёжная</h3>
                <p className="text-muted-foreground">Кэшбэк и бонусы</p>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleCardVariantSelect('super-credit')}
              className="cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-card to-accent/10 border-2 border-transparent hover:border-accent col-span-1 md:col-span-2"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Супер-кредит-карта</h3>
                <p className="text-muted-foreground">Увеличенный лимит и привилегии</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20">
      <div className="max-w-6xl mx-auto p-4 pb-24">
        <div className="flex justify-between items-center mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Юган Банк
            </h1>
            <p className="text-muted-foreground mt-1">Добро пожаловать, {currentUser.name}</p>
          </div>
          <div className="flex gap-2">
            {currentUser.isPremium && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
                onClick={() => setShowPremium(true)}
              >
                <span className="font-bold">П</span>
              </Button>
            )}
            {!currentUser.isPremium && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full border border-amber-500/50"
                onClick={() => setShowPremium(true)}
              >
                <span className="font-bold text-amber-500">П</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Bell" size={24} />
            </Button>
          </div>
        </div>

        {activeTab === 'main' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-gradient-to-br from-primary via-secondary to-accent text-white border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <CardContent className="p-6 relative z-10">
                <p className="text-white/80 mb-2">Общий баланс</p>
                <h2 className="text-4xl font-bold mb-4">{currentUser.balance.toLocaleString()} ₽</h2>
                <div className="flex gap-4">
                  <div>
                    <p className="text-white/60 text-sm">Карт</p>
                    <p className="text-lg font-semibold">{currentUser.cards.length}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Операций</p>
                    <p className="text-lg font-semibold">{currentUser.transactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card
                onClick={() => setScreen('card-type')}
                className="cursor-pointer hover:scale-105 transition-transform bg-card/50 backdrop-blur border-border/50"
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="Plus" size={24} className="text-white" />
                  </div>
                  <p className="font-semibold text-sm">Оформить карту</p>
                </CardContent>
              </Card>

              <Card 
                onClick={() => setActiveTab('transfers')}
                className="cursor-pointer hover:scale-105 transition-transform bg-card/50 backdrop-blur border-border/50"
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                    <Icon name="Send" size={24} className="text-white" />
                  </div>
                  <p className="font-semibold text-sm">Перевод</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:scale-105 transition-transform bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon name="Wallet" size={24} className="text-white" />
                  </div>
                  <p className="font-semibold text-sm">Платежи</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:scale-105 transition-transform bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-white" />
                  </div>
                  <p className="font-semibold text-sm">Инвестиции</p>
                </CardContent>
              </Card>
            </div>

            {currentUser.transactions.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold mb-4">Последние операции</h3>
                <div className="space-y-3">
                  {currentUser.transactions.slice(0, 5).map((transaction) => (
                    <Card key={transaction.id} className="bg-card/50 backdrop-blur border-border/50">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${transaction.color} flex items-center justify-center`}>
                            <Icon name={transaction.icon as any} size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">{transaction.name}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <p className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-foreground'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} ₽
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-8 text-center">
                  <Icon name="Receipt" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Пока нет операций</p>
                  <p className="text-sm text-muted-foreground mt-2">Оформите карту, чтобы начать</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Мои карты</h2>
            {currentUser.cards.length > 0 ? (
              <>
                {currentUser.cards.map((card) => (
                  <Card 
                    key={card.id} 
                    onClick={() => openCardMenu(card)}
                    className="bg-gradient-to-br from-primary via-secondary to-accent text-white border-0 cursor-pointer hover:scale-105 transition-transform relative"
                  >
                    {card.isBlocked && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                        <div className="text-center">
                          <Icon name="Lock" size={48} className="mx-auto mb-2" />
                          <p className="font-bold text-lg">Карта заблокирована</p>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-8">
                        <Icon name="Landmark" size={32} className="text-white" />
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {card.customName || (card.type === 'plastic' ? 'Пластиковая' : 'Виртуальная')}
                          </p>
                          <p className="text-xs text-white/60 mt-1">{card.variant}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-mono mb-4">{card.number}</p>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-white/60 text-xs mb-1">Владелец</p>
                          <p className="font-semibold">{currentUser.name}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-1">Действует до</p>
                          <p className="font-semibold">{card.expiryDate}</p>
                        </div>
                      </div>
                      {card.limit && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="text-white/60 text-xs">Лимит операций</p>
                          <p className="font-semibold">{card.limit.toLocaleString()} ₽</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                <Button
                  onClick={() => setScreen('card-type')}
                  className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить карту
                </Button>
              </>
            ) : (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-8 text-center">
                  <Icon name="CreditCard" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">У вас пока нет карт</p>
                  <Button
                    onClick={() => setScreen('card-type')}
                    className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
                  >
                    <Icon name="Plus" size={20} className="mr-2" />
                    Оформить первую карту
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'transfers' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Переводы</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant={transferType === 'own' ? 'default' : 'outline'}
                onClick={() => setTransferType('own')}
                className={transferType === 'own' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
              >
                Свои счета
              </Button>
              <Button
                variant={transferType === 'card' ? 'default' : 'outline'}
                onClick={() => setTransferType('card')}
                className={transferType === 'card' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
              >
                По карте
              </Button>
              <Button
                variant={transferType === 'phone' ? 'default' : 'outline'}
                onClick={() => setTransferType('phone')}
                className={transferType === 'phone' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
              >
                По телефону
              </Button>
              <Button
                variant={transferType === 'bank' ? 'default' : 'outline'}
                onClick={() => setTransferType('bank')}
                className={transferType === 'bank' ? 'bg-gradient-to-r from-primary to-secondary' : ''}
              >
                В другой банк
              </Button>
            </div>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>С какой карты</Label>
                  <select 
                    className="w-full mt-2 p-3 rounded-lg bg-background border border-border text-foreground"
                    value={transferFromCard}
                    onChange={(e) => setTransferFromCard(e.target.value)}
                  >
                    <option value="">Выберите карту</option>
                    {currentUser.cards.filter(c => !c.isBlocked).map(card => (
                      <option key={card.id} value={card.id}>
                        {card.customName || card.number} - {card.variant}
                      </option>
                    ))}
                  </select>
                </div>

                {transferType === 'own' && (
                  <div>
                    <Label>На какую карту</Label>
                    <select className="w-full mt-2 p-3 rounded-lg bg-background border border-border text-foreground">
                      <option value="">Выберите карту</option>
                      {currentUser.cards.filter(c => !c.isBlocked && c.id !== transferFromCard).map(card => (
                        <option key={card.id} value={card.id}>
                          {card.customName || card.number} - {card.variant}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {transferType === 'card' && (
                  <div>
                    <Label>Номер карты получателя</Label>
                    <Input
                      placeholder="0000 0000 0000 0000"
                      value={transferTarget}
                      onChange={(e) => setTransferTarget(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}

                {transferType === 'phone' && (
                  <div>
                    <Label>Номер телефона получателя</Label>
                    <Input
                      placeholder="+7 (___) ___-__-__"
                      value={transferTarget}
                      onChange={(e) => setTransferTarget(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}

                {transferType === 'bank' && (
                  <div>
                    <Label>Реквизиты получателя</Label>
                    <Input
                      placeholder="БИК, номер счёта"
                      value={transferTarget}
                      onChange={(e) => setTransferTarget(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label>Сумма перевода</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="mt-2 text-2xl font-bold"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Доступно: {currentUser.balance.toLocaleString()} ₽
                  </p>
                </div>

                <Button
                  onClick={handleTransfer}
                  className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 py-6 text-lg"
                >
                  Перевести
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Кредиты</h2>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Раздел в разработке</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'family' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Семья</h2>
            
            {familyAction === 'view' && (
              <>
                {currentUser.familyCode ? (
                  <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Код семьи</p>
                          <p className="text-3xl font-bold font-mono">{currentUser.familyCode}</p>
                        </div>
                        <Icon name="Users" size={48} className="text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Поделитесь этим кодом с близкими</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      onClick={() => setFamilyAction('create')}
                      className="cursor-pointer hover:scale-105 transition-transform bg-card/50 backdrop-blur border-border/50"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Icon name="UserPlus" size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Создать семью</h3>
                        <p className="text-muted-foreground">Получите код для приглашения</p>
                      </CardContent>
                    </Card>

                    <Card
                      onClick={() => setFamilyAction('join')}
                      className="cursor-pointer hover:scale-105 transition-transform bg-card/50 backdrop-blur border-border/50"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                          <Icon name="Key" size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Вступить в семью</h3>
                        <p className="text-muted-foreground">Введите код приглашения</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentUser.familyCode && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Члены семьи</h3>
                    <div className="space-y-3">
                      <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-bold">
                            {currentUser.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{currentUser.name} (Вы)</p>
                            <p className="text-sm text-muted-foreground">{currentUser.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{currentUser.balance.toLocaleString()} ₽</p>
                            <p className="text-xs text-muted-foreground">{currentUser.cards.length} карт</p>
                          </div>
                        </CardContent>
                      </Card>

                      {getFamilyData().filter(u => u.phone !== currentUser.phone).map((member) => (
                        <Card key={member.phone} className="bg-card/50 backdrop-blur border-border/50">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white text-lg font-bold">
                              {member.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.phone}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{member.balance.toLocaleString()} ₽</p>
                              <p className="text-xs text-muted-foreground">{member.cards.length} карт</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {familyAction === 'create' && (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <Button
                    onClick={() => setFamilyAction('view')}
                    variant="ghost"
                    className="mb-4"
                  >
                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                    Назад
                  </Button>
                  <div className="text-center py-8">
                    <Icon name="Users" size={64} className="mx-auto mb-6 text-primary" />
                    <h3 className="text-2xl font-bold mb-4">Создать семейный аккаунт</h3>
                    <p className="text-muted-foreground mb-6">Получите уникальный код для приглашения членов семьи</p>
                    <Button
                      onClick={generateFamilyCode}
                      className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
                    >
                      Создать код
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {familyAction === 'join' && (
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <Button
                    onClick={() => setFamilyAction('view')}
                    variant="ghost"
                    className="mb-4"
                  >
                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                    Назад
                  </Button>
                  <div className="py-8">
                    <Icon name="Key" size={64} className="mx-auto mb-6 text-accent" />
                    <h3 className="text-2xl font-bold mb-4 text-center">Вступить в семью</h3>
                    <p className="text-muted-foreground mb-6 text-center">Введите код приглашения от члена семьи</p>
                    <div className="max-w-md mx-auto space-y-4">
                      <Input
                        type="text"
                        placeholder="Введите код"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        className="text-center text-2xl font-mono tracking-wider"
                        maxLength={6}
                      />
                      <Button
                        onClick={handleJoinFamily}
                        className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
                        disabled={joinCode.length !== 6}
                      >
                        Вступить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Профиль</h2>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{currentUser.name}</h3>
                    <p className="text-muted-foreground">{currentUser.phone}</p>
                    {currentUser.email && (
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    )}
                  </div>
                  {currentUser.isPremium && (
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-bold">
                      ПРЕМИУМ
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Баланс</span>
                    <span className="font-semibold">{currentUser.balance.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Карт</span>
                    <span className="font-semibold">{currentUser.cards.length}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Операций</span>
                    <span className="font-semibold">{currentUser.transactions.length}</span>
                  </div>
                  {currentUser.familyCode && (
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Семейный код</span>
                      <span className="font-semibold font-mono">{currentUser.familyCode}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setEditName(currentUser.name);
                      setEditPhone(currentUser.phone);
                      setEditEmail(currentUser.email || '');
                      setEditProfile(true);
                    }}
                  >
                    <Icon name="Edit" size={20} className="mr-2" />
                    Редактировать профиль
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <Icon name="LogOut" size={20} className="mr-2" />
                    Выйти из аккаунта
                  </Button>

                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={handleDeleteAccount}
                  >
                    <Icon name="Trash2" size={20} className="mr-2" />
                    Удалить аккаунт
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={cardMenuOpen} onOpenChange={setCardMenuOpen}>
        <DialogContent className="bg-card max-w-md">
          <DialogHeader>
            <DialogTitle>Настройки карты</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-0">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Номер карты</p>
                  <p className="text-xl font-mono font-bold mb-3">{selectedCard.fullNumber}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Срок действия</p>
                      <p className="font-semibold">{selectedCard.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CVV</p>
                      <p className="font-semibold">{selectedCard.cvv}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div>
                  <Label>Название карты</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={editingCardName}
                      onChange={(e) => setEditingCardName(e.target.value)}
                      placeholder="Моя карта"
                    />
                    <Button onClick={handleRenameCard}>
                      <Icon name="Check" size={20} />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Лимит операций (₽)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      value={cardLimit}
                      onChange={(e) => setCardLimit(e.target.value)}
                      placeholder="Без лимита"
                    />
                    <Button onClick={handleSetLimit}>
                      <Icon name="Check" size={20} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon name={selectedCard.isBlocked ? "Unlock" : "Lock"} size={20} />
                    <span className="font-medium">
                      {selectedCard.isBlocked ? "Разблокировать карту" : "Заблокировать карту"}
                    </span>
                  </div>
                  <Switch
                    checked={selectedCard.isBlocked}
                    onCheckedChange={handleBlockCard}
                  />
                </div>

                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDeleteCard}
                >
                  <Icon name="Trash2" size={20} className="mr-2" />
                  Удалить карту
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editProfile} onOpenChange={setEditProfile}>
        <DialogContent className="bg-card max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Имя</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Номер телефона</Label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="example@mail.com"
                className="mt-2"
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent"
              onClick={handleSaveProfile}
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPremium} onOpenChange={setShowPremium}>
        <DialogContent className="bg-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Юган Премиум
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/50">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Icon name="Check" size={20} className="text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Повышенный кэшбэк</p>
                      <p className="text-sm text-muted-foreground">До 10% на все покупки</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" size={20} className="text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Бесплатные переводы</p>
                      <p className="text-sm text-muted-foreground">Без комиссии в любой банк</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" size={20} className="text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Увеличенные лимиты</p>
                      <p className="text-sm text-muted-foreground">До 5 млн ₽ на операции</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" size={20} className="text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Приоритетная поддержка</p>
                      <p className="text-sm text-muted-foreground">24/7 персональный менеджер</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" size={20} className="text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Доступ к инвестициям</p>
                      <p className="text-sm text-muted-foreground">Эксклюзивные предложения</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" size={20} className="text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Страхование карт</p>
                      <p className="text-sm text-muted-foreground">Защита от мошенничества</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!currentUser?.isPremium && (
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 text-white font-bold py-6 text-lg"
                onClick={activatePremium}
              >
                Активировать Премиум
              </Button>
            )}

            {currentUser?.isPremium && (
              <div className="text-center py-4">
                <Icon name="CheckCircle2" size={48} className="mx-auto mb-3 text-amber-500" />
                <p className="font-bold text-lg">Премиум активен</p>
                <p className="text-sm text-muted-foreground">Наслаждайтесь всеми привилегиями</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            {[
              { id: 'main', icon: 'Home', label: 'Главная' },
              { id: 'cards', icon: 'CreditCard', label: 'Карты' },
              { id: 'transfers', icon: 'Send', label: 'Переводы' },
              { id: 'credits', icon: 'TrendingUp', label: 'Кредиты' },
              { id: 'family', icon: 'Users', label: 'Семья' },
              { id: 'profile', icon: 'User', label: 'Профиль' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon as any} size={24} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Index;
