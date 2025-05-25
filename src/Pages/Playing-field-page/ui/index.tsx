import BlocklyComponent from "../../../Entities/block/block-generic"
import Scene from "../../../Features/Scene"

const PlayingFieldPage = () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", height: '100%', width: '100%' }}>
            <BlocklyComponent />
            <Scene />
        </div>
    )
}

export default PlayingFieldPage