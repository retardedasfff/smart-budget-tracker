"use client";

import Link from "next/link";
<<<<<<< HEAD
import { Home, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-5xl font-bold text-white pixel-art mb-4">
            About Cryptocheliks
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 space-y-8">
          {/* What is Cryptocheliks */}
          <section>
            <h2 className="text-4xl font-bold text-white mb-6 pixel-art text-center">
              🦎 Create Your Own Unique Pixel Character!
            </h2>
            <div className="text-blue-100 text-xl leading-relaxed space-y-4 text-center">
              <p className="text-2xl font-semibold text-white">
                Welcome to Cryptocheliks! 🎨
              </p>
              <p>
                Build your <strong className="text-green-400">one-of-a-kind</strong> pixel character by mixing and matching different parts! 
                Choose from various heads, eyes, mouths, bodies, hats, and accessories to create something truly special.
              </p>
              <p>
                🎭 <strong className="text-white">Express yourself</strong> - Create as many characters as you want, each with its own unique style and personality!
              </p>
              <p>
                🔒 <strong className="text-white">Privacy first</strong> - Your character's details are encrypted and stored securely on the blockchain using cutting-edge FHE technology.
              </p>
              <p>
                🌟 <strong className="text-white">Share & shine</strong> - Show off your creations in the public gallery and let others like your amazing characters!
              </p>
              <p>
                ✨ <strong className="text-white">Edit anytime</strong> - Change your character's look whenever you want, or create brand new ones!
              </p>
            </div>
          </section>

          {/* How to Play */}
          <section className="bg-green-900/20 rounded-lg p-6">
            <h2 className="text-3xl font-bold text-white mb-4 pixel-art text-center">
              🎮 How to Play
            </h2>
            <div className="text-blue-100 text-lg space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <p><strong className="text-white">Connect your wallet</strong> - Link your MetaMask or any Web3 wallet to get started!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <p><strong className="text-white">Create your character</strong> - Use the sliders to customize every part of your pixel character!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <p><strong className="text-white">Name it</strong> - Give your character a cool name and make it public to share with everyone!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <p><strong className="text-white">Show it off</strong> - Browse the gallery, like your favorites, and see what others have created!</p>
              </div>
            </div>
          </section>

          {/* Fun Facts */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4 pixel-art text-center">
              🚀 Cool Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100">
              <div className="p-4 bg-blue-900/30 rounded-lg">
                <h3 className="font-bold text-white mb-2 text-lg">🎨 Unlimited Creativity</h3>
                <p className="text-sm">Create as many characters as you want! Mix and match to your heart's content.</p>
              </div>
              <div className="p-4 bg-blue-900/30 rounded-lg">
                <h3 className="font-bold text-white mb-2 text-lg">🔐 Super Secure</h3>
                <p className="text-sm">Powered by Zama FHEVM - your data stays encrypted and private!</p>
              </div>
              <div className="p-4 bg-blue-900/30 rounded-lg">
                <h3 className="font-bold text-white mb-2 text-lg">💚 Like & Share</h3>
                <p className="text-sm">Show your love for awesome characters with likes!</p>
              </div>
              <div className="p-4 bg-blue-900/30 rounded-lg">
                <h3 className="font-bold text-white mb-2 text-lg">✏️ Edit Anytime</h3>
                <p className="text-sm">Changed your mind? No problem! Edit your characters whenever you want.</p>
              </div>
            </div>
          </section>

          {/* Back Button */}
          <div className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


=======
import { useAccount, useDisconnect } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { ArrowLeft, Lock, DollarSign, Share2, Eye, Edit, Trash2, Tag } from "lucide-react";

export default function AboutPage() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 border-b-2 border-yellow-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-yellow-500 hover:text-yellow-400">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-yellow-500">
                About Smart Budget Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <ConnectKitButton />
              {isConnected && (
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 text-sm font-semibold text-yellow-500 border-2 border-yellow-500 rounded-md hover:bg-yellow-500 hover:text-black transition whitespace-nowrap"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-yellow-500 mb-4">
              Smart Budget Tracker
            </h2>
            <p className="text-yellow-400 text-lg">
              A decentralized budget management application using 
              Fully Homomorphic Encryption (FHE) to ensure maximum privacy for your financial data.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Transaction Management
                </h3>
              </div>
              <p className="text-yellow-400">
                Add income and expenses with amount, category (tag), and description. 
                All transactions are stored encrypted on the blockchain, ensuring complete confidentiality.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Edit className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Edit Transactions
                </h3>
              </div>
              <p className="text-yellow-400">
                Modify existing transactions: update amount, type (income/expense), 
                category, and description. Changes are applied to the existing record without creating duplicates.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Trash2 className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Delete Transactions
                </h3>
              </div>
              <p className="text-yellow-400">
                Remove unwanted transactions from your budget. Deleted records are marked 
                as deleted and do not appear in the list.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Tag className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Categorization
                </h3>
              </div>
              <p className="text-yellow-400">
                Organize transactions by categories (tags) such as "Food", "Rent", "Salary", etc. 
                This helps you better track and analyze your finances.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Share2 className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Budget Sharing
                </h3>
              </div>
              <p className="text-yellow-400">
                Grant access to your budget to other users by their wallet address. 
                They can view your transactions but cannot modify or delete them.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Eye className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  View Shared Budgets
                </h3>
              </div>
              <p className="text-yellow-400">
                View budgets that other users have shared with you. 
                All data remains encrypted even with shared access.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <Lock className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-yellow-500">
                  Full Privacy with FHE
                </h3>
              </div>
              <p className="text-yellow-400">
                All financial data is encrypted using Fully Homomorphic Encryption (FHE). 
                This means that even when stored on the blockchain, your amounts and transaction details remain 
                completely private and inaccessible to third parties.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-yellow-500">
                  Decentralization
                </h3>
              </div>
              <p className="text-yellow-400">
                The application runs on the Ethereum blockchain (Sepolia testnet), providing 
                decentralized data storage without a single point of failure. Your data belongs only to you.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-yellow-500/30">
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">
              Technologies
            </h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-400">
              <li>Next.js 14 - React framework for web applications</li>
              <li>Wagmi - library for working with Ethereum</li>
              <li>ConnectKit - components for wallet connections</li>
              <li>Solidity - smart contracts on the blockchain</li>
              <li>FHE (Fully Homomorphic Encryption) - fully homomorphic encryption</li>
              <li>TypeScript - typed JavaScript</li>
              <li>Tailwind CSS - utility-first CSS framework</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
