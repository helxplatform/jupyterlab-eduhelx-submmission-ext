import React, { Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { containerClass, loadingContainerClass } from './style'
import { NoAssignmentWarning } from '../no-assignment-warning'
import { AssignmentInfo } from '../assignment-info'
import { useAssignmentContext } from '../../../contexts'

export const AssignmentContent = () => {
    const { assignment } = useAssignmentContext()!
    return (
        <div className={ containerClass }>
            {
                assignment === undefined ? (
                    <div className={ loadingContainerClass }>
                        <CircularProgress color="inherit" />
                    </div>
                ) : assignment === null ? (
                    <NoAssignmentWarning />
                ) : (
                    <Fragment>
                        <AssignmentInfo />
                    </Fragment>
                )
            }
        </div>
    )
}