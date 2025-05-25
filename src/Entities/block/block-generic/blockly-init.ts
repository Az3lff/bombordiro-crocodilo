import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";
import "blockly/blocks";
import { startMoving, stopMoving, turnLeft, turnRight } from "../player/store/store";
import { motorsStore } from "../speed/store";
import { addMessage } from "../../debug-window/store";
// import { setSpeed } from "../speed/store";

window.movePlayerForward = () => {
  startMoving();
}
window.stopMoving = () => {
  stopMoving();
}
window.turnLeft = (angle: number) => {
  turnLeft(angle);
}
window.turnRight = (angle: number) => {
  turnRight(angle);
}
window.setMotorSpeed = ({ side, speed }: { side: string, speed: number }) => {
  if (side === 'LEFT') {
    motorsStore.setLeftSpeed(speed)
  }
  else {
    motorsStore.setRightSpeed(speed)
  }
}
window.setBothMotorSpeed = (speed: number) => {
  motorsStore.setBothSpeeds({ left: speed, right: speed })
}

window.delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
window.setBothSpeeds = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
window.addMessage = (message: string[]) => {
  addMessage(message)
}

// Глобально доступный объект с последними расстояниями (обновляется в checkTurns)
declare global {
  interface Window {
    wallSensorData?: Record<'forward' | 'back' | 'left' | 'right', number>;
  }
}

// Расширяем типы для TypeScript
declare module "blockly/javascript" {
  interface JavascriptGenerator {
    custom_greeting(block: any): string | [string, Order];
    custom_block(block: any): string | [string, Order];
    ORDER_ATOMIC: Order;
    ORDER_NONE: Order;
    ORDER_FUNCTION_CALL: Order;
    ORDER_LOGICAL_AND: Order;
  }
}

export const initCustomBlocks = () => {
  if (!Blockly.Blocks) {
    throw new Error("Blockly.Blocks is not available");
  }

  // ДЕЙСТВИЯ

  // Движение
  Blockly.Blocks["move"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Мотор =")
        .appendField(new Blockly.FieldDropdown([["Левый", "LEFT"], ["Правый", "RIGHT"]]), "MOTOR")
        .appendField("Скорость =")
        .appendField(new Blockly.FieldNumber(0, -5, 5), "SPEED");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#077e07");
      this.setTooltip("Устанавливает текущее значение мотору.\nВ интервале от -5 до 5.\n*Отрицательное значение позволяют роботу ехать назад.");
    }
  };

  // TODO: Захват объекта
  Blockly.Blocks["capture"] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Захватить', 'GET'],
          ['Отпустить', 'LEAVE']
        ]), 'STATE')
        .appendField("объект")
        .appendField(new Blockly.FieldDropdown([
          ['cпереди', 'forward'],
          ['cзади', 'back']
        ]), 'CONDITION');

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#077e07");
      this.setTooltip("Захватывает объект интереса.");
    }
  };

  // TODO: Написать сообщение в отладочное окно
  Blockly.Blocks["write_msg"] = {
    init: function () {
      this.appendValueInput("MESSAGE")
        .setCheck("String")
        .appendField("Написать :");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#077e07");
      this.setTooltip("Пишет сообщение в отладочное окно.");
    }
  };

  // TODO: Поворот направо
  Blockly.Blocks["turn_right"] = {
    init: function () {
      this.appendDummyInput().appendField("Поворот направо. На")
        .appendField(new Blockly.FieldNumber(90), "ANGLE")
        .appendField("°");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#77a877");
      this.setTooltip("Поворачивает направо на заданный угол.");
    },
  };

  // TODO: Поворот налево
  Blockly.Blocks["turn_left"] = {
    init: function () {
      this.appendDummyInput().appendField("Поворот налево. На")
        .appendField(new Blockly.FieldNumber(90), "ANGLE")
        .appendField("°");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#77a877");
      this.setTooltip("Поворачивает налево на заданный угол.");
    },
  };

  Blockly.Blocks["move_forward"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Движение. Скорость =")
        .appendField(new Blockly.FieldNumber(0, -5, 5), "SPEED");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#77a877");
      this.setTooltip("Устанавливает текущее значение скорости.\nВ интервале от -5 до 5.\n*Отрицательное значение позволяют роботу ехать назад.");
    }
  };
  Blockly.Blocks["stop_moving"] = {
    init: function () {
      // Добавляем текстовое поле
      this.appendDummyInput().appendField("Остановится");

      // Настраиваем соединения
      this.setPreviousStatement(true, null); // Вход сверху (любой тип)
      this.setNextStatement(true, null); // Выход снизу (любой тип)
      this.setColour("#77a877");
      this.setTooltip("Останавливает движение.");
    },
  };

  // УСЛОВИЯ

  // Датчик стены
  Blockly.Blocks["wall_detect"] = {
    init: function () {
      this.appendDummyInput()
          .appendField("Стена")
          .appendField(
              new Blockly.FieldDropdown([
                ["спереди", "forward"],
                ["сзади", "back"],
                ["слева", "left"],
                ["справа", "right"]
              ]),
              'DIRECTION'
          )
          .appendField("на расстоянии");
      this.setOutput(true, 'Number');
      this.setColour("#95325a");
      this.setTooltip("Возвращает расстояние до ближайшей стены/препятствия в выбранном направлении (макс. 20 ед.)");
    }
  };

  // TODO: детектирование линии
  Blockly.Blocks['line_detect'] = {
    init: function () {
      // Добавляем выпадающий список
      this.appendDummyInput()
        .appendField('Линия')
        .appendField(new Blockly.FieldDropdown([
          ['есть', 'TRUE'],
          ['нет', 'FALSE']
        ]), 'LINE')

      this.setOutput(true, 'Boolean');
      this.setColour("#95325a");
      this.setTooltip('Проверяет наличие черной линии перед роботом.');
    }
  };

  // TODO: таймер в секундах или миллисекундах
  // Blockly.Blocks['timer'] = {
  //   init: function () {
  //     this.appendDummyInput()
  //       .appendField('Значение таймера')
  //       .appendField(new Blockly.FieldDropdown([
  //         ['=', '=='],
  //         ['≠', '!='],
  //         ['<', '<'],
  //         ['≤', '<='],
  //         ['>', '>'],
  //         ['≥', '>=']
  //       ]), 'OPERATOR')
  //       .appendField(new Blockly.FieldNumber(0), "TIMER_VALUE")
  //       .appendField("мс");
  //
  //     this.setOutput(true, 'Boolean');
  //     this.setColour("#95325a");
  //     this.setTooltip('Условие на проверку таймера');
  //   }
  // };
  Blockly.Blocks['timer'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Значение таймера в мс')

      this.setOutput(true, 'Number');
      this.setColour("#95325a");
      this.setTooltip('Возвращает значения таймера.');
    }
  };

  // Сброс таймера
  Blockly.Blocks['timer_reset'] = {
    init: function () {
      this.appendDummyInput().appendField("Сброс таймера");

      // Настраиваем соединения
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#95325a");
      this.setTooltip('Сбрасывает значение таймера до 0 мс.');
    }
  };

  // TODO: Энкодер (датчик пройденного пути)
  Blockly.Blocks['encoder'] = {
    init: function () {
      this.appendDummyInput().appendField("Значение энкодера");

      // Настраиваем соединения
      this.setOutput(true, 'Number');
      this.setColour("#95325a");
      this.setTooltip('Возвращает значение энкодера.');
    }
  };

  // TODO: сброс энкодера
  Blockly.Blocks['encoder_reset'] = {
    init: function () {
      this.appendDummyInput().appendField("Сброс энкодера");

      // Настраиваем соединения
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#95325a");
      this.setTooltip('Сбрасывает значение энкодера до 0.');
    }
  };

  if (!javascriptGenerator) {
    throw new Error("javascriptGenerator is not available");
  }

  javascriptGenerator.forBlock["move"] = function (block: any) {
    const motor = block.getFieldValue("MOTOR");
    const speed = Number(block.getFieldValue("SPEED"));

    return `await window.setMotorSpeed({side: "${motor}", speed: ${speed}});\n`;
  };

  javascriptGenerator.forBlock["wall_detect"] = function (block: any) {
    const direction = block.getFieldValue("DIRECTION");
    const code = `(window.wallSensorData?.["${direction}"] ?? 20)`; // обернуто в скобки
    return [code, javascriptGenerator.ORDER_ATOMIC];
  };

  javascriptGenerator.forBlock["turn_right"] = function (block: any) {
    const angle = block.getFieldValue('ANGLE');
    return `await window.delay(400);
            await window.turnRight(${angle});
            await window.delay(400);`;
  };

  javascriptGenerator.forBlock["turn_left"] = function (block: any) {
    const angle = block.getFieldValue('ANGLE');
    return `await window.delay(400);
            await window.turnLeft(${angle});
            await window.delay(400);`;
  };

  javascriptGenerator.forBlock["move_forward"] = function (block) {
    const speed = block.getFieldValue('SPEED');
    return `
    window.setBothMotorSpeed(${speed})
  `;
  };

  javascriptGenerator.forBlock["write_msg"] = function (block) {
    const msgBlock = block.getInputTargetBlock('MESSAGE');

    // Обработка text_join
    if (msgBlock && msgBlock.type === 'text_join') {
      const items = [];
      let i = 0;
      while (true) {
        const inputName = 'ADD' + i;
        if (!msgBlock.getInput(inputName)) break;

        const itemCode = javascriptGenerator.valueToCode(
          msgBlock,
          inputName,
          javascriptGenerator.ORDER_NONE
        ) || "''";

        items.push(itemCode);
        i++;
      }

      if (items.length > 0) {
        console.log(items)
        return `await window.addMessage([${items}])\n`;
      }
    }

    // Обычная обработка
    const message = javascriptGenerator.valueToCode(
      block,
      'MESSAGE',
      javascriptGenerator.ORDER_ATOMIC
    ) || "''";

     return ``;
  };

  javascriptGenerator.forBlock["stop_moving"] = function (block: any) {
    return `window.setBothMotorSpeed(${0})\n`;
  };

  // Значение таймера
  javascriptGenerator.forBlock["timer"] = function (block: any) {
    return [`(Date.now() - window.__timerStart)`, javascriptGenerator.ORDER_ATOMIC];
  };

  // Сброс таймера
  javascriptGenerator.forBlock["timer_reset"] = function () {
    return "window.__timerStart = performance.now();\n";
  };

  javascriptGenerator.forBlock["controls_whileUntil"] = function (block) {
    const until = block.getFieldValue("MODE") === "UNTIL";
    const conditionCode = javascriptGenerator.valueToCode(block, "BOOL", javascriptGenerator.ORDER_NONE) || "false";
    const branchCode = javascriptGenerator.statementToCode(block, "DO");
    const condition = until ? `!(${conditionCode})` : conditionCode;

    return `
    while (${condition}) {
      ${branchCode}
      await window.delay(0); // 🔹 предотвращает блокировку event loop
    }
  `;
  };

};
