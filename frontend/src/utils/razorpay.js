// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment for food orders
export const initiateFoodPayment = async (orderData, user, onSuccess, onFailure) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert("Razorpay SDK failed to load. Please check your internet connection.");
    return;
  }

  const options = {
    key: orderData.keyId,
    amount: orderData.amount * 100,
    currency: orderData.currency,
    name: "AromaOfEmotions",
    description: "Food Order Payment",
    order_id: orderData.orderId,
    handler: function (response) {
      onSuccess({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        paymentId: orderData.paymentId,
        items: orderData.items,
        totalAmount: orderData.amount,
      });
    },
    prefill: {
      name: user.name,
      email: user.email || "",
      contact: user.phone || "",
    },
    theme: {
      color: "#3399cc",
    },
    modal: {
      ondismiss: function () {
        onFailure("Payment cancelled by user");
      },
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

// Initialize Razorpay payment for subscription plans
export const initiatePlanPayment = async (orderData, user, onSuccess, onFailure) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert("Razorpay SDK failed to load. Please check your internet connection.");
    return;
  }

  const options = {
    key: orderData.keyId,
    amount: orderData.amount * 100,
    currency: orderData.currency,
    name: "AromaOfEmotions",
    description: `Subscription: ${orderData.planName}`,
    order_id: orderData.orderId,
    handler: function (response) {
      onSuccess({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        paymentId: orderData.paymentId,
      });
    },
    prefill: {
      name: user.name,
      email: user.email || "",
      contact: user.phone || "",
    },
    theme: {
      color: "#3399cc",
    },
    modal: {
      ondismiss: function () {
        onFailure("Payment cancelled by user");
      },
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
