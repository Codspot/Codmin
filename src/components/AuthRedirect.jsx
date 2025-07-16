import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ALLOWED_EMAILS = (process.env.REACT_APP_ALLOWED_EMAILS || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export default function AuthRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const email = session?.user?.email;
      if (session && ALLOWED_EMAILS.includes(email)) {
        navigate("/", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };
    checkSession();
  }, [navigate]);
  return null;
}
