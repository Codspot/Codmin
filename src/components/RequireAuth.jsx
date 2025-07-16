import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Adjust the import based on your project structure

const ALLOWED_EMAILS = (process.env.REACT_APP_ALLOWED_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean);

export default function RequireAuth({ children }) {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const email = session?.user?.email;
      if (!session || !ALLOWED_EMAILS.includes(email)) {
        if (!ignore) navigate("/login", { replace: true });
      } else {
        if (!ignore) setChecking(false);
      }
    };
    checkSession();
    // Listen for auth state changes, but only call checkSession (no reload)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email && ALLOWED_EMAILS.includes(session.user.email)) {
        if (!ignore) setChecking(false); // Just update state, don't reload
      } else if (event === "SIGNED_OUT") {
        if (!ignore) navigate("/login", { replace: true });
      }
    });
    return () => {
      ignore = true;
      if (listener && listener.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (checking) return null;
  return children;
}
