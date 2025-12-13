"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  CreditCard,
  Clock,
  Zap,
  CheckCircle,
  Crown,
  Shield,
  Music,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '$0',
    period: '7 days',
    features: ['10 streams per day', 'Basic audio quality', 'Ad supported'],
    current: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    features: ['Unlimited streams', 'Lossless audio', 'No ads', 'Offline mode', 'Support artists directly'],
    recommended: true,
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    price: '$99',
    period: 'year',
    features: ['Everything in Premium', '2 months free', 'Exclusive NFT drops', 'Early access'],
  },
];

const supportedCryptos = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$' },
  { symbol: 'MATIC', name: 'Polygon', icon: '⬡' },
  { symbol: 'SOL', name: 'Solana', icon: '◎' },
];

export default function DashboardPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState('USDC');

  const handleConnect = async () => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
    setIsConnected(true);
    setIsConnecting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const daysRemaining = mockUser.trialEndsAt 
    ? Math.ceil((mockUser.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen pb-8">
      <div className="relative h-48 bg-gradient-to-r from-[#282828] via-[#1a1a1a] to-[#282828]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1DB954]/10 via-transparent to-transparent" />
        <div className="relative z-10 h-full flex items-end px-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#1DB954] flex items-center justify-center">
              <Wallet className="w-10 h-10 text-black" />
            </div>
            <div>
              <span className="text-sm text-white/80 uppercase tracking-wider">Account</span>
              <h1 className="text-3xl font-bold text-white">{mockUser.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#181818] border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#1DB954]" />
                </div>
                <div>
                  <p className="text-sm text-[#b3b3b3]">Subscription</p>
                  <p className="text-white font-semibold capitalize">{mockUser.subscriptionStatus}</p>
                </div>
              </div>
              {mockUser.subscriptionStatus === 'trial' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#b3b3b3]">Trial ends in</span>
                    <span className="text-white">{daysRemaining} days</span>
                  </div>
                  <Progress value={(7 - daysRemaining) / 7 * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-[#1DB954]" />
                </div>
                <div>
                  <p className="text-sm text-[#b3b3b3]">Streams Today</p>
                  <p className="text-white font-semibold">
                    {10 - (mockUser.streamsRemaining || 0)} / 10
                  </p>
                </div>
              </div>
              <Progress value={(10 - (mockUser.streamsRemaining || 0)) / 10 * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[#1DB954]" />
                </div>
                <div>
                  <p className="text-sm text-[#b3b3b3]">Wallet</p>
                  <p className="text-white font-semibold">
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </p>
                </div>
              </div>
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#b3b3b3] font-mono truncate">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <button onClick={handleCopy} className="text-[#b3b3b3] hover:text-white">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  size="sm"
                  className="bg-[#1DB954] hover:bg-[#1ed760] text-black"
                >
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Connect'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="bg-[#282828] border-white/5">
            <TabsTrigger value="subscription" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">
              <Crown className="w-4 h-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">
              <Clock className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={cn(
                      "bg-[#181818] border-white/5 relative overflow-hidden cursor-pointer transition-all",
                      plan.recommended && "border-[#1DB954]",
                      selectedPlan === plan.id && "ring-2 ring-[#1DB954]"
                    )}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.recommended && (
                      <div className="absolute top-0 right-0 bg-[#1DB954] text-black text-xs font-semibold px-3 py-1 rounded-bl-lg">
                        RECOMMENDED
                      </div>
                    )}
                    {plan.current && (
                      <div className="absolute top-0 right-0 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                        CURRENT
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                        <span className="text-[#b3b3b3]">/{plan.period}</span>
                      </div>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                            <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {selectedPlan && selectedPlan !== 'free' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card className="bg-[#181818] border-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Pay with Crypto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#b3b3b3] mb-6">
                      Pay with any cryptocurrency. We use SideShift to convert your payment to USDC automatically.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {supportedCryptos.map((crypto) => (
                        <button
                          key={crypto.symbol}
                          onClick={() => setSelectedCrypto(crypto.symbol)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                            selectedCrypto === crypto.symbol
                              ? "bg-[#1DB954] border-[#1DB954] text-black"
                              : "border-white/10 text-white hover:border-white/30"
                          )}
                        >
                          <span className="text-lg">{crypto.icon}</span>
                          <span className="font-medium">{crypto.symbol}</span>
                        </button>
                      ))}
                    </div>
                    <Button className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold h-12">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with {selectedCrypto}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="wallet">
            <Card className="bg-[#181818] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Wallet Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isConnected ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-[#282828] flex items-center justify-center mx-auto mb-6">
                      <Wallet className="w-10 h-10 text-[#b3b3b3]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                    <p className="text-[#b3b3b3] mb-6 max-w-md mx-auto">
                      Connect your crypto wallet to subscribe, tip artists, and manage your payments.
                    </p>
                    <Button
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect Wallet
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-[#282828]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[#b3b3b3]">Connected Wallet</span>
                        <span className="flex items-center gap-2 text-[#1DB954]">
                          <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                          Connected
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-white">{walletAddress}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCopy}
                            className="p-2 rounded-lg bg-white/5 text-[#b3b3b3] hover:text-white"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button className="p-2 rounded-lg bg-white/5 text-[#b3b3b3] hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-[#282828]">
                        <p className="text-sm text-[#b3b3b3] mb-1">Network</p>
                        <p className="text-white font-medium">Polygon Amoy</p>
                      </div>
                      <div className="p-4 rounded-lg bg-[#282828]">
                        <p className="text-sm text-[#b3b3b3] mb-1">Balance</p>
                        <p className="text-white font-medium">0.5 MATIC</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setIsConnected(false)}
                      className="w-full border-white/10"
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-[#181818] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: 'Dec 10, 2024', type: 'Tip', artist: 'Luna Wave', amount: '0.5 USDC' },
                    { date: 'Dec 8, 2024', type: 'Stream', artist: 'BlockChain DJ', amount: '0.001 USDC' },
                    { date: 'Dec 5, 2024', type: 'Subscription', artist: 'SoundChain', amount: '9.99 USDC' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-[#282828]">
                      <div>
                        <p className="text-white font-medium">{tx.type}</p>
                        <p className="text-sm text-[#b3b3b3]">{tx.artist}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{tx.amount}</p>
                        <p className="text-sm text-[#b3b3b3]">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
