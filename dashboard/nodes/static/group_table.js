(function (exports) {
  const positionSelector = "#node-input-widgetX, #node-input-widgetY, #node-input-width, #node-input-height";
  let savedGroupId = "";

  exports.savedGroupId = savedGroupId;
  exports.positionSelector = positionSelector;

  exports.changeSavedGroupId = function (groupId) {
    this.savedGroupId = groupId;
  };
  exports.getGroupGrid = function (nodeId) {
    const groupId = $("#node-input-group").val();
    if (groupId === "_ADD_") return [];
    const groupNode = RED.nodes.node(groupId);
    groupNode._def.reflectEdit(groupId, nodeId);
    return groupNode.groupState;
  };
  exports.getXYWH = function () {
    const x = parseInt($("#node-input-widgetX").val());
    const y = parseInt($("#node-input-widgetY").val());
    const w = parseInt($("#node-input-width").val());
    const h = parseInt($("#node-input-height").val());
    return { x, y, w, h };
  };
  // Validate the widget to place on (x, y, w, h).
  exports.validateXYWH = function (arr) {
    const { x, y, w, h } = this.getXYWH();
    // If x, y, w, h is under or over idx of arr -> return false
    if (x < 0 || y < 0 || w <= 0 || h <= 0 || w > 12 || x + w > arr[0].length || y + h > arr.length) {
      return false;
    }
    // If the space is alredy filled, return false
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + h; j++) {
        if (arr[j][i]) {
          return false;
        }
      }
    }
    return true;
  };
  // Create a table with array
  exports.newTable = function (arr) {
    const row = arr.length;
    const col = arr[0].length;
    // Append a row for column header(1,2,....)
    $("#group-table>tbody").append('<tr id="col-header"></tr>');
    $("#col-header").append("<th></th>");
    for (let j = 0; j < col; j++) {
      $("#col-header").append(`<th scope="col">${j}</th>`);
    }
    // Append group row and col
    for (let i = 0; i < row; i++) {
      // append row
      $("#group-table>tbody").append(`<tr id="row${i}"></tr>`);
      // Append a col for row header(1,2,...)
      $(`#row${i}`).append(`<th scope="row" class="row-header">${i}</th>`);
      // Append col
      for (let j = 0; j < col; j++) {
        const tag = `<td id="col${j}" class="col ${arr[i][j] ? "filled" : "empty"}" ></td>`;
        $(`#row${i}`).append(tag);
      }
    }
    // Table Design
    $(".col").css("border", "dotted black 1px");
    $(".col").css("width", "20px");
    $(".col").css("height", "20px");
    $(".filled").css("background-color", "#DEDEDE");
    $(".empty").css("background-color", "#FFFFFF");
    $("th").css("border", "none");
  };
  // Remove color for new node and return the original color for filled or empty space
  exports.removeColor = function (w, h) {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        $(`#row${j}>#col${i}`).removeClass("new-node");
      }
    }
    $(".filled").css("background-color", "#DEDEDE");
    $(".empty").css("background-color", "#FFFFFF");
  };
  // Add color for new node
  exports.addColor = function () {
    const { x, y, w, h } = this.getXYWH();
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + h; j++) {
        $(`#row${j}>#col${i}`).addClass("new-node");
      }
    }
    $(".new-node").css("background-color", "#D9E5FF");
  };
  // Add new node on group grid
  exports.addNewNode = function (arr) {
    if (!Array.isArray(arr) || !arr[0]) return;
    // Remove 'new-node' class in every row-col
    this.removeColor(arr[0].length, arr.length);
    // if (x, y, w, h) is ok, then put. or error.
    if (this.validateXYWH(arr)) {
      this.addColor();
      $(positionSelector).removeClass("input-error");
    } else {
      $(positionSelector).addClass("input-error");
    }
  };
  exports.changeGroup = function (arr) {
    if (!Array.isArray(arr) || !arr[0]) return;
    const currentGroupId = $("#node-input-group").val();
    const row = arr.length;
    const col = arr[0].length;
    const currow = $("#group-table>tbody>tr").length - 1;
    const curcol = $("#group-table>tbody>#row1>td").length;
    if (currentGroupId === savedGroupId && (currow === row || curcol === col)) return;

    if ($("#node-input-group-table > table").length) {
      $("#node-input-group-table").children("table").remove();
    }
    $("#node-input-group-table").append('<table border="1" id="group-table"><tbody></tbody></table>');
    this.newTable(arr);
    this.addNewNode(arr);
    $(positionSelector).off();
    $(positionSelector).on("change", () => this.addNewNode(arr));
  };
  exports.groupTable = function (nodeId) {
    const arr = this.getGroupGrid(nodeId);
    if (!Array.isArray(arr) || !arr[0]) {
      $("#input-xywh").hide();
    } else {
      $("#input-xywh").show();
      $("#node-input-group-table").append('<table border="1" id="group-table"><tbody></tbody></table>');
      this.newTable(arr);
    }
    $(positionSelector).on("change", () => this.addNewNode(arr));
  };
})(typeof exports === "undefined" ? (this.group_table = {}) : exports);
