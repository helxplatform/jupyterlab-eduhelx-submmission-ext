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

    foobar(test?: string) {
        if (test === undefined) test = "1234"
        return test.charAt(1)
    }

    toRelativeDatetime(
        referenceTime?: Date,
        postprocess?: (humanizedDuration: string) => string
    ): ReactNode | string {
        if (!postprocess) postprocess = (s: string) => s
        // For whatever reason TSC type-narrowing is completely broken here and still considers postprocess possibly undefined...
        const getDuration = (date: Date) => postprocess!(duration(this._moment.diff(moment(date))).humanize())
        
        // const getDuration = (date: Date) => postprocess(duration(this._moment.diff(moment(date))).humanize())
        if (referenceTime) return getDuration(referenceTime)
        return <ReactiveTime getTime={ () => getDuration(new Date()) } />
    }

    toRelativeDatetimeNoArticle(
        referenceTime?: Date,
        postprocess?: (humanizedDuration: string) => string
    ): ReactNode | string {
        if (!postprocess) postprocess = (s: string) => s
        const removeArticle = (s: string) => {
            if (s.startsWith("a ")) return "1 " + s.substring(2)
            if (s.startsWith("an ")) return "1 " + s.substring(3)
            return s
        }
        // For whatever reason TSC type-narrowing is completely broken here and still considers postprocess possibly undefined...
        return this.toRelativeDatetime(referenceTime, (s) => postprocess!(removeArticle(s)))
    }
}