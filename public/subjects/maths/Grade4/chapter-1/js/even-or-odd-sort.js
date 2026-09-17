/* ============================================================
   Launch Pad Q8 — even or odd sort.
   Circle even numbers, cross out odd numbers.
   ============================================================ */

(function () {
  'use strict';

  var NUMBERS = [2347, 5642, 984, 1003, 7648, 3764, 4981, 5067, 7650, 1234];
  var ROW_SIZE = 5;
  var ROW_LABELS = ['a', 'b'];

  var stage = document.getElementById('q-stage');
  var prompt = document.getElementById('q-prompt');

  var circleTool = null;
  var crossTool = null;

  var activeTool = 'circle';
  var numberItems = [];
  var totalNumbers = NUMBERS.length;
  var correctCount = 0;

  function init() {
    prompt.innerHTML = 'Circle the even numbers and cross out the odd numbers.';
    buildToolSelector();
    buildBoard();
  }

  function buildToolSelector() {
    var section = document.createElement('div');
    section.className = 'eo-tool-section';

    var selector = document.createElement('div');
    selector.className = 'eo-tool-selector';
    selector.setAttribute('role', 'group');
    selector.setAttribute('aria-label', 'Choose a marking tool');

    var circleBtn = document.createElement('button');
    circleBtn.className = 'eo-tool-btn circle-tool active';
    circleBtn.type = 'button';
    circleBtn.draggable = false;
    circleBtn.setAttribute('aria-label', 'Drag the circle to an even number');
    circleBtn.setAttribute('aria-pressed', 'true');
    circleBtn.innerHTML = '<span class="eo-tool-symbol" aria-hidden="true">○</span> Drag Circle to Even';
    circleBtn.addEventListener('click', function () { setTool('circle'); });
    addDragHandlers(circleBtn.querySelector('.eo-tool-symbol'), 'circle');

    var crossBtn = document.createElement('button');
    crossBtn.className = 'eo-tool-btn cross-tool';
    crossBtn.type = 'button';
    crossBtn.draggable = false;
    crossBtn.setAttribute('aria-label', 'Drag the line to an odd number');
    crossBtn.setAttribute('aria-pressed', 'false');
    crossBtn.innerHTML = '<span class="eo-tool-symbol" aria-hidden="true">╱</span> Drag Line to Odd';
    crossBtn.addEventListener('click', function () { setTool('cross'); });
    addDragHandlers(crossBtn.querySelector('.eo-tool-symbol'), 'cross');

    selector.appendChild(circleBtn);
    selector.appendChild(crossBtn);
    section.appendChild(selector);
    stage.appendChild(section);

    circleTool = circleBtn;
    crossTool = crossBtn;
  }

  function addDragHandlers(toolSymbol, tool) {
    toolSymbol.draggable = true;
    toolSymbol.addEventListener('dragstart', function (event) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', tool);
      setTool(tool);
      toolSymbol.classList.add('dragging');

      var dragPreview = toolSymbol.cloneNode(true);
      dragPreview.classList.add('eo-drag-preview');
      document.body.appendChild(dragPreview);
      event.dataTransfer.setDragImage(dragPreview, 20, 20);
      toolSymbol._dragPreview = dragPreview;
    });

    toolSymbol.addEventListener('dragend', function () {
      toolSymbol.classList.remove('dragging');
      if (toolSymbol._dragPreview) {
        toolSymbol._dragPreview.remove();
        toolSymbol._dragPreview = null;
      }
      numberItems.forEach(function (item) {
        item.classList.remove('drop-ready');
      });
    });
  }

  function buildBoard() {
    var board = document.createElement('div');
    board.className = 'eo-board';
    numberItems = [];

    for (var r = 0; r < ROW_LABELS.length; r++) {
      var row = document.createElement('div');
      row.className = 'eo-row';

      var label = document.createElement('span');
      label.className = 'eo-row-label';
      label.textContent = ROW_LABELS[r];
      row.appendChild(label);

      var numsWrap = document.createElement('div');
      numsWrap.className = 'eo-row-nums';

      var start = r * ROW_SIZE;
      for (var i = 0; i < ROW_SIZE; i++) {
        var num = NUMBERS[start + i];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'eo-num';
        btn.dataset.number = num;
        btn.textContent = num;
        btn.setAttribute('aria-label', 'Drop a circle or line on ' + num);
        btn.addEventListener('dragover', function (event) {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
          btn.classList.add('drop-ready');
        });
        btn.addEventListener('dragleave', function () {
          btn.classList.remove('drop-ready');
        });
        btn.addEventListener('drop', createDropHandler(btn));
        numsWrap.appendChild(btn);
        numberItems.push(btn);
      }

      row.appendChild(numsWrap);
      board.appendChild(row);
    }

    stage.appendChild(board);
  }

  function createDropHandler(item) {
    return function (event) {
      event.preventDefault();
      item.classList.remove('drop-ready');
      var droppedTool = event.dataTransfer.getData('text/plain');
      if (droppedTool === 'circle' || droppedTool === 'cross') {
        setTool(droppedTool);
        markNumber(item, droppedTool);
      }
    };
  }

  function setTool(tool) {
    activeTool = tool;

    var circleActive = tool === 'circle';
    var crossActive = tool === 'cross';

    circleTool.classList.toggle('active', circleActive);
    crossTool.classList.toggle('active', crossActive);

    circleTool.setAttribute('aria-pressed', String(circleActive));
    crossTool.setAttribute('aria-pressed', String(crossActive));
  }

  function expectedMark(number) {
    return number % 2 === 0 ? 'circle' : 'cross';
  }

  function markNumber(item, tool) {
    if (item.classList.contains('answer-correct')) {
      return;
    }

    var number = Number(item.dataset.number);
    var correctMark = expectedMark(number);
    var selectedTool = tool || activeTool;
    var isCorrect = selectedTool === correctMark;

    item.classList.remove('marked-circle', 'marked-cross', 'answer-correct', 'answer-wrong');

    if (isCorrect) {
      item.classList.add(correctMark === 'circle' ? 'marked-circle' : 'marked-cross');
      item.setAttribute('data-mark', correctMark);
      item.classList.add('answer-correct');
      correctCount++;
      var msg = number + ' is ' + (correctMark === 'circle' ? 'even' : 'odd') + ' — correct!';
      if(correctCount === totalNumbers){
        Quiz.showPopout('correct', msg, function(){
          Quiz.showCongrats(correctCount, totalNumbers, '★★★', function(){ clearActivity(); });
        });
      } else {
        Quiz.showPopout('correct', msg);
      }
    } else {
      item.classList.add(selectedTool === 'circle' ? 'marked-circle' : 'marked-cross');
      item.setAttribute('data-mark', selectedTool);
      item.classList.add('answer-wrong');
      Quiz.showPopout('wrong', number + ' is ' + (correctMark === 'circle' ? 'even' : 'odd') + ' — try again!');
      setTimeout(function () {
        item.classList.remove('marked-circle', 'marked-cross', 'answer-wrong');
        item.removeAttribute('data-mark');
      }, 1800);
    }
  }

  function clearActivity() {
    numberItems.forEach(function (item) {
      item.classList.remove('marked-circle', 'marked-cross', 'answer-correct', 'answer-wrong');
      item.removeAttribute('data-mark');
    });

    correctCount = 0;
    setTool('circle');
  }

  init();
})();
