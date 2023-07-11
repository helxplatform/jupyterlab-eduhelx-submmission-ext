export interface StudentResponse {
    id: number
    first_name: string
    last_name: string
    professor_onyen: string
}

export interface SubmissionResponse {
    id: number
    student_id: number
    commit_id: string
    active: boolean
    submission_time: string
    student: StudentResponse
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