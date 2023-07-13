import moment, { Moment } from 'moment'

interface IDateFormat {
    // E.g. Mar 5 at 11:59 PM
    toBasicDatetime(): string
    // E.g. in 3 months, 2 weeks
    // in 2 hours
    toRelativeDatetime(): string
}

// The purpose of this is to standardize the date string formats used across the project.
export class DateFormat implements IDateFormat {
    private _date: Date
    private _moment: Moment
    constructor(date: Date) {
        this._date = date
        this._moment = moment(date)
    }

    toBasicDatetime(): string {
        return this._moment.format("MMM DD [at] h[:]mm A")
    }

    toRelativeDatetime(): string {
        return ""
    }
}