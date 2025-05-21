import React, { useEffect, useRef, useState } from "react";
import { BlocklyWorkspace } from "react-blockly";
import { initCustomBlocks } from "./blockly-init";
import { javascriptGenerator } from "blockly/javascript";
import "./styles.css";
import * as Blockly from 'blockly/core';
import * as ru from 'blockly/msg/ru';

import { useUnit } from "effector-react";
import { setBlocklyCode } from "../store/store";
import { timerStarted } from '../timer/store';

const BlocklyComponent = () => {
  const [workspace, setWorkspace] = useState<any | null>(null);
  const setCode = useUnit(setBlocklyCode);

  useEffect(() => {
    Blockly.setLocale(ru as unknown as { [key: string]: string });
    initCustomBlocks();
  }, []);

  // const toolbox = {
  //   kind: "categoryToolbox",
  //   contents: [
  //     {
  //       kind: "category",
  //       name: "Логика",
  //       colour: "#5C81A6",
  //       contents: [
  //         { kind: "block", type: "controls_if" },
  //         { kind: "block", type: "logic_compare" },
  //         { kind: "block", type: "timer" },
  //         { kind: "block", type: "wall_detect" },
  //         { kind: "block", type: "line_detect" },
  //         { kind: "block", type: "math_number" }
  //       ],
  //     },
  //     {
  //       kind: "category",
  //       name: "Циклы",
  //       colour: "#5CA65C",
  //       contents: [
  //         { kind: "block", type: "controls_whileUntil" },
  //       ]
  //     },
  //     {
  //       kind: "category",
  //       name: "Действия",
  //       colour: "#5CA65C",
  //       contents: [
  //         { kind: "block", type: "move" },
  //         { kind: "block", type: "capture" }
  //       ],
  //     },
  //   ],
  // };

  // Базовый toolbox (всегда доступен)
  const baseToolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Базовые действия",
        colour: "#77a877",
        contents: [
          { kind: "block", type: "move_forward" }, // Убрать 1 условие
          { kind: "block", type: "stop_moving" },
          { kind: "block", type: "turn_right" }, // Сделать по градусам
          { kind: "block", type: "turn_left" }, // Сделать по градусам
        ],
      },
      {
        kind: "category",
        name: "Логика",
        colour: "#5C81A6",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "math_number" },
        ],
      },
      {
        kind: "category",
        name: "Циклы",
        colour: "#5CA65C",
        contents: [
          { kind: "block", type: "controls_whileUntil" },
          { kind: "block", type: "controls_for" },
          { kind: "block", type: "controls_repeat_ext" },
        ],
      },
      {
        kind: "category",
        name: "Переменные",
        custom: "VARIABLE",
        colour: "#A65C81"
      },
    ],
  };

// Продвинутый toolbox
  const toolbox = {
    kind: "categoryToolbox",
    contents: [
      ...baseToolbox.contents, // включаем базовые
      {
        kind: "category",
        name: "Действия",
        colour: "#077e07",
        contents: [
          { kind: "block", type: "move" },
          { kind: "block", type: "write_msg" },
          { kind: "block", type: "capture" },
        ],
      },
      {
        kind: "category",
        name: "Датчики",
        colour: "#95325a",
        contents: [
          { kind: "block", type: "timer" },
          { kind: "block", type: "timer_reset" },
          { kind: "block", type: "encoder" },
          { kind: "block", type: "encoder_reset" },
          { kind: "block", type: "wall_detect" },
          { kind: "block", type: "line_detect" },
        ],
      },
    ],
  };

  const workspaceConfiguration = {
    grid: {
      spacing: 20,
      length: 3,
      colour: "#ccc",
      snap: true,
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
    move: {
      scrollbars: true,
      drag: true,
      wheel: true,
    },
  };

const handleRunClick = async () => {
  if (workspace) {
    const code = javascriptGenerator.workspaceToCode(workspace);
    console.log("🔁 Blockly JS Code:", code);
    setCode(code);

    // 🔹 Старт Effector-таймера (обнуляет и запускает отсчёт)
    timerStarted();

    const wrappedCode = `
      let __timerStart = Date.now();
      return (async () => {
        ${code}
      })();
    `;

    try {
      const run = new Function(wrappedCode);
      await run();
    } catch (e) {
      console.error("Ошибка при выполнении кода:", e);
    }
  }
};

  return (
    <div style={{ height: "100vh", width: "40vw", position: "relative", overflow: "hidden" }}>
      <BlocklyWorkspace
        toolboxConfiguration={toolbox}
        workspaceConfiguration={workspaceConfiguration}
        initialXml=""
        className="fill-container"
        onWorkspaceChange={setWorkspace}
      />
      <button
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: "10px 16px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
        onClick={handleRunClick}
      >
        ▶ Запустить
      </button>
    </div>
  );
};

export default BlocklyComponent;
