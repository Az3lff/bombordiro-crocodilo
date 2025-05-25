import UploadMapModal from "../../../Features/Upload-map/ui";
import { $isClient, userLoggedOut } from "../../../Entities/session";
import styled from "styled-components";
import { useUnit } from "effector-react";
import { $maps, fetchMapsFx } from "../../../Entities/maps/store";
import { useEffect, useState } from "react";
import { Button, Radio, Tooltip, Typography } from "antd";
import PDFViewer from "../../../Features/PdfViewer";
import { useNavigate } from "react-router-dom";
import { setCurrentMap } from "../../../Entities/maps/current-map-store";
import { LogoutOutlined, PlayCircleOutlined, UploadOutlined } from "@ant-design/icons";

const LessonSelectionPage = () => {
    const maps = useUnit($maps);

    const [radioValue, setRadioValue] = useState<string | null>(null)

    const isClient = useUnit($isClient);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLogout = () => {
        userLoggedOut();
    }

    const navigate = useNavigate()

    useEffect(() => {
        fetchMapsFx();
    }, []);
    return <Container>
        <Tooltip title={'Выйти из системы'}>
            <Button style={{ position: 'absolute', top: 10, left: 10 }} onClick={handleLogout} icon={<LogoutOutlined />} />
        </Tooltip>
        <UploadMapModal isOpen={isModalOpen} onClose={closeModal} />
        <div style={{ display: 'flex', gap: 12 }}>
            <div>
                <section style={{ padding: '0 0', marginTop: 75 }} className="maps">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }} className="container maps__inner">
                        {!isClient &&
                            <Button size={'large'} icon={<UploadOutlined />} style={{ borderRadius: 3 }} onClick={openModal} color={'default'} variant="solid">Добавить уровень</Button>
                        }
                        <Button size={'large'} icon={<PlayCircleOutlined />} style={{ borderRadius: 3 }} color={'primary'} disabled={!radioValue} variant="solid" onClick={() => {
                            setCurrentMap(maps?.find((map) => map.id === radioValue) as any)
                            navigate('/')
                        }}>Загрузить уровень</Button>
                    </div>
                    <div style={{ padding: 10, border: '1px solid #000', borderRadius: 3, marginTop: 12, width: 500, display: 'flex', justifyContent: 'center', marginLeft: 100, marginRight: 100 }}>
                        <Radio.Group style={{ display: 'flex', flexDirection: 'column' }} value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
                            {
                                maps?.map((el) => <Radio style={{ fontSize: 18 }} value={el?.id}>{el?.title}</Radio>)
                            }
                        </Radio.Group>
                    </div>
                </section>
            </div>

            {
                radioValue !== null ? <PDFViewer url={maps?.find((map) => map.id === radioValue)?.desc_url ?? ''} /> : <Typography style={{ fontSize: 30, width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#b4b4b4' }}>Для отображения выберите уровень</Typography>
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
    overflow: hidden;
`