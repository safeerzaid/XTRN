import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import api from '../api/axios';
import { useAuth } from '../context/authContext';

const inputClass =
  'border border-gray-300 p-3 w-full rounded-none outline-none focus:border-black';

const FieldError = ({ name, fieldErrors }) =>
  fieldErrors[name] ? <p className="text-red-600 text-xs mt-1">{fieldErrors[name]}</p> : null;

function CheckoutPage() {
  const { items, getTotalPrice, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const total = getTotalPrice();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (form.firstName.trim().length < 1) errors.firstName = 'Enter first name';
    if (form.lastName.trim().length < 1) errors.lastName = 'Enter last name';
    if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = 'Enter a valid 10-digit mobile number';
    if (form.addressLine1.trim().length < 5) errors.addressLine1 = 'Enter your full address';
    if (!form.city.trim()) errors.city = 'Enter your city';
    if (!form.state.trim()) errors.state = 'Enter your state';
    if (!/^\d{6}$/.test(form.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildShippingAddress = () => ({
    fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
    phone: form.phone,
    addressLine1: form.addressLine1.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode,
  });

  const openRazorpayModal = (razorpayData) => {
    const options = {
      key: razorpayData.keyId,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      name: 'XTRN',
      description: 'Order Payment',
      order_id: razorpayData.razorpayOrderId,
      handler: async function (response) {
        try {
          await api.post('/orders/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          await fetchCart(); // server cart clear aayi, athukondu refresh
          navigate('/orders');
        } catch (err) {
          setIsProcessing(false);
          setError(
            err.response?.data?.message ||
              'Payment verification failed. If money was deducted, please contact support.'
          );
        }
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          setError('Payment was cancelled. Your order is saved as pending — you can retry payment from your orders page.');
        },
      },
      prefill: {
        name: `${form.firstName} ${form.lastName}`,
        contact: form.phone,
        email: user?.email || '',
      },
      theme: {
        color: '#000000',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      setIsProcessing(false);
      setError('Payment failed. Please try again.');
    });
    rzp.open();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await api.post('/orders', {
        shippingAddress: buildShippingAddress(),
        paymentMethod,
      });

      if (paymentMethod === 'razorpay') {
        openRazorpayModal(response.data);
      } else {
        await fetchCart();
        navigate('/orders');
      }
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.message?.includes('verify your email')) {
        setError('Please verify your email to place an order.');
        setShowResend(true);
      } else {
        setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        setShowResend(false);
      }
      setIsProcessing(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    try {
      const response = await api.post('/auth/resend-verification', { email: user?.email });
      setResendMessage(response.data.message);
      setError('');
      setShowResend(false);
    } catch (error) {
      setResendMessage(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 font-nav">
        <h2 className="text-2xl font-bold mb-4 uppercase">Your cart is empty</h2>
        <button
          onClick={() => navigate('/men')}
          className="bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-900 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto font-nav">
      <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-black mb-12">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Shipping form */}
        <div className="flex-1">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input name="firstName" type="text" placeholder="First Name"
                  value={form.firstName} onChange={handleChange} className={inputClass} />
                <FieldError name="firstName" fieldErrors={fieldErrors} />
              </div>
              <div>
                <input name="lastName" type="text" placeholder="Last Name"
                  value={form.lastName} onChange={handleChange} className={inputClass} />
                <FieldError name="lastName" fieldErrors={fieldErrors} />
              </div>
            </div>

            <div>
              <input name="phone" type="tel" placeholder="Mobile Number" maxLength={10}
                value={form.phone} onChange={handleChange} className={inputClass} />
              <FieldError name="phone" fieldErrors={fieldErrors} />
            </div>

            <div>
              <input name="addressLine1" type="text" placeholder="Address"
                value={form.addressLine1} onChange={handleChange} className={inputClass} />
              <FieldError name="addressLine1" fieldErrors={fieldErrors} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input name="city" type="text" placeholder="City"
                  value={form.city} onChange={handleChange} className={inputClass} />
                <FieldError name="city" fieldErrors={fieldErrors} />
              </div>
              <div>
                <input name="state" type="text" placeholder="State"
                  value={form.state} onChange={handleChange} className={inputClass} />
                <FieldError name="state" fieldErrors={fieldErrors} />
              </div>
            </div>

            <div>
              <input name="pincode" type="text" placeholder="Pincode" maxLength={6}
                value={form.pincode} onChange={handleChange} className={inputClass} />
              <FieldError name="pincode" fieldErrors={fieldErrors} />
            </div>

            <h2 className="text-xl font-bold uppercase tracking-wider mt-6 mb-2">Payment</h2>

            <div className="flex flex-col gap-3">
              <label className={`flex items-center gap-3 p-4 border cursor-pointer ${paymentMethod === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span className="text-sm font-semibold">Cash on Delivery</span>
              </label>
              <label className={`flex items-center gap-3 p-4 border cursor-pointer ${paymentMethod === 'razorpay' ? 'border-black' : 'border-gray-300'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                />
                <span className="text-sm font-semibold">Pay Online (Card / UPI / Netbanking)</span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex flex-col gap-2">
                <span>{error}</span>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-bold underline hover:text-red-800 disabled:opacity-50 text-left"
                  >
                    {isResending ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
              </div>
            )}
            {resendMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                {resendMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-6 w-full bg-black text-white py-4 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="bg-gray-50 p-8 rounded-2xl sticky top-32">
            <h2 className="text-xl font-bold uppercase tracking-wider text-black mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-4 mb-6 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between gap-4 text-sm">
                  <div className="flex-1">
                    <p className="font-bold uppercase">{item.product?.name}</p>
                    <p className="text-gray-500">
                      Size: {item.size} &nbsp;·&nbsp; ₹{item.product?.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">
                    ₹{(item.product?.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-4 flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-black">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-black">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 mt-4 pt-4">
              <span className="font-bold uppercase tracking-wide">Total</span>
              <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;