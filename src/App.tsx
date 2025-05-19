import BlocklyComponent from "./Entities/block/block-generic";
import BlocklyEditor from "./Features/Block-navigation";
import Scene from "./Features/Scene";

function App() {
  //piska
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto auto" }}>
      <BlocklyComponent />
      <Scene />
    </div>
  );
}

export default App;
