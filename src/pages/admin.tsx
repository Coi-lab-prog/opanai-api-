import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        } else {
            fetch('/api/admin/users', { headers: { 'Authorization': 'Bearer ' + token } })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setUsers(data);
                    } else {
                        alert(data.error || 'No access');
                        window.location.href = '/login';
                    }
                })
        }
    }, []);

    async function toggleActive(userId: number, currentActive: boolean) {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ userId, isActive: !currentActive })
        });
        const data = await res.json();
        if (data.success) {
            setUsers(users.map((u: any) => u.id === userId ? { ...u, isActive: !currentActive } : u));
        } else {
            alert(data.error || 'Fail');
        }
    }

    return (
        <div>
            <h1>Admin User Management</h1>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Token Usage</th>
                        <th>Active</th>
                        <th>Toggle</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u: any) => (
                        <tr key={u.id}>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.tokenUsage}</td>
                            <td>{u.isActive ? 'Yes' : 'No'}</td>
                            <td><button onClick={() => toggleActive(u.id, u.isActive)}>{u.isActive ? 'Disable' : 'Enable'}</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
