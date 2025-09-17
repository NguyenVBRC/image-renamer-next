"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import styles from "./AuthModal.module.css";

export function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSupabaseConfigured() || !supabase) {
      setError("Authentication is not configured. Please set up Supabase.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });
        if (error) throw error;
      }

      onAuthSuccess();
      onClose();
      // eslint-disable-next-line
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.authModalOverlay}>
      <div className={styles.authModal}>
        <div className={styles.authModalHeader}>
          <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.authModalContent}>
          <p className={styles.authDescription}>
            {isLogin ? "Sign in to get unlimited image analysis" : "Create an account for unlimited access"}
          </p>

          {/* <form onSubmit={handleSubmit} className={styles.authForm}> */}
          <form className={styles.authForm}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button type="submit" className={styles.authSubmitButton} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className={styles.loadingIcon} />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className={styles.authToggle}>
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleMode} className={styles.toggleButton}>
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
