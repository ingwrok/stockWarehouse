import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ErrorHandler from "./responseHandler/errorHanlder";

dayjs.extend(utc);
dayjs.extend(timezone);

export const THAI_TZ = "Asia/Bangkok";
export default dayjs;

export class DateUtils {
  static parseDateTimeRange(filter: { year?: number | null; month?: number | null; startTime?: string | null; endTime?: string | null;}): { start?: string; end?: string } {
    const { year, month, startTime, endTime } = filter;

    if ((startTime && !endTime) || (!startTime && endTime)) {
      throw ErrorHandler.badRequest("Both startTime and endTime must be provided together");
    }

    const formatToUtcSql = (d: dayjs.Dayjs) => d.utc().format("YYYY-MM-DD HH:mm:ss.SSS");

    if (startTime && endTime) {
      let start = dayjs.tz(startTime, THAI_TZ);
      let end = dayjs.tz(endTime, THAI_TZ);

      if (!start.isValid() || !end.isValid()) {
        throw ErrorHandler.badRequest("Invalid date format for startTime or endTime");
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(startTime.trim())) {
        start = start.startOf("day");
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(endTime.trim())) {
        end = end.endOf("day");
      }

      if (start.isAfter(end)) {
        throw ErrorHandler.badRequest("startTime must not be greater than endTime");
      }

      return {
        start: formatToUtcSql(start),
        end: formatToUtcSql(end),
      };
    }

    if (month && !year) {
      throw ErrorHandler.badRequest("year is required when month is specified");
    }

    if (year && month) {
      const base = dayjs().tz(THAI_TZ).year(year).month(month - 1).date(1);
      return {
        start: formatToUtcSql(base.startOf("month")),
        end: formatToUtcSql(base.endOf("month")),
      };
    }

    if (year) {
      const base = dayjs().tz(THAI_TZ).year(year).month(0).date(1);
      return {
        start: formatToUtcSql(base.startOf("year")),
        end: formatToUtcSql(base.endOf("year")),
      };
    }

    return {};
  }
}