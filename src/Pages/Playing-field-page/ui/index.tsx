import BlocklyComponent from "../../../Entities/block/block-generic"
import Scene from "../../../Features/Scene"

const PlayingFieldPage = () => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "auto auto" }}>
            <BlocklyComponent />
            <Scene />
        </div>
    )
}

export default PlayingFieldPage