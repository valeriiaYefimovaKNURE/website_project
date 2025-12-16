import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icons from '../constants/icons';
import '../styles/CreateNewsPage.css';

const CreateNewsPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageUri: '',
        creatorName: '',
        link: '',
        theme: 'Новини',
        isActual: true
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadMethod, setUploadMethod] = useState('url'); // 'url' або 'file'
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const themes = [
        "Спорт",
        "Соціальне",
        "Історія",
        "Активізм",
        "Освіта",
        "Новини",
        "ЛГБТКІА",
        "Психологія"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Очистити помилку для цього поля
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Перевірка типу файлу
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, imageUri: 'Будь ласка, виберіть зображення' }));
            return;
        }

        // Перевірка розміру (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, imageUri: 'Розмір файлу не повинен перевищувати 5MB' }));
            return;
        }

        setImageFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Очистити помилку
        if (errors.imageUri) {
            setErrors(prev => ({ ...prev, imageUri: '' }));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, imageUri: '' }));
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Назва обов\'язкова';
        }
        
        if (!formData.subtitle.trim()) {
            newErrors.subtitle = 'Опис обов\'язковий';
        }
        
        if (!formData.creatorName.trim()) {
            newErrors.creatorName = 'Ім\'я автора обов\'язкове';
        }
        
        if (uploadMethod === 'url' && formData.imageUri && !isValidUrl(formData.imageUri)) {
            newErrors.imageUri = 'Невірний формат URL';
        }
        
        if (formData.link && !isValidUrl(formData.link)) {
            newErrors.link = 'Невірний формат URL';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            let imageUrl = formData.imageUri;

            // Якщо завантажено файл, потрібно його спершу завантажити на сервер
            if (uploadMethod === 'file' && imageFile) {
                
                //тут додати логіку
                imageUrl = imagePreview;
                
                console.log('Файл для завантаження:', imageFile);
            }

            const newsData = {
                ...formData,
                imageUri: imageUrl,
                date: new Date().toISOString(),
                likes: 0
            };
            
            
            console.log('Створено новину:', newsData);
            
            // переход на сторінку з новинами
            navigate("/");
        } catch (error) {
            console.error('Помилка при створенні новини:', error);
            setErrors({ submit: 'Не вдалося створити новину. Спробуйте ще раз.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-news-page">
            <div className="create-news-container">
                <div className="create-news-header">
                <button onClick={() => navigate('/')} className="btn-back">
            <img 
              src={icons.back_arrow_black}
            />
          </button>

                    <h1>Створення нової статті</h1>
                    
                   
                </div>

                <form onSubmit={handleSubmit} className="create-news-form">
                    {/* Основна інформація */}
                    <div className="form-group full-width">
                        <label htmlFor="title">
                            Назва статті <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Введіть назву статті"
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="subtitle">
                            Опис <span className="required">*</span>
                        </label>
                        <textarea
                            id="subtitle"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            placeholder="Введіть опис статті"
                            rows="5"
                            className={errors.subtitle ? 'error' : ''}
                        />
                        {errors.subtitle && <span className="error-message">{errors.subtitle}</span>}
                    </div>

                   
                    <div className="form-group">
                        <label htmlFor="creatorName">
                            Автор <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="creatorName"
                            name="creatorName"
                            value={formData.creatorName}
                            onChange={handleChange}
                            placeholder="Ім'я автора"
                            className={errors.creatorName ? 'error' : ''}
                        />
                        {errors.creatorName && <span className="error-message">{errors.creatorName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="theme">
                            Тематика
                        </label>
                        <select
                            id="theme"
                            name="theme"
                            value={formData.theme}
                            onChange={handleChange}
                        >
                            {themes.map(theme => (
                                <option key={theme} value={theme}>
                                    {theme}
                                </option>
                            ))}
                        </select>
                    </div>

                    
                    <div className="form-group full-width">
                        <label>Фото</label>
                        <div className="upload-method-selector">
                            <button
                                type="button"
                                className={`method-btn ${uploadMethod === 'url' ? 'active' : ''}`}
                                onClick={() => {
                                    setUploadMethod('url');
                                    setImageFile(null);
                                    setImagePreview('');
                                }}
                            >
                                📎 URL посилання
                            </button>
                            <button
                                type="button"
                                className={`method-btn ${uploadMethod === 'file' ? 'active' : ''}`}
                                onClick={() => {
                                    setUploadMethod('file');
                                    setFormData(prev => ({ ...prev, imageUri: '' }));
                                }}
                            >
                                📤 Завантажити файл
                            </button>
                        </div>
                    </div>

                    {uploadMethod === 'url' ? (
                        <div className="form-group full-width">
                            <label htmlFor="imageUri">URL фото</label>
                            <input
                                type="text"
                                id="imageUri"
                                name="imageUri"
                                value={formData.imageUri}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className={errors.imageUri ? 'error' : ''}
                            />
                            {errors.imageUri && <span className="error-message">{errors.imageUri}</span>}
                        </div>
                    ) : (
                        <div className="form-group full-width">
                            <label htmlFor="imageFile">Виберіть файл</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    id="imageFile"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="file-input"
                                />
                                <label htmlFor="imageFile" className="file-input-label">
                                    {imageFile ? imageFile.name : 'Натисніть для вибору файлу'}
                                </label>
                                {imageFile && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="btn-remove-file"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            {errors.imageUri && <span className="error-message">{errors.imageUri}</span>}
                        </div>
                    )}

                    {/* Попередній перегляд фото */}
                    {((uploadMethod === 'url' && formData.imageUri && !errors.imageUri) || 
                      (uploadMethod === 'file' && imagePreview)) && (
                        <div className="image-preview">
                            <img 
                                src={uploadMethod === 'url' ? formData.imageUri : imagePreview} 
                                alt="Попередній перегляд" 
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="link">
                            Посилання (необов'язково)
                        </label>
                        <input
                            type="text"
                            id="link"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://example.com/article"
                            className={errors.link ? 'error' : ''}
                        />
                        {errors.link && <span className="error-message">{errors.link}</span>}
                    </div>
                    
                    {/* актуальність?">
                        <label>
                            <input
                                type="checkbox"
                                name="isActual"
                                checked={formData.isActual}
                                onChange={handleChange}
                            />
                            <span>Актуальна новина</span>
                        </label>
                    </div>
*/}
                    {errors.submit && (
                        <div className="error-message submit-error">
                            {errors.submit}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Створення...' : 'Створити новину'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNewsPage;