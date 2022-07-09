export interface ILunar {
  /**
   * 农历时间
   */
  lunarDateStr: string,

  /**
   * 干支年
   */
  ganziYear: string,

  /**
   * 干支月
   */
  ganzhiMonth: string,

  /**
   * 干支日
   */
  ganzhiDay: string,

  /**
   * '正' '一' '二' '三' '四' '五' '六' '七' '八' '九' '十' '冬' '腊'
   */
  lunarMonth: string,

  /**
   * '初' '十' '廿' '卅' 
   * '日' '一' '二' '三' '四' '五' '六' '七' '八' '九' '十'
   */
  lunarDay: string,

  /**
   * 节气
   */
  term: string,

  /**
   * 节日
   */
  festivals: string[],

  /**
   * 生肖
   */
  zodiac: string,

  /**
   * 星座
   */
  astro: string,
}

export interface IMatrixItem {
  dateStr: string
  year: number
  month: number
  date: number
  day: number
  inOtherMonth: boolean
  timestamp: number
  lunar?: ILunar
}

export interface IDateDetail {
  dateStr: string
  year: number
  month: number
  date: number
  day: number
  hour: number
  minute: number
}
