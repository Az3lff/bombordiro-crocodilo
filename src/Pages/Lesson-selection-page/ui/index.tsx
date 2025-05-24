import styled from "styled-components";
import { useUnit } from "effector-react";
import { $maps, fetchMapsFx } from "../../../Entities/maps/store";
import { useEffect, useState } from "react";
import { Radio } from "antd";
import PDFViewer from "../../../Features/PdfViewer";

const LessonSelectionPage = () => {
    const maps = useUnit($maps);

    const [radioValue, setRadioValue] = useState<string | null>(null)

    useEffect(() => {
        fetchMapsFx();
    }, []);
    return <Container>
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