const canvasElm    = document.querySelector("#display-canvas");
const pathTextArea = document.querySelector("#path-text-area");
const adjcTableElm = document.querySelector("#adjacency-table");

const nodeAddBtn    = document.querySelector("#node-add-btn");
const nodeDelBtn    = document.querySelector("#node-del-btn");
const adjcRandomBtn = document.querySelector("#adjc-random-btn");
const adjcClearBtn  = document.querySelector("#adjc-clear-btn");
const adjcConfigBtn = document.querySelector("#adjc-config-btn");
const pathConfigBtn = document.querySelector("#path-config-btn");
const adjcDnldBtn   = document.querySelector("#adjc-download-btn");
const adjcUpldBtn   = document.querySelector("#adjc-upload-btn");
const adjcUpldInput = document.querySelector("#adjc-upload-input");

const graphImgDnldBtn = document.querySelector("#graph-download-btn");
const adjcImgDnldBtn  = document.querySelector("#adjc-img-dnld-btn");

const configBtns   = document.querySelectorAll(".config-btns");
const configPanels = document.querySelectorAll(".config-panels");

const adjcConfigCtn        = document.querySelector("#adjc-config-ctn");
const adjcConfigMinEdge    = document.querySelector("#adjc-config-min-edge");
const adjcConfigMaxEdge    = document.querySelector("#adjc-config-max-edge");
const adjcConfigEdgeDensity = document.querySelector("#adjc-config-edge-density");

const pathConfigCtn     = document.querySelector("#path-config-ctn");
const pathInputStartCtn = document.querySelector("#path-config-start-ctn");
const pathInputEndCtn   = document.querySelector("#path-config-end-ctn");
const algorithmSlct     = document.querySelector("#algorithm-slct");
const pathInputStart    = document.querySelector("#path-config-start-node");
const pathInputEnd      = document.querySelector("#path-config-end-node");

const allInputs = document.querySelectorAll("input");