import React, { useState } from 'react';

const AuthorModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [error, setError] = useState('');

    const handleFetchAuthor = async () => {
        try {
            const response = await fetch(`http://localhost:8002/author/book?title=${title}`);
            if (response.ok) {
                const data = await response.json();
                setAuthor(data.author);
                setError('');
            } else {
                setAuthor('');
                setError('没有找到对应的作者');
            }
        } catch (err) {
            setAuthor('');
            setError('请求失败，请稍后再试');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>查找书籍作者</h2>
                <input
                    type="text"
                    placeholder="输入书名"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button onClick={handleFetchAuthor}>查找</button>
                {author && <p>作者: {author}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default AuthorModal;
