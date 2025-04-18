import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from "react-qr-code";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from 'emailjs-com';

const Payment = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [memo, setMemo] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [upiLink, setUpiLink] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const currencyOptions = ['INR', 'USD', 'EUR'];

  useEffect(() => {
    const stored = localStorage.getItem('paymentHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('paymentHistory', JSON.stringify(history));
  }, [history]);

  const handlePayment = () => {
    if (!walletAddress.trim() || !amount.trim() || !recipientName.trim() || !senderName.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const upi = `upi://pay?pa=${walletAddress}&pn=${recipientName}&am=${amount}&cu=${currency}&tn=${memo}`;
    setUpiLink(upi);

    const timestamp = new Date().toLocaleString();
    const info = {
      walletAddress,
      amount,
      memo,
      currency,
      recipientName,
      senderName,
      upi,
      timestamp
    };
    setPaymentInfo(info);
    setHistory([...history, info]);
    setShowPopup(true);
    console.log('Generated UPI QR:', upi);
  };

  const downloadPDF = () => {
    const input = document.getElementById('receipt-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`payment_receipt_${Date.now()}.pdf`);
    });
  };

  const sendEmailReceipt = () => {
    const templateParams = {
      to_name: recipientName,
      from_name: senderName,
      message: `Payment of ${amount} ${currency} made to ${walletAddress}. Memo: ${memo || 'N/A'} on ${paymentInfo.timestamp}.`,
      email: 'RECEIVER_EMAIL_HERE'
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
      .then((res) => {
        alert("Receipt emailed successfully!");
      })
      .catch((err) => {
        alert("Failed to send receipt.");
      });
  };

  return (
    <div className="max-w-5xl mx-auto mt-14">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Make Payment</h1>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border border-gray-700/30 animate-slide-up rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Sender Name</label>
          <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white" />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Recipient Name</label>
          <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Receiver name" className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white" />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Recipient UPI ID</label>
          <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="e.g. receiver@upi" className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Amount</label>
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white" />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white">
              {currencyOptions.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Memo (Optional)</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="What's this payment for?" className="w-full bg-[#0f1629] border border-gray-700 rounded-lg p-3 text-white h-32 resize-none" />
        </div>

        <div className="flex justify-between items-center text-gray-400 border-t border-gray-700 pt-4">
          <span>Network Fee</span>
          <span>₹0.25</span>
        </div>

        <button onClick={handlePayment} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
          Pay Now
        </button>

        {upiLink && (
          <div className="mt-6 text-center space-y-4">
            <h2 className="text-lg font-semibold text-white">Scan to Pay</h2>
            <QRCode value={upiLink} size={200} fgColor="#ffffff" bgColor="#0f1629" />
            <p className="text-gray-400 break-all text-sm">{upiLink}</p>
          </div>
        )}

        <button onClick={() => setShowHistory(true)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-4">
          View Payment History
        </button>
      </div>

      {showPopup && paymentInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-900 p-6 rounded-lg text-white w-96" id="receipt-content">
            <h2 className="text-xl font-semibold mb-4">✅ Payment Successful!</h2>
            <p><strong>From:</strong> {paymentInfo.senderName}</p>
            <p><strong>To:</strong> {paymentInfo.recipientName} ({paymentInfo.walletAddress})</p>
            <p><strong>Amount:</strong> {paymentInfo.amount} {paymentInfo.currency}</p>
            <p><strong>Memo:</strong> {paymentInfo.memo || '—'}</p>
            <p><strong>Time:</strong> {paymentInfo.timestamp}</p>

            <div className="flex gap-3 mt-4">
              <button onClick={downloadPDF} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Download PDF</button>
              <button onClick={sendEmailReceipt} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Email Receipt</button>
            </div>
            <button onClick={() => setShowPopup(false)} className="mt-4 w-full bg-red-600 hover:bg-red-700 rounded py-2">Close</button>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg text-white w-[90%] max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">📜 Payment History</h2>
            {history.length === 0 ? (
              <p className="text-gray-400">No payments yet.</p>
            ) : (
              <ul className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((item, idx) => (
                  <li key={idx} className="bg-gray-800 rounded p-3">
                    <p><strong>{item.amount} {item.currency}</strong> to <strong>{item.recipientName}</strong></p>
                    <p className="text-sm text-gray-400">{item.timestamp}</p>
                    <p className="text-sm">Memo: {item.memo || '—'}</p>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowHistory(false)} className="mt-4 w-full bg-red-600 hover:bg-red-700 rounded py-2">Close History</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
