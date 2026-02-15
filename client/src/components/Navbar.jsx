import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate(); // kisi cheesz pe click karne par doosre pages pe navigate karne ke liye hai.
  const { user } = useUser();
  const { openSignIn } = useClerk(); // iske help se hum sign in form open karte hain.

  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Multix <span className="text-gray-900">AI</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">
          Smart Content Engine
        </p>
      </div>

      {user ? (
        <UserButton /> // This will displayed when the user is logged in.
      ) : (
        // When user is not logget in.
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
        >
          Get started <ArrowRight className="w-4 h-4" />{" "}
        </button>
      )}
    </div>
  );
};

export default Navbar;
