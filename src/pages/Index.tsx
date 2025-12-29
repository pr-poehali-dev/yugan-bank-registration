import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Screen = 'login' | 'main' | 'card-type' | 'payment-system' | 'card-variant';
type CardType = 'plastic' | 'virtual' | null;
type PaymentSystem = 'mastercard' | 'visa' | 'mir' | null;
type CardVariant = 'debit' | 'credit' | 'child' | 'youth' | 'super-credit' | null;

const Index = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const [cardType, setCardType] = useState<CardType>(null);
  const [paymentSystem, setPaymentSystem] = useState<PaymentSystem>(null);
  const [cardVariant, setCardVariant] = useState<CardVariant>(null);

  const handleLogin = () => {
    if (phone && name) {
      setScreen('main');
    }
  };

  const handleCardTypeSelect = (type: CardType) => {
    setCardType(type);
    setScreen('payment-system');
  };

  const handlePaymentSystemSelect = (system: PaymentSystem) => {
    setPaymentSystem(system);
    setScreen('card-variant');
  };

  const handleCardVariantSelect = (variant: CardVariant) => {
    setCardVariant(variant);
    setScreen('main');
    setActiveTab('cards');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20">
      <div className="max-w-6xl mx-auto p-4 pb-24">
        <div className="flex justify-between items-center mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Юган Банк
            </h1>
            <p className="text-muted-foreground mt-1">Добро пожаловать, {name}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Bell" size={24} />
          </Button>
        </div>

        {activeTab === 'main' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-gradient-to-br from-primary via-secondary to-accent text-white border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <CardContent className="p-6 relative z-10">
                <p className="text-white/80 mb-2">Общий баланс</p>
                <h2 className="text-4xl font-bold mb-4">250 000 ₽</h2>
                <div className="flex gap-4">
                  <div>
                    <p className="text-white/60 text-sm">Доход</p>
                    <p className="text-lg font-semibold">+45 000 ₽</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Расход</p>
                    <p className="text-lg font-semibold">-18 000 ₽</p>
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

              <Card className="cursor-pointer hover:scale-105 transition-transform bg-card/50 backdrop-blur border-border/50">
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

            <div>
              <h3 className="text-xl font-bold mb-4">Последние операции</h3>
              <div className="space-y-3">
                {[
                  { name: 'Продукты', amount: '-2 500 ₽', icon: 'ShoppingCart', color: 'from-accent to-secondary' },
                  { name: 'Зарплата', amount: '+65 000 ₽', icon: 'Briefcase', color: 'from-primary to-secondary' },
                  { name: 'Кафе', amount: '-850 ₽', icon: 'Coffee', color: 'from-secondary to-accent' },
                ].map((transaction, i) => (
                  <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${transaction.color} flex items-center justify-center`}>
                          <Icon name={transaction.icon as any} size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{transaction.name}</p>
                          <p className="text-sm text-muted-foreground">Сегодня, 14:30</p>
                        </div>
                      </div>
                      <p className={`font-bold ${transaction.amount.startsWith('+') ? 'text-green-400' : 'text-foreground'}`}>
                        {transaction.amount}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Мои карты</h2>
            <Card className="bg-gradient-to-br from-primary via-secondary to-accent text-white border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-8">
                  <Icon name="Landmark" size={32} className="text-white" />
                  <p className="text-sm font-semibold">
                    {cardType === 'plastic' ? 'Пластиковая' : 'Виртуальная'}
                  </p>
                </div>
                <p className="text-2xl font-mono mb-4">•••• •••• •••• 4829</p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Владелец</p>
                    <p className="font-semibold">{name}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1">Действует до</p>
                    <p className="font-semibold">12/28</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={() => setScreen('card-type')}
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить карту
            </Button>
          </div>
        )}

        {activeTab === 'transfers' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Переводы</h2>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Раздел в разработке</p>
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
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Раздел в разработке</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Профиль</h2>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{name}</h3>
                    <p className="text-muted-foreground">{phone}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Редактировать профиль</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

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
