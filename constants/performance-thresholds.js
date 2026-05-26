module.exports = {

  // =========================================
  // PAGE LOAD
  // =========================================

  MAX_LOAD_TIME:
    5000,

  MAX_DOM_COMPLETE:
    4000,

  MAX_RESPONSE_TIME:
    2000,



  // =========================================
  // BROWSER METRICS
  // =========================================

  MAX_JS_HEAP_SIZE:
    15000000,

  MAX_DOM_NODES:
    3000,

  MAX_LAYOUT_COUNT:
    100,

  MAX_TASK_DURATION:
    2,



  // =========================================
  // PAINT METRICS
  // =========================================

  MAX_FIRST_PAINT:
    2000,

  MAX_FIRST_CONTENTFUL_PAINT:
    2500,



  // =========================================
  // RESOURCE METRICS
  // =========================================

  MAX_RESOURCE_COUNT:
    150,

  MAX_RESOURCE_SIZE:
    5000000,



  // =========================================
  // SECURITY RELATED
  // =========================================

  MAX_REDIRECTS:
    5,



  // =========================================
  // CPU / RENDERING
  // =========================================

  MAX_RECALC_STYLE_COUNT:
    100,

  MAX_LAYOUT_DURATION:
    1,



  // =========================================
  // NETWORK
  // =========================================

  MAX_TRANSFER_SIZE:
    10000000
};