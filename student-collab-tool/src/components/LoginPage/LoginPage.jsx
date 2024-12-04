import React, { useState, useEffect } from 'react';
import supabase from "../../config/supabaseClient";
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [role, setRole] = useState('student');
    const navigate = useNavigate();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => { // Set up the auth state change listener
            console.log("Auth state changed: ", event, session);

            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                if (session?.user) {
                    console.log("User logged in:", session.user);

                    // this part should fetch the user profile to get the role
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching profile:', error.message);
                        return;
                    }

                    console.log("Fetched profile:", profile);

                    // this part should reroute the user based on the role they chose
                    if (profile?.role === 'admin') {
                        console.log("Redirecting to Admin Page...");
                        navigate('/admin');
                    } else if (profile?.role === 'student') {
                        console.log("Redirecting to Student Page...");
                        navigate('/student');
                    } else {
                        console.error("Role is undefined or invalid.");
                    }
                }
            }
        });

        return () => {
            if (listener && typeof listener.unsubscribe === 'function') {
                listener.unsubscribe();
            }
        };
    }, [navigate]);

    //login function
    const handleLogin = async (e) => {
        e.preventDefault();
    
        console.log('Logging in with email:', email);
    
        const { data: user, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
    
        if (loginError) {
            console.error('Login failed:', loginError.message);
            return;
        }
    
        if (!user) {
            console.error('User object is not available after login.');
            return;
        }
    
        console.log('User logged in:', user);
    
        const { data: profile, error: profileError } = await supabase         // fetches the user's profile to get the role

            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
    
        if (profileError) {
            console.error('Error fetching profile:', profileError.message);
            return;
        }
    
        console.log('Fetched profile:', profile);
    
        // reroutes based on the role
        if (profile?.role === 'admin') {
            console.log("Redirecting to Admin Page...");
            navigate('/admin');
        } else if (profile?.role === 'student') {
            console.log("Redirecting to Student Page...");
            navigate('/student');
        } else {
            console.error("Role is undefined or invalid.");
        }
    };
    

    const handleSignUp = async (e) => {
        e.preventDefault();
    
        console.log('Signing up with email:', email);
    
        const { user, error: signupError } = await supabase.auth.signUp({
            email,
            password,
        });
    
        if (signupError) {
            console.error('Sign-up error:', signupError.message);
            return;
        }
    
        if (user) {
            console.log('User created:', user);
    
            // creates new profile row in the profile table in supabase
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert([{ id: user.id, email: user.email, name, role }]);
    
            if (profileError) {
                console.error('Profile creation error:', profileError.message);
                return;
            }
    
            console.log('Profile created/updated:', { id: user.id, email: user.email, name, role });
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

                    {isSignUp && (
                        <>
                            <div className="input-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="role">Choose your role</label>
                                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </>
                    )}

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
