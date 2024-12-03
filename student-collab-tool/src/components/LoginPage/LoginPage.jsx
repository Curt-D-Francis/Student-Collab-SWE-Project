import React, { useState } from "react";
import supabase from "../../config/supabaseClient";
import './LoginPage.css'; 
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { data: user, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login failed:", error.message);
            return;
        }

        // Fetch user profile to get the role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();      

        if (profileError) {
            console.error("Failed to fetch profile:", profileError.message);
            return;
        }

        if (!profile || !profile.role) {
            console.error("User's role is not defined");
            navigate('/');  // Redirect to login or show an error
            return;
        }

        // Redirect based on role
        if (profile.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/student');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { data: user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error("Sign-up failed:", error.message);
            return;
        }

        // Insert the new user into the profiles table with default role 'student'
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: user.id, email: user.email, role: 'student' }]);

        if (profileError) {
            console.error("Failed to insert profile:", profileError.message);
        } else {
            console.log("User signed up successfully:", user.email);
            navigate('/student');  
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
                <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn">{isSignUp ? 'Sign Up' : 'Login'}</button>
                </form>
                <div>
                    <p>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</p>
                    <button onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Login' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
