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
import { clearAllMessages } from "../../debug-window/store";
import { initializePauseControls } from "../../pause-control/init";
import { PauseResumeControls } from "../../../Widgets/Pause-controls/ui";
import styled from "styled-components";
import { resetPlayerPosition } from "../player/store/store";
import { pause, reset, start } from "../../timer/store";

const BlocklyComponent = () => {
  const [workspace, setWorkspace] = useState<any | null>(null);
  const setCode = useUnit(setBlocklyCode);
  const [isRunning, setIsRunning] = useState(false);

  const executionRef = useRef<{ abort: boolean }>({ abort: false });

  useEffect(() => {
    Blockly.setLocale(ru as unknown as { [key: string]: string });
    initCustomBlocks();
    initializePauseControls()

    window.abortExecution = () => {
      executionRef.current.abort = true;
      window.__isPaused = false;
      window.__pauseResolvers = [];
    };
  }, []);

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
          { kind: "block", type: "logic_operation" },
          { kind: "block", type: "text_join" },
          { kind: "block", type: "math_number" },
          { kind: "block", type: "text" },
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

  const handlePause = () => {
    console.log("Execution paused");
    pause()
  };

  const handleResume = () => {
    console.log("Execution resumed");
    start()
  };

  const handleReset = () => {
    console.log("Execution aborted");
    window.abortExecution();
    resetPlayerPosition()
    window.__shouldAbort = true;
    setIsRunning(false);
  };

  const handleRunClick = async () => {
    if (!workspace) return;

    executionRef.current.abort = false;
    const generatedCode = javascriptGenerator.workspaceToCode(workspace);
    clearAllMessages();
    reset()
    start()
    console.log("🔁 Generated Blockly JS Code:", generatedCode);
    setCode(generatedCode);

    window.__timerStart = Date.now();
    window.__isPaused = false;
    window.__pauseResolvers = [];
    setIsRunning(true);

    const wrappedCode = `
      try {
        ${generatedCode
        .split('\n')
        .filter(line => line.trim())
        .map(line => `
            if (window.__shouldAbort) throw new Error('Execution aborted');
            await window.pauseIfNeeded();
            ${line}
          `)
        .join('\n')}
      } catch (e) {
        if (e.message !== 'Execution aborted') {
          console.error("Execution error:", e);
        }
        throw e;
      }
    `;

    try {
      window.__shouldAbort = false;
      const asyncFunc = new Function('return (async () => {' + wrappedCode + '})()');
      await asyncFunc();
    } catch (e: any) {
      if (e.message !== 'Execution aborted') {
        console.error("Ошибка выполнения:", e);
      }
    } finally {
      setIsRunning(false);
      window.__shouldAbort = false;
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
      <PauseResumeControls
        isRunning={isRunning}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
        onRun={handleRunClick}
      />
    </div>
  );
};

export default BlocklyComponent;