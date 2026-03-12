"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const [role, setRole] = useState<"owner" | "tenant">("tenant");

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <motion.div {...fadeInUp}>
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Create Account
        </h2>
        <p className="mt-3 text-lg text-gray-500">
          Join our community and manage rentals effortlessly.
        </p>
      </motion.div>

      {/* ROLE SELECTOR TOGGLE */}
      <div className="relative flex p-1 bg-gray-100 rounded-xl mt-8">
        <motion.div
          className="absolute inset-y-1 bg-white rounded-lg shadow-sm w-[calc(50%-4px)]"
          animate={{ x: role === "tenant" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button
          onClick={() => setRole("tenant")}
          className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors ${role === "tenant" ? "text-blue-600" : "text-gray-500"}`}
        >
          I'm a Tenant
        </button>
        <button
          onClick={() => setRole("owner")}
          className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors ${role === "owner" ? "text-blue-600" : "text-gray-500"}`}
        >
          I'm an Owner
        </button>
      </div>

      <motion.form 
        className="mt-6 space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-4">
          {/* Full Name */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input type="text" required className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" />
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input type="email" required className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com" />
            </div>
          </div>

          {/* Password */}
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input type="password" required className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="••••••••" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 py-2">
          <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm text-gray-600 leading-snug">
            By creating an account, you agree to our <a href="#" className="text-blue-600 font-semibold underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-semibold underline">Privacy Policy</a>.
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
        >
          Create {role === "owner" ? "Owner" : "Tenant"} Account
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </motion.form>

      <motion.p {...fadeInUp} transition={{ delay: 0.4 }} className="text-center text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">Log in</Link>
      </motion.p>
    </div>
  );
}