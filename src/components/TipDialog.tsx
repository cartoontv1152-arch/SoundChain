"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { SOUNDCHAIN_V2_ADDRESS, SOUNDCHAIN_V2_ABI } from '@/lib/web3-config';
import { toast } from 'sonner';

interface TipDialogProps {
  trackId: string;
  artistName: string;
  isOpen: boolean;
  onClose: () => void;
}

const tipAmounts = [
  { label: '0.01 POL', value: '0.01' },
  { label: '0.05 POL', value: '0.05' },
  { label: '0.1 POL', value: '0.1' },
  { label: '0.5 POL', value: '0.5' },
];

export function TipDialog({ trackId, artistName, isOpen, onClose }: TipDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState('0.05');
  const [customAmount, setCustomAmount] = useState('');
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleTip = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = customAmount || selectedAmount;

    try {
      writeContract({
        address: SOUNDCHAIN_V2_ADDRESS as `0x${string}`,
        abi: SOUNDCHAIN_V2_ABI,
        functionName: 'tipArtist',
        args: [trackId],
        value: parseEther(amount),
      });
    } catch (err: any) {
      toast.error('Tip failed: ' + (err.message || 'Unknown error'));
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      toast.success(`Tipped ${customAmount || selectedAmount} POL to ${artistName}!`);
      onClose();
    }, 500);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#282828] rounded-2xl p-6 z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tip Artist</h3>
                  <p className="text-sm text-[#b3b3b3]">Support {artistName}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-[#b3b3b3] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#1DB954] flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white fill-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Tip Sent!</h3>
                <p className="text-[#b3b3b3] mb-4">
                  You tipped {customAmount || selectedAmount} POL to {artistName}
                </p>
                {hash && (
                  <a
                    href={`https://amoy.polygonscan.com/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1DB954] text-sm flex items-center gap-1 justify-center hover:underline"
                  >
                    View on PolygonScan <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {tipAmounts.map((tip) => (
                    <button
                      key={tip.value}
                      onClick={() => { setSelectedAmount(tip.value); setCustomAmount(''); }}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedAmount === tip.value && !customAmount
                          ? 'bg-[#1DB954] text-white ring-2 ring-[#1DB954]/50'
                          : 'bg-[#181818] text-white hover:bg-[#383838]'
                      }`}
                    >
                      <span className="text-lg font-bold">{tip.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="text-sm text-[#b3b3b3] mb-2 block">Custom amount (POL)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    placeholder="Enter custom amount..."
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                  />
                </div>

                <Button
                  onClick={handleTip}
                  disabled={isPending || isConfirming || !isConnected}
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-full"
                >
                  {isPending || isConfirming ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isPending ? 'Confirm in wallet...' : 'Confirming...'}
                    </span>
                  ) : (
                    `Send ${customAmount || selectedAmount} POL`
                  )}
                </Button>

                {!isConnected && (
                  <p className="text-center text-sm text-yellow-400 mt-3">
                    Connect your wallet to tip artists
                  </p>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
