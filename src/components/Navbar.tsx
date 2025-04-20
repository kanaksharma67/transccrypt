import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Home,
  History,
  Users,
  RefreshCw,
  CreditCard,
  User,
  Settings,
  LogIn,
  Gamepad2,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { AuthModal } from '@/pages/AuthModel';

const Navbar = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path === '/games' && (location.pathname === '/plant-care' || location.pathname === '/pet-care'));
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/history', icon: History, label: 'History' },
    // { path: '/make-payment', icon: CreditCard, label: 'Payments' },
    { path: '/split-bill', icon: Users, label: 'Split Bill' },
    { path: '/convert', icon: RefreshCw, label: 'Convert' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-purple-600 rounded-full p-2">
                <span className="text-xl">Σ</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white hidden sm:block">
                <span className="text-sky-400">Trans</span>
                <span className="text-emerald-400">Crypt</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                if (item.path === '/games') {
                  return (
                    <DropdownMenu key={item.path} onOpenChange={setIsGamesOpen}>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive(item.path)
                            ? 'text-purple-500 bg-purple-500/10'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}>
                          <item.icon size={20} />
                          <span>{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${isGamesOpen ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 bg-gray-800 border-gray-700 mt-2"
                        align="start"
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className={`hover:bg-gray-700 focus:bg-gray-700 ${location.pathname === '/plant-care' ? 'text-purple-500' : 'text-gray-300'
                              }`}
                          >
                            <Link to="/plant-care" className="flex items-center w-full gap-2">
                              <span>Plant Care</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={`hover:bg-gray-700 focus:bg-gray-700 ${location.pathname === '/pet-care' ? 'text-purple-500' : 'text-gray-300'
                              }`}
                          >
                            <Link to="/pet-care" className="flex items-center w-full gap-2">
                              <span>Pet Care</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive(item.path)
                        ? 'text-purple-500 bg-purple-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <DropdownMenu onOpenChange={setIsPaymentsOpen}>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive('/make-payment') || isActive('/stellar-payments')
                      ? 'text-purple-500 bg-purple-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}>
                    <CreditCard size={20} />
                    <span>Payments</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isPaymentsOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 bg-gray-800 border-gray-700 mt-2"
                  align="start"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className={`hover:bg-gray-700 focus:bg-gray-700 ${location.pathname === '/make-payment' ? 'text-purple-500' : 'text-gray-300'
                        }`}
                    >
                      <Link to="/make-payment" className="flex items-center w-full gap-2">
                        <span>UPI Payments</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={`hover:bg-gray-700 focus:bg-gray-700 ${location.pathname === '/stellar-payments' ? 'text-purple-500' : 'text-gray-300'
                        }`}
                    >
                      <Link to="/stellar-payments" className="flex items-center w-full gap-2">
                        <span>Stellar Payments</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right side buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleAuthModal}
                className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors hover:bg-gray-800"
              >
                <LogIn size={20} />
                <span>Login</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 mt-2">
                  <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 text-gray-400">
                    <Link to="/profile" className="flex items-center w-full gap-2">
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 text-gray-400">
                    <Link to="/settings" className="flex items-center w-full gap-2">
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 text-red-400">
                    <button className="flex items-center w-full gap-2">
                      <span>Sign Out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive(item.path)
                      ? 'text-purple-500 bg-purple-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleAuthModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogIn size={20} />
                <span>Login</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={toggleAuthModal}
      />
    </>
  );
};

export default Navbar;