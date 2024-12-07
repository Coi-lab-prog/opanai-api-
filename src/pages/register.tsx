import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            router.push('/login');
        } else {
            alert(data.error || 'Register failed');
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
            <a href="/login">Login</a>
        </div>
    );
}
