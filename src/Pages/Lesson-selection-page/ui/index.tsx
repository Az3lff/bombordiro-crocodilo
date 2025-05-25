import Button from "../../../Shared/UI/Button"
import UploadMapModal from "../../../Features/Upload-map/ui";
import { $isClient } from "../../../Entities/session";
import styled from "styled-components";
import { useUnit } from "effector-react";
import { $maps, fetchMapsFx } from "../../../Entities/maps/store";
import { useEffect, useState } from "react";
import { Radio } from "antd";
import PDFViewer from "../../../Features/PdfViewer";

const LessonSelectionPage = () => {
    const maps = useUnit($maps);

    const [radioValue, setRadioValue] = useState<string | null>(null)
    
    const isClient = useUnit($isClient);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        fetchMapsFx();
    }, []);
    return <Container>
      <section style={{padding: '40px 0'}} className="maps">
                <div style={{display: 'flex', justifyContent: 'center'}} className="container maps__inner">
                    {!isClient && <Button onClick={openModal}>Загрузка уровня</Button>}
                </div>
            </section>
            <UploadMapModal isOpen={isModalOpen} onClose={closeModal} />
        <Radio.Group style={{ display: 'flex', flexDirection: 'column' }} value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
            {
                maps?.map((el) => <Radio value={el?.id}>{el?.title}</Radio>)
            }
        </Radio.Group>
        {
            radioValue !== null && <PDFViewer url={maps?.find((map) => map.id === radioValue)?.desc_url ?? ''} />
        }
    </Container>
}

export default LessonSelectionPage;

const Container = styled.div`
    width: 100%;
    height: 100%;
    margin-top: 20px;
    display: flex;
    gap: 30px;
`