export enum UserType {
    STUDENT = 'student',
    INSTRUCTOR = 'instructor'
}

export interface CommitResponse {
    id: string
    message: string
    author_name: string
    author_email: string
    committer_name: string
    committer_email: string
}

export interface UserResponse {
    id: number
    user_type: UserType
    onyen: string
    first_name: string
    last_name: string
    email: string
}

export interface InstructorResponse extends UserResponse {
    user_type: UserType.INSTRUCTOR
}

export interface StudentResponse extends UserResponse {
    user_type: UserType.STUDENT
    join_date: string
    exit_date: string | null
}

export interface StagedChangeResponse {
    path_from_repo: string
    path_from_assn: string
    modification_type: string
    type: "file" | "directory"
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
    available_date: string | null
    due_date: string | null
    last_modified_date: string

    is_deferred: boolean
    is_extended: boolean
    is_created: boolean
    is_available: boolean
    is_closed: boolean
}

export interface CourseResponse {
    id: number
    name: string
    master_remote_url: string
    instructors: InstructorResponse[]
    students: StudentResponse[]
}

export interface ServerSettingsResponse {
    serverVersion: string
    repoRoot: string
}