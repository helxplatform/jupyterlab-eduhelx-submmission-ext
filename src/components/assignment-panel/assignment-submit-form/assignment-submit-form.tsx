import React, { useMemo, useState } from 'react'
import { Input } from '@material-ui/core'
import { AssignmentSubmitButton } from './assignment-submit-button'
import {
    submitFormContainerClass, submitRootClass,
    summaryClass, descriptionClass,
    activeStyle, disabledStyle
} from './style'

interface AssignmentSubmitFormProps {

}

export const AssignmentSubmitForm = ({ }: AssignmentSubmitFormProps) => {
    const [summaryText, setSummaryText] = useState<string>("")
    const [descriptionText, setDescriptionText] = useState<string>("")
    const loading = useMemo<boolean>(() => false, [])
    return (
        <div className={ submitFormContainerClass }>
            <Input
                className={ summaryClass }
                classes={{
                    root: submitRootClass,
                    focused: activeStyle,
                    disabled: disabledStyle
                }}
                type="text"
                placeholder="Summary (optional)"
                title="Enter a summary for the submission (preferably less than 50 characters)"
                value={ summaryText }
                onChange={ (e) => setSummaryText(e.target.value) }
                disabled={ loading }
                disableUnderline
                fullWidth
            />
            <Input
                className={ descriptionClass }
                classes={{
                    root: submitRootClass,
                    focused: activeStyle,
                    disabled: disabledStyle
                }}
                multiline
                rows={ 5 }
                rowsMax={ 10 }
                placeholder="Description (optional)"
                title="Enter a description for the submission"
                value={ descriptionText }
                onChange={ (e) => setDescriptionText(e.target.value) }
                disabled={ loading }
                disableUnderline
                fullWidth
            />
            <AssignmentSubmitButton />
        </div>
    )
}