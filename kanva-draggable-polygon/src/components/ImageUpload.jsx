import React from 'react';

const ImageUpload = ({ onImageUpload }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result); // 이미지 데이터(base64)를 부모 컴포넌트로 전달
            };
            reader.readAsDataURL(file); // 파일을 base64로 변환
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            {/* label과 input을 블록 요소로 처리 */}
            <label for="file" style={{ display: 'block', marginBottom: '10px' }}>Upload Image</label>
            <input type="file" id="file" accept="image/*" onChange={handleFileChange} style={{ display: 'block' }} />
        </div>
    );
};

export default ImageUpload;

