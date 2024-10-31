import React, {useState} from 'react';
import {Modal, Input, Button, Typography, Alert} from 'antd';

const {Title, Text} = Typography;

const AuthorModal = ({isOpen, onClose}) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [error, setError] = useState('');

    // 处理查询作者请求
    const handleFetchAuthor = async () => {
        try {
            let str;
            str = "http://localhost:8001/author/book?title=" + title;
            // console.log(str);
            const response = await fetch(str);
            if (response.ok) {
                const data = await response.text();  // 改为获取文本
                setAuthor(data);  // 直接设置文本数据为作者
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

    return (
        <Modal
            title="查找书籍作者"
            visible={isOpen}
            onCancel={onClose}
            footer={null}
            centered
        >
            <div style={{textAlign: 'center', marginBottom: '16px'}}>
                <Input
                    placeholder="输入书名"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{marginBottom: '16px'}}
                />
                <Button
                    type="primary"
                    onClick={handleFetchAuthor}
                    style={{width: '100%'}}
                >
                    查找
                </Button>
            </div>

            {/* 显示查询结果 */}
            {author && (
                <Text type="success" style={{display: 'block', textAlign: 'center', marginTop: '16px'}}>
                    作者: {author}
                </Text>
            )}

            {/* 错误消息 */}
            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{marginTop: '16px'}}
                />
            )}
        </Modal>
    );
};

export default AuthorModal;
