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
    directory_path: string
    absolute_directory_path: string
    created_date: string
    released_date: string
    last_modified_date: string
    base_time: number
    extra_time: number
    is_released: boolean
    is_closed: boolean
    submissions?: SubmissionResponse[]
}

export interface CourseResponse {
    id: number
    name: string
    master_remote_url: string
}

export interface ServerSettingsResponse {}