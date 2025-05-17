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

  Blockly.Blocks["string_length"] = {
    init: function () {
      this.appendValueInput("VALUE")
        .setCheck("String")
        .appendField("length of");
      this.setOutput(true, "Number");
      this.setColour(160);
      this.setTooltip("Returns number of letters in the provided text.");
      this.setHelpUrl("http://www.w3schools.com/jsref/jsref_length_string.asp");
    },
  };

  // Регистрируем кастомный блок 1
  Blockly.Blocks["custom_greeting"] = {
    init: function () {
      this.appendValueInput("NAME")
        .setCheck("String")
        .appendField("Приветствие для");
      this.appendDummyInput()
        .appendField("с эмоцией")
        .appendField(
          new Blockly.FieldDropdown([
            ["радостное", "happy"],
            ["грустное", "sad"],
            ["сердитое", "angry"],
          ]),
          "EMOTION"
        );
      this.setOutput(true, "String");
      this.setColour(160);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip("Создает персонализированное приветствие");
    },
  };

  Blockly.Blocks["action_block"] = {
    init: function () {
      // Добавляем поле для названия действия
      this.appendDummyInput()
        .appendField("Действие:")
        .appendField(
          new Blockly.FieldDropdown([
            ["напечатать", "print"],
            ["сохранить", "save"],
            ["удалить", "delete"],
          ]),
          "ACTION_TYPE"
        );

      // Параметр для действия
      this.appendValueInput("VALUE")
        .setCheck("String")
        .appendField("со значением:");

      // Настраиваем как statement-блок (без вывода, только соединения)
      this.setPreviousStatement(true); // Можно подключать сверху
      this.setNextStatement(true); // Можно подключать снизу
      this.setColour(65); // Синий цвет
      this.setTooltip("Блок действия для использования внутри if");
    },
  };

  Blockly.Blocks["turn_right"] = {
    init: function () {
      // Добавляем текстовое поле
      this.appendDummyInput().appendField("Повернуть направо");

      // Настраиваем соединения
      this.setPreviousStatement(true, null); // Вход сверху (любой тип)
      this.setNextStatement(true, null); // Выход снизу (любой тип)
      this.setColour(65); // Синий цвет
      this.setTooltip("Просто текстовый блок с соединениями");
    },
  };
  Blockly.Blocks["turn_left"] = {
    init: function () {
      // Добавляем текстовое поле
      this.appendDummyInput().appendField("Повернуть налево");

      // Настраиваем соединения
      this.setPreviousStatement(true, null); // Вход сверху (любой тип)
      this.setNextStatement(true, null); // Выход снизу (любой тип)
      this.setColour(65); // Синий цвет
      this.setTooltip("Просто текстовый блок с соединениями");
    },
  };
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
      this.setColour(65);
      this.setTooltip("Движение вперед, пока условие выполняется");
    }
  };
  Blockly.Blocks["move_forward"] = {
    init: function () {
      this.appendValueInput("CONDITION")
        .setCheck("Boolean")
        .appendField("Движение");
      this.appendDummyInput()
        .appendField("со скоростью");

      this.appendValueInput("SPEED")
        .setCheck("Number")

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(65);
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
      this.setColour(65); // Синий цвет
      this.setTooltip("Просто текстовый блок с соединениями");
    },
  };

  // Моторы
  Blockly.Blocks["move"] = {
    init: function () {
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([["Левый", "LEFT"], ["Правый", "RIGHT"]]), "MOTOR")
          .appendField("мотор - скорость = ")
          .appendField(new Blockly.FieldNumber(0), "SPEED");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(65);
      this.setTooltip("Движение");
    }
  };

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
      this.setColour(210); // Оранжевый цвет как у условий
      this.setTooltip('Заглушка для условий');
    }
  };

  Blockly.Blocks['condition_stub_2'] = {
    init: function () {
      // Добавляем выпадающий список
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ['true', 'forward'],
            ['false', 'back']
          ]), 'CONDITION')
          .appendField('объект')
          .appendField(new Blockly.FieldDropdown([
            ['спереди', 'forward'],
            ['сзади', 'back'],
            ['справа', 'right'],
            ['слева', 'left']
          ]), 'CONDITION');

      // Настраиваем как булево выражение (для условий)
      this.setOutput(true, 'Boolean');
      this.setColour(210); // Оранжевый цвет как у условий
      this.setTooltip('Заглушка для условий');
    }
  };

  Blockly.Blocks['condition_stub_3'] = {
    init: function () {
      // Добавляем выпадающий список
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ['true', 'forward'],
            ['false', 'back']
          ]), 'CONDITION')
          .appendField('объект')
          .appendField(new Blockly.FieldDropdown([
            ['линия', 'forward'],
          ]), 'CONDITION');

      // Настраиваем как булево выражение (для условий)
      this.setOutput(true, 'Boolean');
      this.setColour(210); // Оранжевый цвет как у условий
      this.setTooltip('Заглушка для условий');
    }
  };

  // Регистрируем кастомный блок 2
  Blockly.Blocks["custom_block"] = {
    init: function () {
      this.appendValueInput("INPUT_NAME")
        .setCheck("Number")
        .appendField("Число:");
      this.appendDummyInput()
        .appendField("Опция:")
        .appendField(
          new Blockly.FieldDropdown([
            ["вариант1", "OPTION1"],
            ["вариант2", "OPTION2"],
          ]),
          "FIELD_NAME"
        );
      this.setOutput(true, "Number");
      this.setColour(120);
      this.setTooltip("Пример кастомного блока");
    },
  };

  if (!javascriptGenerator) {
    throw new Error("javascriptGenerator is not available");
  }

  // Генератор кода для блока приветствия
  javascriptGenerator.forBlock["custom_greeting"] = function (block: any) {
    const name =
      javascriptGenerator.valueToCode(block, "NAME", Order.ATOMIC) || "'друг'";
    const emotion = block.getFieldValue("EMOTION");

    let greeting;
    switch (emotion) {
      case "happy":
        greeting = `Привет, ${name}! Как же я рад тебя видеть! 😊`;
        break;
      case "sad":
        greeting = `Привет, ${name}... Мне сегодня грустно. 😢`;
        break;
      case "angry":
        greeting = `ЧТО ТЕБЕ НАДО, ${name.toUpperCase()}?! 😠`;
        break;
      default:
        greeting = `Привет, ${name}`;
    }

    return [greeting, Order.NONE];
  };

  // Генератор кода для кастомного блока
  javascriptGenerator.forBlock["custom_block"] = function (block: any) {
    const input =
      javascriptGenerator.valueToCode(block, "INPUT_NAME", Order.ATOMIC) || "0";
    const field = block.getFieldValue("FIELD_NAME");

    return [`customFunction(${input}, '${field}')`, Order.FUNCTION_CALL];
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

  javascriptGenerator.forBlock["move"] = function (block: any) {
    const motor = block.getFieldValue("MOTOR");
    const speed = Number(block.getFieldValue("SPEED"));

    return `await window.setMotor("${motor}", ${speed});\n`;
  };

  javascriptGenerator.forBlock['condition_stub'] = function (block) {
    const condition = block.getFieldValue("CONDITION");
    return [`window.turns?.${condition} === true`, javascriptGenerator.ORDER_NONE];
  };
};
