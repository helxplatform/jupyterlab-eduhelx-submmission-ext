export interface CommitResponse {
    id: string
    message: string
    author_name: string
    author_email: string
    committer_name: string
    committer_email: string
}

export interface StudentResponse {
    id: number
    student_onyen: string
    first_name: string
    last_name: string
    professor_onyen: string
}

export interface SubmissionResponse {
    id: number
    active: boolean
    submission_time: string
    commit: CommitResponse
}

export interface AssignmentResponse {
    id: number
    name: string
    git_remote_url: string
    revision_count: number
    created_date: string
    released_date: string
    last_modified_date: string
    due_date: string
}

export interface CurrentAssignmentResponse extends AssignmentResponse {
    submissions: SubmissionResponse[]
}

export interface CourseResponse {

}

export interface ServerSettingsResponse {}