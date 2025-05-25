import UploadMapModal from "../../../Features/Upload-map/ui";
import { $isClient } from "../../../Entities/session";
import styled from "styled-components";
import { useUnit } from "effector-react";
import { $maps, fetchMapsFx } from "../../../Entities/maps/store";
import { useEffect, useState } from "react";
import { Button, Radio, Typography } from "antd";
import PDFViewer from "../../../Features/PdfViewer";
import { useNavigate } from "react-router-dom";
import { setCurrentMap } from "../../../Entities/maps/current-map-store";

const LessonSelectionPage = () => {
    const maps = useUnit($maps);

    const [radioValue, setRadioValue] = useState<string | null>(null)

    const isClient = useUnit($isClient);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const navigate = useNavigate()

    useEffect(() => {
        fetchMapsFx();
    }, []);
    return <Container>
        <section style={{ padding: '40px 0' }} className="maps">
            <div style={{ display: 'flex', justifyContent: 'center' }} className="container maps__inner">
                {!isClient && <Button onClick={openModal} color={'default'} variant="solid">Добавить уровень</Button>}
                {radioValue && <Button color={'primary'} variant="solid" onClick={() => {
                    setCurrentMap(maps?.find((map) => map.id === radioValue) as any)
                    navigate('/')
                }}>Загрузить уровень</Button>}
            </div>
        </section>
        <UploadMapModal isOpen={isModalOpen} onClose={closeModal} />
        <div style={{ display: 'flex' }}>
            <Radio.Group style={{ display: 'flex', flexDirection: 'column', width: 700 }} value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
                {
                    maps?.map((el) => <Radio style={{ fontSize: 18 }} value={el?.id}>{el?.title}</Radio>)
                }
            </Radio.Group>
            {
                radioValue !== null ? <PDFViewer url={maps?.find((map) => map.id === radioValue)?.desc_url ?? ''} /> : <Typography>Выберите уровень</Typography>
            }
        </div>
    </Container>
}

export default LessonSelectionPage;

const Container = styled.div`
    width: 100%;
    height: 100%;
    margin-top: 20px;
    gap: 30px;
`