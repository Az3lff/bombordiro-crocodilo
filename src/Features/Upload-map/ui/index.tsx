import React, { useRef } from "react";
import { useUnit } from "effector-react";
import {
    $formData,
    titleChanged,
    descriptionFileChanged,
    mapFileChanged,
    uploadMapFx,
    $uploadMapError,
    setUploadMapError,
} from "../model"
import Button from "../../../Shared/UI/Button"
import "./styles.css"

const UploadMapModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const formData = useUnit($formData);
    const error = useUnit($uploadMapError);
    const descInputRef = useRef<HTMLInputElement>(null);
    const mapInputRef = useRef<HTMLInputElement>(null);
    function hasValidExtension(file: File, extensions: string[]) {
        const fileName = file.name.toLowerCase();
        return extensions.some(ext => fileName.endsWith(ext));
    }
    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => titleChanged(e.target.value);
    const onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        console.log("Selected desc file:", file?.name);
        if (!file) return;
        if (!hasValidExtension(file, ['.pdf'])) {
            alert('Можно загружать только файлы .pdf');
            e.target.value = '';
            return;
        }
        descriptionFileChanged(file);
    }
    const onMapFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        console.log("Selected map file:", file?.name);
        if (!file) return;
        if (!hasValidExtension(file, ['.glb'])) {
            alert('Можно загружать только файлы .glb');
            e.target.value = '';
            return;
        }
        mapFileChanged(file);
    };

  // Отправка формы
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    if (!formData.title || !formData.file || !formData.desc) {
      setUploadMapError("Заполните все поля!");
      return;
    }
    try {
        await uploadMapFx(formData);
        if (descInputRef.current) descInputRef.current.value = "";
        if (mapInputRef.current) mapInputRef.current.value = "";
        onClose();
    } catch {
        console.log(error)
        setUploadMapError("Ошибка загрузки уровня");
    }
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h2 style={{ textAlign: "center", marginBottom: 10 }}>Загрузка уровня</h2>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="modal-content__wrapper">
            <div className="form-group">
                <label htmlFor="title">Название:</label>
                <input
                    type="text"
                    onChange={onTitleChange}
                    value={formData.title || ""}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="descInput">Описание (файл .pdf):</label>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={onDescChange}
                    ref={descInputRef}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="fileInput">Файл уровня (.glb):</label>
                <input
                    type="file"
                    accept=".glb"
                    onChange={onMapFileChange}
                    ref={mapInputRef}
                    required
                />
            </div>
          </div>
          <Button type="submit">
            Загрузить уровень
          </Button>
        </form>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default UploadMapModal;