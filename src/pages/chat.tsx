import { useState, useEffect } from 'react';

export default function ChatPage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 获取用户信息
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        } else {
            fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
                .then(res => res.json())
                .then(data => {
                    if (data.id) {
                        setUser(data);
                    } else {
                        window.location.href = '/login';
                    }
                });
        }
    }, []);

    async function sendMessage() {
        const token = localStorage.getItem('token');
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ messages: newMessages })
        });
        const data = await res.json();
        if (data.message) {
            setMessages([...newMessages, { role: 'assistant', content: data.message }]);
        } else {
            alert(data.error || 'Error');
        }
    }

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Chat</h1>
            <div style={{ border: '1px solid #ccc', height: '300px', overflow: 'auto' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
                        <strong>{m.role}</strong>: {m.content}
                    </div>
                ))}
            </div>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
