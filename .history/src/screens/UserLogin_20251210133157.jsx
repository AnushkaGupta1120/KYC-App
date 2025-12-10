

// REGISTER USER COMPONENT
function RegisterUser({ setCurrentScreen, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.mobile || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.mobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    onRegister(form);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentScreen("login")}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Register New User</h2>
        </div>
        <p className="text-indigo-200 text-sm">Create your account to get started</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <input type="checkbox" className="mt-1" required />
            <p className="text-xs text-gray-600">
              I agree to the Terms & Conditions and Privacy Policy
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
}

// OTP VERIFY COMPONENT
function OTPVerify({ setCurrentScreen, pendingRegistration, onVerify }) {
  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otpInput];
    newOTP[index] = value;
    setOtpInput(newOTP);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOTP = otpInput.join("");
    if (enteredOTP.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }
    onVerify(enteredOTP);
  };

  if (!pendingRegistration) {
    return (
      <div className="p-8 text-red-500 text-center">
        Registration data missing. Please register again.
        <button
          onClick={() => setCurrentScreen("register")}
          className="block mt-4 text-indigo-600 underline"
        >
          Go to Register
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentScreen("register")}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Verify OTP</h2>
        </div>
        <p className="text-indigo-200 text-sm">
          Enter the 6-digit code sent to {pendingRegistration.mobile}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <Shield size={40} className="text-indigo-600" />
          </div>

          <div className="flex justify-center gap-3">
            {otpInput.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(i, e.target.value)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-600">
            Didn't receive code?{" "}
            <button className="text-indigo-600 font-bold underline">Resend OTP</button>
          </p>

          <button
            onClick={handleVerify}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} /> Verify & Register
          </button>
        </div>
      </div>
    </div>
  );
}

// REGISTER USER COMPONENT
function RegisterUser({ setCurrentScreen, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.mobile || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.mobile.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    onRegister(form);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentScreen("login")}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Register New User</h2>
        </div>
        <p className="text-indigo-200 text-sm">Create your account to get started</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <input type="checkbox" className="mt-1" required />
            <p className="text-xs text-gray-600">
              I agree to the Terms & Conditions and Privacy Policy
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
}

// OTP VERIFY COMPONENT
function OTPVerify({ setCurrentScreen, pendingRegistration, onVerify }) {
  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otpInput];
    newOTP[index] = value;
    setOtpInput(newOTP);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOTP = otpInput.join("");
    if (enteredOTP.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }
    onVerify(enteredOTP);
  };

  if (!pendingRegistration) {
    return (
      <div className="p-8 text-red-500 text-center">
        Registration data missing. Please register again.
        <button
          onClick={() => setCurrentScreen("register")}
          className="block mt-4 text-indigo-600 underline"
        >
          Go to Register
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-indigo-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentScreen("register")}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Verify OTP</h2>
        </div>
        <p className="text-indigo-200 text-sm">
          Enter the 6-digit code sent to {pendingRegistration.mobile}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <Shield size={40} className="text-indigo-600" />
          </div>

          <div className="flex justify-center gap-3">
            {otpInput.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(i, e.target.value)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-600">
            Didn't receive code?{" "}
            <button className="text-indigo-600 font-bold underline">Resend OTP</button>
          </p>

          <button
            onClick={handleVerify}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} /> Verify & Register
          </button>
        </div>
      </div>
    </div>
  );
}