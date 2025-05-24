import Button from "../../../Shared/UI/Button"
import UploadMapModal from "../../../Features/Upload-map/ui";
import { $isClient } from "../../../Entities/session";
import { useUnit } from "effector-react";
import { useState } from "react";
const LessonSelectionPage = () => {
    const isClient = useUnit($isClient);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <>
            <section style={{padding: '40px 0'}} className="maps">
                <div style={{display: 'flex', justifyContent: 'center'}} className="container maps__inner">
                    {!isClient && <Button onClick={openModal}>Загрузка уровня</Button>}
                </div>
            </section>
            <UploadMapModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    )
}

export default LessonSelectionPage;