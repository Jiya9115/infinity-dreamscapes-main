import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tell the bouncer to wait and specifically ask Supabase if a session exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoading(false);
    });
  }, []);

  // 1. If we are still checking local storage, show a loading screen (DO NOT kick them yet)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Once loading is finished, if there is TRULY no user, then kick them out
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 3. Otherwise, let them in!
  return <>{children}</>;
};

export default ProtectedRoute;