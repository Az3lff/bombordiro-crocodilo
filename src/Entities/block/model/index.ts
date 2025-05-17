import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// Блок условия "Впереди есть дорога"
Blockly.Blocks['robot_path_ahead'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("впереди есть дорога");
    this.setOutput(true, 'Boolean');
    this.setColour(210);
  }
};

// Блок условия "Слева есть дорога"
Blockly.Blocks['robot_path_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("слева есть дорога");
    this.setOutput(true, 'Boolean');
    this.setColour(210);
  }
};

// Блок условия "Справа есть дорога"
Blockly.Blocks['robot_path_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("справа есть дорога");
    this.setOutput(true, 'Boolean');
    this.setColour(210);
  }
};

// Блок движения вперед
Blockly.Blocks['robot_move'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("двигаться вперед");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
  }
};

// Блок поворота
Blockly.Blocks['robot_turn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("повернуть")
        .appendField(new Blockly.FieldDropdown([
          ["налево", "LEFT"],
          ["направо", "RIGHT"]
        ]), "DIRECTION");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
  }
};

// Генератор кода для блоков
javascriptGenerator['robot_path_ahead'] = function() {
  return ['await checkPath("ahead")', javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['robot_path_left'] = function() {
  return ['await checkPath("left")', javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['robot_path_right'] = function() {
  return ['await checkPath("right")', javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['robot_move'] = function() {
  return 'await moveForward();\n';
};

javascriptGenerator['robot_turn'] = function(block) {
  const direction = block.getFieldValue('DIRECTION');
  return `await turn("${direction}");\n`;
};