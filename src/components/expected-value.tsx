import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

export interface IExpectedValue<T> {
    renderedValue: T
    actualValue: T
    update: (expectedValue: T | null, promise: Promise<T> | null) => void
}

export interface ExpectedValueProps<T> {
    actualValue: T
    children: (value: IExpectedValue<T>) => ReactNode
}

export const ExpectedValue = <T,>({
    actualValue,
    children
}: ExpectedValueProps<any>) => {
    const [promiseAlive, setPromiseAlive] = useState<boolean>(false)
    const [expectedValue, setExpectedValue] = useState<T | null>(null)
    const [promise, setPromise] = useState<Promise<T> | null>(null)

    const renderedValue = useMemo<T>(() => {
        if (promiseAlive) return expectedValue
        return actualValue
    }, [promiseAlive, expectedValue, actualValue])

    useEffect(() => {
        if (promise === null || expectedValue === null) {
            setPromiseAlive(false)
            return
        }
        let cancelled = false
        void async function() {
            setPromiseAlive(true)
            try {
                await promise
            } catch {}
            if (!cancelled) setPromiseAlive(false)
        }()
        return () => {
            cancelled = true
        }
    }, [promise, expectedValue])

    const update = useCallback((newExpectedValue: T | null, newPromise: Promise<T> | null) => {
        setPromise(newPromise)
        setExpectedValue(newExpectedValue)
    }, [])
    
    return children({
        renderedValue,
        actualValue,
        update
    })
}