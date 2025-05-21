import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import "blockly/javascript";
import {javascriptGenerator} from 'blockly/javascript';

const BlocklyEditor = () => {
  const blocklyDiv = useRef(null);
  const toolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Логика",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
        ],
      },
    ],
  };

  useEffect(() => {
    if (blocklyDiv.current) {
      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
        //tooltips: true,
        comments: true,       // (опционально) поддержка комментариев к блокам
      });

      // Генерация кода при изменении
      const changeListener = () => {
        const code = javascriptGenerator.workspaceToCode(workspace);
        console.log("Сгенерированный код:", code);
      }
  
      workspace.addChangeListener(() => {
        const code = javascriptGenerator.workspaceToCode(workspace);
        console.log("Сгенерированный код:", code);
      });
      return () => {
        if (workspace) {
          workspace.removeChangeListener(changeListener);
          workspace.dispose();
        }
      };
    }
  }, []);

  return <div ref={blocklyDiv} style={{ width: 500, height: 500}} />;
};

export default BlocklyEditor;
