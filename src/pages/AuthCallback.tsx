import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error retrieving session:", error);
        navigate("/login");
        return;
      }

      if (data.session) {
        // User is signed in, redirect to profile (or home)
        navigate("/profile");
      } else {
        // No session, send to login
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Signing you in...</p>
    </div>
  );
};

export default AuthCallback;
