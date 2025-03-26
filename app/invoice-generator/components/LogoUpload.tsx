import { useState, useRef } from 'react';
import { Image, Button, Form } from 'react-bootstrap';

interface LogoUploadProps {
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
}

export function LogoUpload({ logo, onLogoChange }: LogoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(logo);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      alert('El tamaño del archivo no puede superar 1MB');
      return;
    }

    // Check file type
    if (!file.type.match('image.*')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewUrl(result);
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setPreviewUrl(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="d-flex align-items-center">
      
      <div 
        className="position-relative" 
        style={{ cursor: 'pointer' }} 
        onClick={handleImageClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {previewUrl ? (
          <>
            <Image 
              src={previewUrl} 
              alt="Logo de la empresa" 
              style={{ height: '60px', maxWidth: '120px', objectFit: 'contain' }} 
              className="border rounded p-1"
            />
            {isHovering && (
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleRemoveLogo}
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  padding: '0.1rem 0.35rem',
                  fontSize: '0.7rem',
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <i className="bi bi-x"></i>
              </Button>
            )}
          </>
        ) : (
          <div 
            className="border rounded d-flex align-items-center justify-content-center text-muted"
            style={{ height: '40px', width: '80px', fontSize: '0.8rem' }}
          >
            Subir logo
          </div>
        )}
        
        <Form.Control 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="d-none"
        />
      </div>
    </div>
  );
} 