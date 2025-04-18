import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, PlusCircle, X, Send, QrCode, Smartphone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import QRCode from "react-qr-code";

// Types
type Person = {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
  phone: string;
};

type ReceiverDetails = {
  upiId: string;
  name: string;
  phone: string;
};

// Colors - Enhanced with more vibrant options
const COLORS = [
  '#8B5CF6', // Vivid Purple
  '#0EA5E9', // Ocean Blue
  '#F97316', // Bright Orange
  '#6E59A5', // Tertiary Purple
  '#D946EF', // Magenta Pink
  '#10B981', // Emerald
  '#EA384C', // Red
  '#65A30D', // Green
];

// Avatar Component
const AnimatedAvatar = ({
  name,
  color,
  size = 'md',
  className,
  animate = true
}: {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white shadow-lg',
        sizeClasses[size],
        animate && 'animate-pulse-glow hover:animate-float',
        className
      )}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
};

// Particle Button Component
const ParticleButton = ({
  children,
  className,
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const createParticles = () => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('span');
      particle.classList.add('particle');
      
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 60 - 30;
      const y = Math.random() * 60 - 30;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${buttonRect.width / 2}px`;
      particle.style.top = `${buttonRect.height / 2}px`;
      
      particle.style.setProperty('--x', `${x}px`);
      particle.style.setProperty('--y', `${y}px`);
      
      particle.classList.add('animate-particle-explosion');
      button.appendChild(particle);
      
      setTimeout(() => {
        if (button.contains(particle)) {
          button.removeChild(particle);
        }
      }, 1000);
    }
  };
  
  const handleClick = () => {
    if (!disabled) {
      createParticles();
      onClick();
    }
  };
  
  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium transition-all duration-300',
        'hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]',
        'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed group',
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <Send size={16} className="transition-transform group-hover:translate-x-1" />
        {children}
      </div>
    </button>
  );
};

// Person Slider Component
const PersonSlider = ({
  name,
  percentage,
  amount,
  color,
  totalAmount,
  onPercentageChange,
  onRemove,
  canRemove,
  phone,
  onPhoneChange,
  onNameChange,
  showPhoneInput,
  showNameInput
}: {
  name: string;
  percentage: number;
  amount: number;
  color: string;
  totalAmount: number;
  onPercentageChange: (value: number) => void;
  onRemove: () => void;
  canRemove: boolean;
  phone: string;
  onPhoneChange: (value: string) => void;
  onNameChange?: (value: string) => void;
  showPhoneInput: boolean;
  showNameInput: boolean;
}) => {
  const handleSliderChange = (value: number[]) => {
    onPercentageChange(value[0]);
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 animate-slide-up transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AnimatedAvatar name={name} color={color} size="sm" />
          {showNameInput ? (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange && onNameChange(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 rounded-lg py-1 pl-8 pr-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all"
              />
            </div>
          ) : (
            <span className="text-white font-medium">{name}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color }}>
            {percentage.toFixed(1)}%
          </span>
          <span className="text-gray-200 text-sm font-bold">
            ₹{amount.toFixed(2)}
          </span>
          {canRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-500/10"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <Slider
        value={[percentage]}
        max={100}
        step={0.1}
        onValueChange={handleSliderChange}
        className="my-3"
        style={{ 
          '--slider-thumb-color': color,
          '--slider-track-color': `linear-gradient(90deg, ${color}80, ${color})`
        } as React.CSSProperties}
      />
      {showPhoneInput && (
        <div className="mt-3">
          <label className="block text-gray-300 text-xs mb-1">WhatsApp Number (+91...)</label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}
      <div className="text-right mt-1">
        <span className="text-gray-400 text-xs">Amount: </span>
        <span className="text-white text-sm font-medium">₹{amount.toFixed(2)}</span>
      </div>
    </div>
  );
};

// QR Code Modal Component
const QRCodeModal = ({
  upiLink,
  amount,
  personName,
  onClose
}: {
  upiLink: string;
  amount: number;
  personName: string;
  onClose: () => void;
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `payment-${personName}-${amount}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700/50 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">UPI Payment for {personName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <div ref={qrRef} className="bg-white p-4 rounded-lg mb-4">
            <QRCode 
              value={upiLink} 
              size={200} 
              level="H" 
              includeMargin={true}
            />
          </div>
          
          <div className="text-center mb-4">
            <p className="text-gray-300 text-sm">Amount: <span className="text-white font-bold">₹{amount.toFixed(2)}</span></p>
            <p className="text-gray-400 text-xs mt-2">Scan this QR code to make payment</p>
          </div>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={downloadQRCode}
              className="w-1/2 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
            >
              Download QR
            </button>
            <button
              onClick={() => {
                window.open(upiLink, '_blank');
                onClose();
              }}
              className="w-1/2 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
            >
              Open in UPI App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Split Summary Component
const SplitSummary = ({
  totalAmount,
  people,
  splitType,
  showSummary,
  receiverDetails,
  onSendRequests
}: {
  totalAmount: number;
  people: Person[];
  splitType: 'equal' | 'custom';
  showSummary: boolean;
  receiverDetails: ReceiverDetails;
  onSendRequests: () => void;
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentQRData, setCurrentQRData] = useState<{upiLink: string; amount: number; personName: string} | null>(null);

  if (!showSummary) return null;

  const generateUPILink = (amount: number) => {
    return `upi://pay?pa=${receiverDetails.upiId}&pn=${encodeURIComponent(receiverDetails.name)}&am=${amount}&cu=INR`;
  };

  const showQRCode = (person: Person) => {
    const upiLink = generateUPILink(person.amount);
    setCurrentQRData({
      upiLink,
      amount: person.amount,
      personName: person.name
    });
    setShowQRModal(true);
  };

  return (
    <>
      <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700/50 mt-6 animate-slide-up">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xs">✓</span>
          Split Summary
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <div className="text-gray-400 text-sm">Total Amount</div>
            <div className="text-white text-lg font-bold">₹{totalAmount.toFixed(2)}</div>
          </div>
          
          <div className="col-span-1 text-right">
            <div className="text-gray-400 text-sm">Split Type</div>
            <div className="text-white text-lg font-bold capitalize">{splitType}</div>
          </div>
        </div>
        
        <div>
          <div className="text-gray-400 text-sm pb-2 border-b border-gray-700/50 mb-2">Who Pays What</div>
          <div className="space-y-3 mt-4">
            {people.map((person, index) => (
              <div 
                key={person.id} 
                className="flex items-center justify-between py-2 border-b border-gray-700/20 animate-slide-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2">
                  <AnimatedAvatar name={person.name} color={person.color} size="sm" animate={false} />
                  <span className="text-white">{person.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-white font-semibold">₹{person.amount.toFixed(2)}</span>
                    <span className="text-gray-400 text-xs">{person.percentage.toFixed(1)}%</span>
                  </div>
                  <button 
                    onClick={() => showQRCode(person)}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-purple-400"
                    title="Show QR Code"
                  >
                    <QrCode size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ParticleButton
          onClick={onSendRequests}
          className="w-full mt-6"
        >
          Send WhatsApp Requests
        </ParticleButton>
      </div>

      {showQRModal && currentQRData && (
        <QRCodeModal
          upiLink={currentQRData.upiLink}
          amount={currentQRData.amount}
          personName={currentQRData.personName}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </>
  );
};

// Utility Functions
const calculateAmounts = (totalAmount: number, people: Person[]): Person[] => {
  const totalPercentage = people.reduce((acc, person) => acc + person.percentage, 0);
  
  let normalizedPeople = [...people];
  
  if (totalPercentage !== 100 && totalPercentage !== 0) {
    normalizedPeople = people.map(person => ({
      ...person,
      percentage: (person.percentage / totalPercentage) * 100
    }));
  }
  
  return normalizedPeople.map(person => ({
    ...person,
    amount: parseFloat(((totalAmount * person.percentage) / 100).toFixed(2))
  }));
};

const adjustPercentages = (updatedPersonIndex: number, newPercentage: number, people: Person[]): Person[] => {
  const updatedPeople = [...people];
  
  updatedPeople[updatedPersonIndex] = {
    ...updatedPeople[updatedPersonIndex],
    percentage: newPercentage
  };
  
  const remainingPercentage = 100 - newPercentage;
  
  const otherPercentageTotal = updatedPeople.reduce((total, person, index) => {
    return index !== updatedPersonIndex ? total + person.percentage : total;
  }, 0);
  
  if (otherPercentageTotal > 0) {
    for (let i = 0; i < updatedPeople.length; i++) {
      if (i !== updatedPersonIndex) {
        const ratio = updatedPeople[i].percentage / otherPercentageTotal;
        updatedPeople[i] = {
          ...updatedPeople[i],
          percentage: parseFloat((ratio * remainingPercentage).toFixed(1))
        };
      }
    }
  }
  
  return updatedPeople;
};

// Main SplitBill Component
const SplitBill: React.FC = () => {
  const { toast } = useToast();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('custom');
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'You', percentage: 50, amount: 0, color: COLORS[0], phone: '' },
    { id: '2', name: 'Friend 1', percentage: 50, amount: 0, color: COLORS[1], phone: '' },
  ]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [receiverDetails, setReceiverDetails] = useState<ReceiverDetails>({
    upiId: '',
    name: 'Receiver',
    phone: ''
  });
  const [showReceiverForm, setShowReceiverForm] = useState<boolean>(true);

  useEffect(() => {
    const updatedPeople = calculateAmounts(totalAmount, people);
    setPeople(updatedPeople);
  }, [totalAmount, splitType]);

  const handlePercentageChange = (index: number, newPercentage: number) => {
    if (splitType === 'equal') return;
    
    const adjustedPeople = adjustPercentages(index, newPercentage, people);
    const updatedPeople = calculateAmounts(totalAmount, adjustedPeople);
    setPeople(updatedPeople);
  };

  const handlePhoneChange = (index: number, newPhone: string) => {
    const updatedPeople = [...people];
    updatedPeople[index] = {
      ...updatedPeople[index],
      phone: newPhone
    };
    setPeople(updatedPeople);
  };

  const handleNameChange = (index: number, newName: string) => {
    const updatedPeople = [...people];
    updatedPeople[index] = {
      ...updatedPeople[index],
      name: newName
    };
    setPeople(updatedPeople);
  };

  const handleAddPerson = () => {
    if (people.length >= 8) {
      toast({
        title: "Maximum people reached",
        description: "You can only split with up to 8 people",
        variant: "destructive",
      });
      return;
    }
    
    const newId = `${people.length + 1}`;
    const newColor = COLORS[people.length % COLORS.length];
    
    const equalPercentage = 100 / (people.length + 1);
    
    const adjustedPeople = people.map(person => ({
      ...person,
      percentage: equalPercentage
    }));
    
    const newPerson: Person = {
      id: newId,
      name: `Friend ${people.length + 1}`,
      percentage: equalPercentage,
      amount: 0,
      color: newColor,
      phone: ''
    };
    
    const updatedPeople = calculateAmounts(totalAmount, [...adjustedPeople, newPerson]);
    setPeople(updatedPeople);
  };

  const handleRemovePerson = (id: string) => {
    if (people.length <= 2) {
      toast({
        title: "Minimum people required",
        description: "You need at least 2 people to split a bill",
        variant: "destructive",
      });
      return;
    }
    
    const remainingPeople = people.filter(person => person.id !== id);
    
    const equalPercentage = 100 / remainingPeople.length;
    const adjustedPeople = remainingPeople.map(person => ({
      ...person,
      percentage: equalPercentage
    }));
    
    const updatedPeople = calculateAmounts(totalAmount, adjustedPeople);
    setPeople(updatedPeople);
  };

  const handleSplitTypeChange = (type: 'equal' | 'custom') => {
    setSplitType(type);
    
    if (type === 'equal') {
      const equalPercentage = 100 / people.length;
      const equalPeople = people.map(person => ({
        ...person,
        percentage: equalPercentage
      }));
      
      setPeople(calculateAmounts(totalAmount, equalPeople));
    }
  };

  const handleSendSplitRequest = () => {
    if (totalAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid total amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!receiverDetails.upiId) {
      toast({
        title: "Receiver UPI ID required",
        description: "Please enter the receiver's UPI ID",
        variant: "destructive",
      });
      return;
    }
    
    setShowSummary(true);
    
    toast({
      title: "Split request prepared!",
      description: `Ready to split ₹${totalAmount.toFixed(2)} for ${description || 'expense'}`,
    });
  };

  const handleSendWhatsAppRequests = () => {
    // Filter people who have phone numbers
    const peopleWithNumbers = people.filter(person => person.phone.trim() !== '');
    
    if (peopleWithNumbers.length === 0) {
      toast({
        title: "No Phone Numbers",
        description: "Please add at least one WhatsApp number to send requests",
        variant: "destructive",
      });
      return;
    }

    // Validate all phone numbers
    for (const person of peopleWithNumbers) {
      if (!person.phone.startsWith('+91')) {
        toast({
          title: "Invalid Phone Number",
          description: `Phone number for ${person.name} should start with +91`,
          variant: "destructive",
        });
        return;
      }
    }

    // Generate and send messages for each person
    peopleWithNumbers.forEach((person, index) => {
      const upiLink = `upi://pay?pa=${receiverDetails.upiId}&pn=${encodeURIComponent(receiverDetails.name)}&am=${person.amount}&cu=INR`;
      const message = `Hey ${person.name}! Please pay ₹${person.amount.toFixed(2)} to ${receiverDetails.name} for ${description || 'expense'}. Pay here: ${upiLink}`;
      
      // Use setTimeout to stagger the opening of tabs
      setTimeout(() => {
        window.open(`https://wa.me/${person.phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
      }, index * 500); // 500ms delay between each tab opening
    });

    toast({
      title: "WhatsApp Requests Sent",
      description: `Payment requests have been opened for ${peopleWithNumbers.length} contacts`,
    });
  };

  const handleReceiverSubmit = () => {
    if (!receiverDetails.upiId) {
      toast({
        title: "UPI ID required",
        description: "Please enter the receiver's UPI ID",
        variant: "destructive",
      });
      return;
    }
    
    setShowReceiverForm(false);
    toast({
      title: "Receiver details saved",
      description: "You can now proceed with splitting the bill",
    });
  };

  return (
    <div className="font-sans flex items-center justify-center mt-14">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4 animate-float">
          <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
            <DollarSign className="text-white" size={24} />
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Split a Bill</h1>
        </div>
        
        {showReceiverForm ? (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700/30 animate-slide-up">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Receiver Details
            </h2>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Your Name (Receiver)
              </label>
              <input
                type="text"
                value={receiverDetails.name}
                onChange={(e) => setReceiverDetails({...receiverDetails, name: e.target.value})}
                placeholder="Your Name"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Your UPI ID
              </label>
              <input
                type="text"
                value={receiverDetails.upiId}
                onChange={(e) => setReceiverDetails({...receiverDetails, upiId: e.target.value})}
                placeholder="username@upi"
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Your WhatsApp Number (Optional)
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="tel"
                  value={receiverDetails.phone}
                  onChange={(e) => setReceiverDetails({...receiverDetails, phone: e.target.value})}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <ParticleButton
              onClick={handleReceiverSubmit}
              className="w-full mt-4"
            >
              Save Receiver Details
            </ParticleButton>
          </div>
        ) : (
          <>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-700/30 animate-slide-up">
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Total Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={totalAmount === 0 ? '' : totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    placeholder="10"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-8 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dinner, movie tickets, etc."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Split Type
                </label>
                <div className="flex gap-4 p-1 bg-gray-900/30 rounded-lg w-fit">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="splitType"
                      checked={splitType === 'equal'}
                      onChange={() => handleSplitTypeChange('equal')}
                      className="sr-only"
                    />
                    <div className={`px-4 py-2 rounded-lg transition-colors ${splitType === 'equal' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                      Equal Split
                    </div>
                  </label>
                  
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="splitType"
                      checked={splitType === 'custom'}
                      onChange={() => handleSplitTypeChange('custom')}
                      className="sr-only"
                    />
                    <div className={`px-4 py-2 rounded-lg transition-colors ${splitType === 'custom' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                      Custom Split
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-gray-300 text-sm font-medium">
                    People
                  </label>
                  <button
                    onClick={handleAddPerson}
                    className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 text-sm px-2 py-1 rounded-lg hover:bg-purple-500/10"
                  >
                    <PlusCircle size={16} />
                    Add Person
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {people.map((person, index) => (
                    <PersonSlider
                      key={person.id}
                      name={person.name}
                      percentage={person.percentage}
                      amount={person.amount}
                      color={person.color}
                      totalAmount={totalAmount}
                      onPercentageChange={(newPercentage) => handlePercentageChange(index, newPercentage)}
                      onRemove={() => handleRemovePerson(person.id)}
                      canRemove={person.name !== 'You' && people.length > 2}
                      phone={person.phone}
                      onPhoneChange={(newPhone) => handlePhoneChange(index, newPhone)}
                      onNameChange={(newName) => handleNameChange(index, newName)}
                      showPhoneInput={!showSummary}
                      showNameInput={!showSummary}
                    />
                  ))}
                </div>
              </div>
              
              <ParticleButton
                onClick={handleSendSplitRequest}
                disabled={totalAmount <= 0}
                className="w-full mt-4"
              >
                Prepare Split Request
              </ParticleButton>
            </div>
            
            <SplitSummary
              totalAmount={totalAmount}
              people={people}
              splitType={splitType}
              showSummary={showSummary}
              receiverDetails={receiverDetails}
              onSendRequests={handleSendWhatsAppRequests}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SplitBill;
