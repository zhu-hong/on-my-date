'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const TimeTiny = {
  Second: 1e3,
  Minute: 1e3 * 60,
  Hour: 1e3 * 60 * 60,
  Day: 1e3 * 60 * 60 * 24
};

const month31day = [1, 3, 5, 7, 8, 10, 12];
const month30day = [4, 6, 9, 11];
function isLeapYear(year) {
  if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)
    return true;
  return false;
}

const lunarSet = [
  19416,
  19168,
  42352,
  21717,
  53856,
  55632,
  91476,
  22176,
  39632,
  21970,
  19168,
  42422,
  42192,
  53840,
  119381,
  46400,
  54944,
  44450,
  38320,
  84343,
  18800,
  42160,
  46261,
  27216,
  27968,
  109396,
  11104,
  38256,
  21234,
  18800,
  25958,
  54432,
  59984,
  92821,
  23248,
  11104,
  100067,
  37600,
  116951,
  51536,
  54432,
  120998,
  46416,
  22176,
  107956,
  9680,
  37584,
  53938,
  43344,
  46423,
  27808,
  46416,
  86869,
  19872,
  42416,
  83315,
  21168,
  43432,
  59728,
  27296,
  44710,
  43856,
  19296,
  43748,
  42352,
  21088,
  62051,
  55632,
  23383,
  22176,
  38608,
  19925,
  19152,
  42192,
  54484,
  53840,
  54616,
  46400,
  46752,
  103846,
  38320,
  18864,
  43380,
  42160,
  45690,
  27216,
  27968,
  44870,
  43872,
  38256,
  19189,
  18800,
  25776,
  29859,
  59984,
  27480,
  23232,
  43872,
  38613,
  37600,
  51552,
  55636,
  54432,
  55888,
  30034,
  22176,
  43959,
  9680,
  37584,
  51893,
  43344,
  46240,
  47780,
  44368,
  21977,
  19360,
  42416,
  86390,
  21168,
  43312,
  31060,
  27296,
  44368,
  23378,
  19296,
  42726,
  42208,
  53856,
  60005,
  54576,
  23200,
  30371,
  38608,
  19195,
  19152,
  42192,
  118966,
  53840,
  54560,
  56645,
  46496,
  22224,
  21938,
  18864,
  42359,
  42160,
  43600,
  111189,
  27936,
  44448,
  84835,
  37744,
  18936,
  18800,
  25776,
  92326,
  59984,
  27424,
  108228,
  43744,
  37600,
  53987,
  51552,
  54615,
  54432,
  55888,
  23893,
  22176,
  42704,
  21972,
  21200,
  43448,
  43344,
  46240,
  46758,
  44368,
  21920,
  43940,
  42416,
  21168,
  45683,
  26928,
  29495,
  27296,
  44368,
  84821,
  19296,
  42352,
  21732,
  53600,
  59752,
  54560,
  55968,
  92838,
  22224,
  19168,
  43476,
  41680,
  53584,
  62034,
  54560
];
const tianganSet = ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"];
const dizhiSet = ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"];
const termSet = [
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c3598082c95f8c965cc920f",
  "97bd0b06bdb0722c965ce1cfcc920f",
  "b027097bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c359801ec95f8c965cc920f",
  "97bd0b06bdb0722c965ce1cfcc920f",
  "b027097bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c359801ec95f8c965cc920f",
  "97bd0b06bdb0722c965ce1cfcc920f",
  "b027097bd097c36b0b6fc9274c91aa",
  "9778397bd19801ec9210c965cc920e",
  "97b6b97bd19801ec95f8c965cc920f",
  "97bd09801d98082c95f8e1cfcc920f",
  "97bd097bd097c36b0b6fc9210c8dc2",
  "9778397bd197c36c9210c9274c91aa",
  "97b6b97bd19801ec95f8c965cc920e",
  "97bd09801d98082c95f8e1cfcc920f",
  "97bd097bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36c9210c9274c91aa",
  "97b6b97bd19801ec95f8c965cc920e",
  "97bcf97c3598082c95f8e1cfcc920f",
  "97bd097bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36c9210c9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c3598082c95f8c965cc920f",
  "97bd097bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c3598082c95f8c965cc920f",
  "97bd097bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c359801ec95f8c965cc920f",
  "97bd097bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c359801ec95f8c965cc920f",
  "97bd097bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf97c359801ec95f8c965cc920f",
  "97bd097bd07f595b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9210c8dc2",
  "9778397bd19801ec9210c9274c920e",
  "97b6b97bd19801ec95f8c965cc920f",
  "97bd07f5307f595b0b0bc920fb0722",
  "7f0e397bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36c9210c9274c920e",
  "97b6b97bd19801ec95f8c965cc920f",
  "97bd07f5307f595b0b0bc920fb0722",
  "7f0e397bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36c9210c9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bd07f1487f595b0b0bc920fb0722",
  "7f0e397bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf7f1487f595b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf7f1487f595b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf7f1487f531b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c965cc920e",
  "97bcf7f1487f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b97bd19801ec9210c9274c920e",
  "97bcf7f0e47f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "9778397bd097c36b0b6fc9210c91aa",
  "97b6b97bd197c36c9210c9274c920e",
  "97bcf7f0e47f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "9778397bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36c9210c9274c920e",
  "97b6b7f0e47f531b0723b0b6fb0722",
  "7f0e37f5307f595b0b0bc920fb0722",
  "7f0e397bd097c36b0b6fc9210c8dc2",
  "9778397bd097c36b0b70c9274c91aa",
  "97b6b7f0e47f531b0723b0b6fb0721",
  "7f0e37f1487f595b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc9210c8dc2",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f595b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "9778397bd097c36b0b6fc9274c91aa",
  "97b6b7f0e47f531b0723b0787b0721",
  "7f0e27f0e47f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "9778397bd097c36b0b6fc9210c91aa",
  "97b6b7f0e47f149b0723b0787b0721",
  "7f0e27f0e47f531b0723b0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "9778397bd097c36b0b6fc9210c8dc2",
  "977837f0e37f149b0723b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0722",
  "7f0e37f5307f595b0b0bc920fb0722",
  "7f0e397bd097c35b0b6fc9210c8dc2",
  "977837f0e37f14998082b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e37f1487f595b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc9210c8dc2",
  "977837f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722",
  "977837f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd097c35b0b6fc920fb0722",
  "977837f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "977837f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "977837f0e37f14998082b0787b06bd",
  "7f07e7f0e47f149b0723b0787b0721",
  "7f0e27f0e47f531b0b0bb0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "977837f0e37f14998082b0723b06bd",
  "7f07e7f0e37f149b0723b0787b0721",
  "7f0e27f0e47f531b0723b0b6fb0722",
  "7f0e397bd07f595b0b0bc920fb0722",
  "977837f0e37f14898082b0723b02d5",
  "7ec967f0e37f14998082b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0722",
  "7f0e37f1487f595b0b0bb0b6fb0722",
  "7f0e37f0e37f14898082b0723b02d5",
  "7ec967f0e37f14998082b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0722",
  "7f0e37f1487f531b0b0bb0b6fb0722",
  "7f0e37f0e37f14898082b0723b02d5",
  "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e37f1487f531b0b0bb0b6fb0722",
  "7f0e37f0e37f14898082b072297c35",
  "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e37f0e37f14898082b072297c35",
  "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e37f0e366aa89801eb072297c35",
  "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f149b0723b0787b0721",
  "7f0e27f1487f531b0b0bb0b6fb0722",
  "7f0e37f0e366aa89801eb072297c35",
  "7ec967f0e37f14998082b0723b06bd",
  "7f07e7f0e47f149b0723b0787b0721",
  "7f0e27f0e47f531b0723b0b6fb0722",
  "7f0e37f0e366aa89801eb072297c35",
  "7ec967f0e37f14998082b0723b06bd",
  "7f07e7f0e37f14998083b0787b0721",
  "7f0e27f0e47f531b0723b0b6fb0722",
  "7f0e37f0e366aa89801eb072297c35",
  "7ec967f0e37f14898082b0723b02d5",
  "7f07e7f0e37f14998082b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0722",
  "7f0e36665b66aa89801e9808297c35",
  "665f67f0e37f14898082b0723b02d5",
  "7ec967f0e37f14998082b0787b0721",
  "7f07e7f0e47f531b0723b0b6fb0722",
  "7f0e36665b66a449801e9808297c35",
  "665f67f0e37f14898082b0723b02d5",
  "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e36665b66a449801e9808297c35",
  "665f67f0e37f14898082b072297c35",
  "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e26665b66a449801e9808297c35",
  "665f67f0e37f1489801eb072297c35",
  "7ec967f0e37f14998082b0787b06bd",
  "7f07e7f0e47f531b0723b0b6fb0721",
  "7f0e27f1487f531b0b0bb0b6fb0722"
];
const terms = ["\u5C0F\u5BD2", "\u5927\u5BD2", "\u7ACB\u6625", "\u96E8\u6C34", "\u60CA\u86F0", "\u6625\u5206", "\u6E05\u660E", "\u8C37\u96E8", "\u7ACB\u590F", "\u5C0F\u6EE1", "\u8292\u79CD", "\u590F\u81F3", "\u5C0F\u6691", "\u5927\u6691", "\u7ACB\u79CB", "\u5904\u6691", "\u767D\u9732", "\u79CB\u5206", "\u5BD2\u9732", "\u971C\u964D", "\u7ACB\u51AC", "\u5C0F\u96EA", "\u5927\u96EA", "\u51AC\u81F3"];
const festival = {
  "1-1": "\u5143\u65E6\u8282",
  "5-1": "\u52B3\u52A8\u8282",
  "6-1": "\u513F\u7AE5\u8282",
  "9-10": "\u6559\u5E08\u8282",
  "10-1": "\u56FD\u5E86\u8282",
  "3-8": "\u5987\u5973\u8282",
  "3-12": "\u690D\u6811\u8282",
  "4-1": "\u611A\u4EBA\u8282",
  "7-1": "\u5EFA\u515A\u8282",
  "8-1": "\u5EFA\u519B\u8282"
};
const traditional_festival = {
  "12-30": "\u9664\u5915",
  "1-1": "\u6625\u8282",
  "1-15": "\u5143\u5BB5\u8282",
  "2-2": "\u9F99\u62AC\u5934",
  "5-5": "\u7AEF\u5348\u8282",
  "7-7": "\u4E03\u5915\u8282",
  "7-15": "\u4E2D\u5143\u8282",
  "8-15": "\u4E2D\u79CB\u8282",
  "9-9": "\u91CD\u9633\u8282",
  "10-1": "\u5BD2\u8863\u8282",
  "10-15": "\u4E0B\u5143\u8282",
  "12-8": "\u814A\u516B\u8282",
  "12-23": "\u5317\u65B9\u5C0F\u5E74",
  "12-24": "\u5357\u65B9\u5C0F\u5E74"
};
function verifyDate$1(year, month, date) {
  if (year < 1990 || year > 2100)
    return false;
  if (month < 1 || month > 12)
    return false;
  if (date < 1 || date > 31)
    return false;
  if (month30day.includes(month) && date > 30)
    return false;
  if (month === 2) {
    if (isLeapYear(year) && date > 29)
      return false;
    if (!isLeapYear(year) && date > 28)
      return false;
  }
  if (year === 1990 && month === 1 && date < 31)
    return false;
  return true;
}
function getLunarYearDays(year) {
  let sum = 348;
  for (let i = 32768; i > 8; i >>= 1) {
    sum += lunarSet[year - 1900] & i ? 1 : 0;
  }
  return sum + getLeapMonthDay(year);
}
function hasLeapMonth(year) {
  return lunarSet[year - 1900] & 15;
}
function getLeapMonthDay(year) {
  if (hasLeapMonth(year)) {
    return lunarSet[year - 1900] & 65536 ? 30 : 29;
  }
  return 0;
}
function getBasicMonthDay(year, month) {
  return lunarSet[year - 1900] & 65536 >> month ? 30 : 29;
}
function parseGanZhiYear(year) {
  let ganKey = (year - 3) % 10;
  let zhiKey = (year - 3) % 12;
  if (ganKey === 0)
    ganKey = 10;
  if (zhiKey === 0)
    zhiKey = 12;
  return tianganSet[ganKey - 1] + dizhiSet[zhiKey - 1];
}
function parseGanZhi(offset) {
  return `${tianganSet[offset % 10]}${dizhiSet[offset % 12]}`;
}
function getTerm(year, term_index) {
  const _term = termSet[year - 1900];
  const _calcDay = [];
  for (let index = 0; index < _term.length; index += 5) {
    const chunk = parseInt(`0x${_term.slice(index, index + 5)}`).toString();
    _calcDay.push(chunk[0], chunk.slice(1, 3), chunk[3], chunk.slice(4, 6));
  }
  return parseInt(_calcDay[term_index - 1]);
}
function parseChineseMonth(isLeapYear2, month) {
  const chinese_month = ["\u6B63", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341", "\u51AC", "\u814A"];
  return `${isLeapYear2 ? "\u95F0" : ""}${chinese_month[month - 1]}\u6708`;
}
function parseChineseDate(date) {
  const chinese_day_prefix = ["\u521D", "\u5341", "\u5EFF", "\u5345"];
  const chinese_day = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341"];
  switch (date) {
    case 10:
      return "\u521D\u5341";
    case 20:
      return "\u4E8C\u5341";
    case 30:
      return "\u4E09\u5341";
    default:
      return chinese_day_prefix[Math.floor(date / 10)] + chinese_day[date % 10];
  }
}
function parseAstro(month, date) {
  const astros = "\u9B54\u7FAF\u6C34\u74F6\u53CC\u9C7C\u767D\u7F8A\u91D1\u725B\u53CC\u5B50\u5DE8\u87F9\u72EE\u5B50\u5904\u5973\u5929\u79E4\u5929\u874E\u5C04\u624B\u9B54\u7FAF";
  const flags = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
  const start_index = month * 2 - (date < flags[month - 1] ? 2 : 0);
  return astros.slice(start_index, start_index + 2);
}
function parseZodiac(year) {
  const zodiacSet = ["\u9F20", "\u725B", "\u864E", "\u5154", "\u9F99", "\u86C7", "\u9A6C", "\u7F8A", "\u7334", "\u9E21", "\u72D7", "\u732A"];
  return zodiacSet[(year - 4) % 12];
}
function useLunar(year, month, date) {
  if (!verifyDate$1(year, month, date))
    throw Error("this date is not validate");
  let offset = (Date.UTC(year, month - 1, date) - Date.UTC(1900, 0, 31)) / 864e5;
  let channl;
  let temp = 0;
  for (channl = 1900; channl < 2101 && offset > 0; channl++) {
    temp = getLunarYearDays(channl);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    channl--;
  }
  const lunarYear = channl;
  let leap = hasLeapMonth(lunarYear);
  let isLeapYear2 = false;
  for (channl = 1; channl < 13 && offset > 0; channl++) {
    if (leap > 0 && channl === leap + 1 && isLeapYear2 === false) {
      --channl;
      isLeapYear2 = true;
      temp = getLeapMonthDay(year);
    } else {
      temp = getBasicMonthDay(year, channl);
    }
    if (isLeapYear2 === true && channl === leap + 1) {
      isLeapYear2 = false;
    }
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && channl === leap + 1) {
    if (isLeapYear2) {
      isLeapYear2 = false;
    } else {
      isLeapYear2 = true;
      --channl;
    }
  }
  if (offset < 0) {
    offset += temp;
    --channl;
  }
  const lunarMonth = channl;
  const lunarDay = offset + 1;
  const firstTerm = getTerm(year, month * 2 - 1);
  const lastTerm = getTerm(year, month * 2);
  let term = "";
  if (firstTerm === date) {
    term = terms[month * 2 - 2];
  }
  if (lastTerm === date) {
    term = terms[month * 2 - 1];
  }
  const ganziYear = parseGanZhiYear(lunarYear);
  let ganzhiMonth = parseGanZhi((year - 1900) * 12 + month + 11);
  if (date >= firstTerm) {
    ganzhiMonth = parseGanZhi((year - 1900) * 12 + month + 12);
  }
  const dayCyclical = Date.UTC(year, month - 1, 1, 0, 0, 0, 0) / 864e5 + 25567 + 10;
  const ganzhiDay = parseGanZhi(dayCyclical + date - 1);
  const astro = parseAstro(month, date);
  const lunarDateStr = `${lunarYear}-${lunarMonth}-${lunarDay}`;
  const lunar_month = parseChineseMonth(isLeapYear2, lunarMonth);
  const lunar_day = parseChineseDate(lunarDay);
  let solarDate = `${month}-${date}`;
  let lunarDate = `${lunarMonth}-${lunarDay}`;
  if (lunarMonth === 12 && lunarDay === 29 && getBasicMonthDay(lunarYear, lunarMonth) === 29) {
    lunarDate = "12-30";
  }
  const festivals = [];
  Object.keys(traditional_festival).forEach((key) => {
    if (key === lunarDate) {
      festivals.push(traditional_festival[key]);
    }
  });
  Object.keys(festival).forEach((key) => {
    if (key === solarDate) {
      festivals.push(festival[key]);
    }
  });
  const zodiac = parseZodiac(lunarYear);
  return {
    lunarDateStr,
    ganziYear,
    ganzhiMonth,
    ganzhiDay,
    lunarMonth: lunar_month,
    lunarDay: lunar_day,
    term,
    festivals,
    zodiac,
    astro
  };
}

function getMonthTotalDay(year, month) {
  if (month31day.includes(month)) {
    return 31;
  } else if (month30day.includes(month)) {
    return 30;
  } else {
    if (isLeapYear(year)) {
      return 29;
    } else {
      return 28;
    }
  }
}
function getMonthDaysArr(year, month, use_monday_start) {
  let totalDay = getMonthTotalDay(year, month);
  let daysArr = [
    Array.from({ length: 7 }, () => null),
    Array.from({ length: 7 }, () => null),
    Array.from({ length: 7 }, () => null),
    Array.from({ length: 7 }, () => null),
    Array.from({ length: 7 }, () => null),
    Array.from({ length: 7 }, () => null)
  ];
  let curDayLevel = 0;
  for (let date = 1; date <= totalDay; date++) {
    const dateStr = `${year}-${month}-${date}`;
    const curDate = new Date(dateStr);
    let curDateDay = curDate.getDay();
    if (use_monday_start) {
      curDateDay = [6, 0, 1, 2, 3, 4, 5][curDateDay];
    }
    daysArr[curDayLevel][curDateDay] = {
      dateStr,
      year,
      month,
      date,
      day: curDate.getDay(),
      inOtherMonth: false,
      timestamp: curDate.getTime()
    };
    if (curDateDay === 6) {
      curDayLevel++;
    }
  }
  return daysArr;
}
function getPrevMonthFillDays(year, month, length, use_monday_start) {
  let prevMonth = month - 1;
  if (prevMonth === 0) {
    prevMonth = 12;
    year--;
  }
  const prevMonthDaysArr = getMonthDaysArr(year, prevMonth, use_monday_start).flat().filter((d) => d !== null);
  return prevMonthDaysArr.map((date) => {
    date.inOtherMonth = true;
    return date;
  }).slice(prevMonthDaysArr.length - length);
}
function getNextMonthFillDays(year, month, length, use_monday_start) {
  let nextMonth = month + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    year++;
  }
  const nextMonthDaysArr = getMonthDaysArr(year, nextMonth, use_monday_start).flat().filter((d) => d !== null);
  return nextMonthDaysArr.map((date) => {
    date.inOtherMonth = true;
    return date;
  }).slice(0, length).reverse();
}
function verifyDate(year, month) {
  if (year < 1990 || year > 2100)
    return false;
  if (month < 1 || month > 12)
    return false;
  return true;
}
function useDateMatrix(year = new Date().getFullYear(), month = new Date().getMonth() + 1, use_monday_start = false) {
  if (!verifyDate(year, month))
    throw Error("this date is not validate");
  const daysArr = getMonthDaysArr(year, month, use_monday_start);
  let beforeEmptyLength = -1;
  daysArr.flat().find((d) => {
    beforeEmptyLength++;
    return d !== null;
  });
  const prevMonthFillDays = getPrevMonthFillDays(year, month, beforeEmptyLength, use_monday_start);
  for (let index = 0; index < beforeEmptyLength; index++) {
    daysArr[0][index] = prevMonthFillDays[index];
  }
  let afterEmptyLength = 0;
  daysArr.flat().forEach((d) => {
    if (d !== null) {
      afterEmptyLength = 0;
    } else {
      afterEmptyLength++;
    }
  });
  const nextMonthFillDays = getNextMonthFillDays(year, month, afterEmptyLength, use_monday_start);
  let fillNextMonthDaysLevel = daysArr.length - 1;
  let fillNextMonthDaysIndex = 6;
  for (let index = 0; index < afterEmptyLength; index++) {
    daysArr[fillNextMonthDaysLevel][fillNextMonthDaysIndex] = nextMonthFillDays[index];
    fillNextMonthDaysIndex--;
    if (index === 6) {
      fillNextMonthDaysLevel--;
      fillNextMonthDaysIndex = 6;
    }
  }
  return daysArr;
}

function useDateDetail(time) {
  if (time === null)
    return null;
  const d = new Date(time);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const day = d.getDay();
  const hour = d.getHours();
  const minute = d.getMinutes();
  return {
    dateStr: `${year}-${month}-${date}`,
    year,
    month,
    date,
    day,
    hour,
    minute,
    timestamp: d.getTime()
  };
}

exports.TimeTiny = TimeTiny;
exports.useDateDetail = useDateDetail;
exports.useDateMatrix = useDateMatrix;
exports.useLunar = useLunar;
