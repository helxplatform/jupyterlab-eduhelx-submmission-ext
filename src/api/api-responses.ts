export interface CommitResponse {
    id: string
    message: string
    author: string
    committer: string
}

export interface StudentResponse {
    id: number
    first_name: string
    last_name: string
    professor_onyen: string
}

export interface SubmissionResponse {
    id: number
    student_id: number
    active: boolean
    submission_time: string
    student: StudentResponse
    commit: CommitResponse
}

export interface AssignmentResponse {
    id: number
    name: string
    due_date: string
    student: StudentResponse
    submissions: SubmissionResponse[]
}

export interface CourseResponse {

}

export interface ServerSettingsResponse {}