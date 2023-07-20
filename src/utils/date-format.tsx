import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import moment, { Moment, duration } from 'moment'

interface IDateFormat {
    // E.g. Mar 5 at 11:59 PM
    toBasicDatetime(): string
    // E.g. in 3 months, 2 weeks
    // in 2 hours
    toRelativeDatetime(referenceTime?: Date): ReactNode | string
}

const ReactiveTime = ({ getTime }: { getTime: () => string }) => {
    const [time, setTime] = useState<string>(getTime())
    useEffect(() => {
        // Doesn't need to precisely sync to the internal time or anything
        // because the humanized moment is imprecise. 
        const interval = window.setInterval(() => {
            setTime(getTime())
        }, 1000)
        return () => {
            window.clearInterval(interval)
        }
    }, [])
    return <Fragment>{ time }</Fragment>
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

    toRelativeDatetime(referenceTime?: Date): ReactNode | string {
        const getDuration = (date: Date) => duration(this._moment.diff(moment(date))).humanize()
        if (referenceTime) return getDuration(referenceTime)
        return <ReactiveTime getTime={ () => getDuration(new Date()) } />
    }
}