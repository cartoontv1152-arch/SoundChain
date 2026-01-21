"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  Library,
  PlusCircle,
  Heart,
  Music2,
  Mic2,
  Wallet,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BecomeArtistDialog } from './BecomeArtistDialog';
import { toast } from 'sonner';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Discover', href: '/discover' },
  { icon: Library, label: 'Library', href: '/library' },
];

const secondaryItems = [
  { icon: PlusCircle, label: 'Create Playlist', href: '/library?create=true' },
  { icon: Heart, label: 'Liked Songs', href: '/library/liked' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isArtist, setIsArtist] = useState(false);
  const [showArtistDialog, setShowArtistDialog] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            
            const res = await fetch(`/api/users?wallet=${address}`);
            if (res.ok) {
              const data = await res.json();
              setIsArtist(data.user?.isArtist || false);
            }
          }
        } catch (error) {
          console.error('Error checking wallet:', error);
        }
      }
    };
    checkWallet();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        isCollapsed ? '80px' : '256px'
      );
    }
  }, [isCollapsed]);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (!accounts || accounts.length === 0) {
          toast.error('No accounts found', {
            description: 'Please unlock your wallet and try again.',
          });
          return;
        }
        
        setWalletAddress(accounts[0]);
        
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: accounts[0] }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
        
        toast.success('Wallet connected', {
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      } catch (error: any) {
        console.error('Error connecting wallet:', error);
        if (error.code === 4001) {
          toast.error('Connection rejected', {
            description: 'Please approve the connection request in your wallet.',
          });
        } else {
          toast.error('Failed to connect wallet', {
            description: error.message || 'Please try again later.',
          });
        }
      }
    } else {
      toast.error('Web3 wallet not found', {
        description: 'Please install MetaMask or another Web3 wallet to continue.',
        action: {
          label: 'Get MetaMask',
          onClick: () => window.open('https://metamask.io', '_blank'),
        },
      });
    }
  };

  const handleBecomeArtist = () => {
    if (!walletAddress) {
      toast.warning('Wallet required', {
        description: 'Please connect your wallet first to become an artist.',
      });
      return;
    }
    setShowArtistDialog(true);
  };

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 z-40 h-[calc(100vh-90px)] bg-black flex flex-col border-r border-white/5"
        style={{
          paddingLeft: isCollapsed ? '0.5rem' : '0.75rem',
          paddingRight: isCollapsed ? '0.5rem' : '0.75rem',
        }}
        aria-label="Navigation sidebar"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
                      <Music2 className="w-6 h-6 text-black" />
                    </div>
                    <div className="absolute -inset-1 rounded-full bg-[#1DB954]/20 blur-md -z-10" />
                  </div>
                  <span className="text-xl font-bold text-white">SoundChain</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isCollapsed && (
            <div className="relative mx-auto">
              <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
                <Music2 className="w-6 h-6 text-black" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-[#1DB954]/20 blur-md -z-10" />
            </div>
          )}
        </div>

        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-[#282828] hover:bg-[#1DB954] border border-white/10 rounded-full flex items-center justify-center text-white hover:text-black transition-all z-50 cursor-pointer group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </motion.button>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all relative",
                  isActive
                    ? "bg-[#282828] text-white"
                    : "text-[#b3b3b3] hover:text-white",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "text-[#1DB954]")} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-1 h-8 bg-[#1DB954] rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <>
            <div className="mt-6 px-6">
              <div className="h-px bg-white/10" />
            </div>

            <nav className="mt-4 px-3 space-y-1">
              {secondaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-[#b3b3b3] hover:text-white transition-all"
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 px-6">
              <div className="h-px bg-white/10" />
            </div>
          </>
        )}

        <div className="flex-1" />

        <div className="p-4 space-y-2">
          {walletAddress && !isArtist && !isCollapsed && (
            <button
              onClick={handleBecomeArtist}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#1DB954] to-[#169c46] text-sm font-semibold text-black hover:from-[#1ed760] hover:to-[#1DB954] transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Become an Artist
            </button>
          )}
          
          {isArtist && (
            <Link
              href="/artist"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#1DB954]/20 to-transparent border border-[#1DB954]/30 text-sm font-medium text-white hover:from-[#1DB954]/30 transition-all",
                isCollapsed && "justify-center"
              )}
            >
              <Mic2 className="w-5 h-5 text-[#1DB954]" />
              {!isCollapsed && "Artist Dashboard"}
            </Link>
          )}
          
          {walletAddress ? (
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm",
              isCollapsed && "justify-center"
            )}>
              <Wallet className="w-5 h-5 text-[#1DB954]" />
              {!isCollapsed && (
                <span className="text-white text-xs truncate">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-all",
                isCollapsed && "justify-center"
              )}
            >
              <Wallet className="w-5 h-5" />
              {!isCollapsed && "Connect Wallet"}
            </button>
          )}
        </div>
      </motion.aside>

      <style jsx global>{`
        main {
          margin-left: var(--sidebar-width, 256px) !important;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (max-width: 768px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>

      {walletAddress && (
        <BecomeArtistDialog
          open={showArtistDialog}
          onOpenChange={setShowArtistDialog}
          walletAddress={walletAddress}
        />
      )}
    </>
  );
}