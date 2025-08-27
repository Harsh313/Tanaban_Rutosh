import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // ✅ This parses the URL fragment (?code, access_token, etc.)
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        console.error("Error exchanging code:", error);
        navigate("/login");
        return;
      }

      if (data.session) {
        console.log("User signed in:", data.session.user);
        navigate("/profile"); // redirect wherever you want
      } else {
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
