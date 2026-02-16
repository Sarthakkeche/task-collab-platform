import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            alert('Registration failed. Email might be taken.',err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-6 font-bold text-center">Create Account</h2>
                <input 
                    name="username"
                    className="w-full p-2 mb-3 border rounded" 
                    placeholder="Username" 
                    onChange={handleChange} 
                />
                <input 
                    name="email"
                    type="email"
                    className="w-full p-2 mb-3 border rounded" 
                    placeholder="Email" 
                    onChange={handleChange} 
                />
                <input 
                    name="password"
                    type="password"
                    className="w-full p-2 mb-4 border rounded" 
                    placeholder="Password" 
                    onChange={handleChange} 
                />
                <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Sign Up</button>
                <p className="mt-4 text-sm text-center">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </form>
        </div>
    );
};

export default Register;