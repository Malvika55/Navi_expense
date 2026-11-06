import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isDemoMode: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setDemoMode: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('navipulse_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('navipulse_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const isConfigured = isSupabaseConfigured();

  // Load user session on mount
  useEffect(() => {
    const supabase = getSupabase();

    if (!supabase || !isConfigured) {
      const savedUser = localStorage.getItem('navipulse_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        const savedProf = localStorage.getItem('navipulse_profile');
        if (savedProf) setProfile(JSON.parse(savedProf));
        setIsDemoMode(false);
      }
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsDemoMode(false);
        fetchProfile(session.user.id, session.user.email ?? '');
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsDemoMode(false);
        fetchProfile(session.user.id, session.user.email ?? '');
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const fetchProfile = async (userId: string, email: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const newProfile: UserProfile = {
          id: userId,
          email,
          full_name: email.split('@')[0],
          upi_id: `${email.split('@')[0]}@navipulse`,
          monthly_budget_target: 65000,
        };
        await supabase.from('profiles').insert(newProfile);
        setProfile(newProfile);
        localStorage.setItem('navipulse_profile', JSON.stringify(newProfile));
      } else if (data) {
        setProfile(data);
        localStorage.setItem('navipulse_profile', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (supabase) {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);
      if (!error) setIsDemoMode(false);
      return { error };
    }

    // Local partitioned account support
    const usersStore = JSON.parse(localStorage.getItem('navipulse_local_users') || '{}');
    const existing = usersStore[email.toLowerCase()];
    if (!existing || existing.password !== password) {
      return { error: new Error('Invalid email or password. If you are new, click "Create Account".') };
    }

    const localProfile: UserProfile = existing.profile;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUser({ id: existing.id, email: existing.email } as any);
    setProfile(localProfile);
    localStorage.setItem('navipulse_current_user', JSON.stringify({ id: existing.id, email: existing.email }));
    localStorage.setItem('navipulse_profile', JSON.stringify(localProfile));
    setIsDemoMode(false);
    return { error: null };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (supabase) {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (!error && data.user) {
        const newProfile: UserProfile = {
          id: data.user.id,
          email,
          full_name: fullName,
          upi_id: `${email.split('@')[0]}@navipulse`,
          monthly_budget_target: 65000,
        };
        await supabase.from('profiles').insert(newProfile);
        setProfile(newProfile);
        setIsDemoMode(false);
      }

      setIsLoading(false);
      return { error };
    }

    // Local partitioned account registration
    const usersStore = JSON.parse(localStorage.getItem('navipulse_local_users') || '{}');
    if (usersStore[email.toLowerCase()]) {
      return { error: new Error('An account with this email already exists. Please sign in.') };
    }

    const newId = `user_${Date.now()}`;
    const newProfile: UserProfile = {
      id: newId,
      email,
      full_name: fullName,
      upi_id: `${email.split('@')[0]}@navipulse`,
      monthly_budget_target: 65000,
    };

    usersStore[email.toLowerCase()] = {
      id: newId,
      email,
      password,
      profile: newProfile,
    };
    localStorage.setItem('navipulse_local_users', JSON.stringify(usersStore));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUser({ id: newId, email } as any);
    setProfile(newProfile);
    localStorage.setItem('navipulse_current_user', JSON.stringify({ id: newId, email }));
    localStorage.setItem('navipulse_profile', JSON.stringify(newProfile));
    setIsDemoMode(false);

    // Initialize fresh empty transactions for this user
    localStorage.setItem(`navipulse_tx_${newId}`, JSON.stringify([]));

    return { error: null };
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsDemoMode(false);
    setProfile(null);
    localStorage.removeItem('navipulse_current_user');
    localStorage.removeItem('navipulse_profile');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates } as UserProfile;
    setProfile(updated);
    localStorage.setItem('navipulse_profile', JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase && user) {
      try {
        await supabase.from('profiles').update(updates).eq('id', user.id);
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
      }
    }
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isDemoMode,
        isConfigured,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfile,
        setDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
