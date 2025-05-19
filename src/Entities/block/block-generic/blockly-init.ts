import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";
import "blockly/blocks";
import { startMoving, stopMoving, turnLeft, turnRight } from "../player/store/store";
import { setSpeed } from "../speed/store";

window.movePlayerForward = () => {
  startMoving();
}
window.stopMoving = () => {
  stopMoving();
}
window.turnLeft = () => {
  turnLeft();
}
window.turnRight = () => {
  turnRight();
}

(window as any).delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
(window as any).setSpeed = (speed: number) => { setSpeed(speed) };

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
          .appendField(new Blockly.FieldNumber(0), "SPEED");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#077e07");
      this.setTooltip("Движение");
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
      this.setTooltip("Захват объекта интереса");
    }
  };

  // Поворот направо
  Blockly.Blocks["turn_right"] = {
    init: function () {
      this.appendDummyInput().appendField("Поворот направо. На")
          .appendField(new Blockly.FieldNumber(90), "ANGLE")
          .appendField("°");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#77a877");
      this.setTooltip("Поворот направо");
    },
  };

  // Поворот налево
  Blockly.Blocks["turn_left"] = {
    init: function () {
      this.appendDummyInput().appendField("Поворот налево. На")
          .appendField(new Blockly.FieldNumber(90), "ANGLE")
          .appendField("°");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#77a877");
      this.setTooltip("Поворот налево");
    },
  };

  Blockly.Blocks["move_forward"] = {
    init: function () {
      // this.appendValueInput("CONDITION") убрать
      //     .setCheck("Boolean")
      this.appendDummyInput()
          .appendField("Движение. Скорость =")
      .appendField(new Blockly.FieldNumber(0), "SPEED");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#77a877");
      this.setTooltip("Движение вперед, пока условие выполняется");
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
      this.setTooltip("Остановка движения");
    },
  };

  // УСЛОВИЯ

  Blockly.Blocks['condition_stub'] = {
    init: function () {
      // Добавляем выпадающий список
      this.appendDummyInput()
          .appendField('Пока ')
          .appendField(new Blockly.FieldDropdown([
            ['впереди нет объекта', 'forward'],
            ['сзади нет объекта', 'back'],
            ['справа есть стена', 'right'],
            ['слева есть стена', 'left']
          ]), 'CONDITION');

      // Настраиваем как булево выражение (для условий)
      this.setOutput(true, 'Boolean');
      this.setColour("#95325a");
      this.setTooltip('Стены');
    }
  };

// Детектирование стен с условием расстояния
  Blockly.Blocks['wall_detect'] = {
    init: function () {
      this.appendDummyInput()
          .appendField('Стена')
          .appendField(new Blockly.FieldDropdown([
            ['спереди', 'forward'],
            ['сзади', 'back'],
            ['справа', 'right'],
            ['слева', 'left']
          ]), 'DIRECTION')
          .appendField(new Blockly.FieldDropdown([
            ['есть', 'TRUE'],
            ['нет', 'FALSE']
          ]), 'EXPECTED')
      this.appendDummyInput()
          .appendField('на расстоянии')
          .appendField(new Blockly.FieldDropdown([
            ['=', '=='],
            ['≠', '!='],
            ['<', '<'],
            ['≤', '<='],
            ['>', '>'],
            ['≥', '>=']
          ]), 'OPERATOR')
          .appendField(new Blockly.FieldNumber(1), 'DISTANCE');

      this.setOutput(true, 'Boolean');
      this.setColour("#95325a");
      this.setTooltip('Условие на обнаружение стены и расстояние до неё');
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
      this.setTooltip('Условие на обнаружение линии');
    }
  };

  // TODO: таймер в секундах или миллисекундах
  Blockly.Blocks['timer'] = {
    init: function () {
      // Добавляем выпадающий список
      this.appendDummyInput()
          .appendField('Время')
          .appendField(new Blockly.FieldDropdown([
            ['=', '=='],
            ['≠', '!='],
            ['<', '<'],
            ['≤', '<='],
            ['>', '>'],
            ['≥', '>=']
          ]), 'OPERATOR')
          .appendField(new Blockly.FieldNumber(0), "TIMER_VALUE")
          .appendField("мс");

      this.setOutput(true, 'Boolean');
      this.setColour("#95325a");
      this.setTooltip('Условие на проверку таймера');
    }
  };

  if (!javascriptGenerator) {
    throw new Error("javascriptGenerator is not available");
  }

  javascriptGenerator.forBlock["move"] = function (block: any) {
    const motor = block.getFieldValue("MOTOR");
    const speed = Number(block.getFieldValue("SPEED"));

    return `await window.setMotor("${motor}", ${speed});\n`;
  };

  javascriptGenerator.forBlock['wall_detect'] = function(block) {
    const dir = block.getFieldValue('DIRECTION');
    const expect = block.getFieldValue('EXPECTED');
    const dist = Math.max(0.1, block.getFieldValue('DISTANCE')); // гарантия положительного значения

    return [`window.checkWall('${dir}', ${dist}) === ${expect === 'TRUE'}`, javascriptGenerator.ORDER_LOGICAL_AND];
  };

  javascriptGenerator.forBlock["turn_right"] = function (block: any) {
    return `await window.delay(400);
            await window.turnRight();
            await window.delay(400);`;
  };

  javascriptGenerator.forBlock["turn_left"] = function (block: any) {
    return `await window.delay(400);
            await window.turnLeft();
            await window.delay(400);`;
  };

  javascriptGenerator.forBlock["move_forward"] = function (block) {
    const conditionCode = javascriptGenerator.valueToCode(block, "CONDITION", javascriptGenerator.ORDER_LOGICAL_AND) || "true";
    const speedCode = javascriptGenerator.valueToCode(block, "SPEED", javascriptGenerator.ORDER_ATOMIC) || "5";
    return `
    window.setSpeed(${speedCode})
    while (${conditionCode}) {
      await window.movePlayerForward();
      await new Promise(resolve => setTimeout(resolve, 100)); // Пауза между движением
    }
    await window.stopMoving();
  `;
  };

  javascriptGenerator.forBlock["stop_moving"] = function (block: any) {
    return 'await window.stopMoving();\n';
  };
};
