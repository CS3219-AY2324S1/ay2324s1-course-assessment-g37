import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginFailed, setLoginFailed] = useState<boolean>(false); // initially set as false

    const [changingPassword, setChangingPassword] = useState<boolean>(false);
    const [userkey, setUserkey] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3001/login", {
                username,
                password
            });

            if (response.status === 200) {
                // Redirect to QuestionBank
                navigate('/question-bank');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // This type guard allows TypeScript to understand the shape of the error object
                console.error('Login failed:', error);
                if (error.response && error.response.status === 401) {
                    setLoginFailed(true);
                }
            } else {
                console.error('An unknown error occurred:', error);
            }
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }
            try {
                const response = await axios.put(`http://localhost:3001/login/${userkey}`, {
                    userkey,
                    oldPassword,
                    newPassword
                });
                if (response.status === 200) {
                    alert("Password changed successfully");

                    setUserkey('');
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');

                    setChangingPassword(false);
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error('Change password failed:', error);
                    if (error.response && error.response.status === 401) {
                        alert("User credential is incorrect");
                    }
                } else {
                    console.error('An unknown error occurred:', error);
                }
            }
    };

    const handleCancel = () => {
        setChangingPassword(false);
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className='login-container'>
            <h1 className='login-header'>Login Page</h1>

            {changingPassword ? (
                <>
                    <div className='input-field'>
                        <label htmlFor="userkey">Username</label>
                        <input id="userkey" type="text" 
                        value={userkey} 
                        onChange={(e) => setUserkey(e.target.value)} />
                    </div>
                    <div className='input-field'>
                        <label htmlFor="oldPassword">Old Password</label>
                        <input id="oldPassword" type="password" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} />
                    </div>                  
                    
                    <div className='input-field'>
                        <label htmlFor="newPassword">New Password</label>
                        <input id="newPassword" type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className='input-field'>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input id="confirmPassword" type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button className='action-button' onClick={handleChangePassword}>Save</button>
                    <button className='action-button' onClick={handleCancel}>Cancel</button>
                </>
            ) : (
                <>
                    <div className='input-field'>
                        <label htmlFor="username">Username</label>
                        <input 
                        id="username" 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className='input-field'>
                        <label htmlFor="password">Password</label>
                        <input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button className='action-button' onClick={handleLogin}>Login</button>
                    <button className='action-button' onClick={() => navigate('/signup')}>Sign Up</button>
                    <button className='action-button' onClick={() => setChangingPassword(true)}>Change Password</button>
                </>
            )}

            {loginFailed && <h2 className='failed'>Login failed</h2>}
        </div>
    );
};

export default LoginPage;
