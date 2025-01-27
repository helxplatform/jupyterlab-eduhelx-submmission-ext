export enum UserType {
    STUDENT = 'student',
    INSTRUCTOR = 'instructor'
}

export enum AssignmentStatus {
    UNPUBLISHED = 'UNPUBLISHED',
    UPCOMING    = 'UPCOMING',
    OPEN        = 'OPEN',
    CLOSED      = 'CLOSED'
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
    name: string
    email: string
}

export interface InstructorResponse extends UserResponse {
    user_type: UserType.INSTRUCTOR
}

export interface StudentResponse extends UserResponse {
    user_type: UserType.STUDENT
    join_date: string
    exit_date: string | null
    fork_remote_url: string
    fork_cloned: boolean
}

export enum JobStatusEnum {
    PENDING = 'pending',
    RECEIVED = 'received',
    STARTED = 'started',
    RETRY = 'retry',
    FAILURE = 'failure',
    SUCCESS = 'success',
    REVOKED = 'revoked'
}

export interface JobStatusResponse {
    id: string
    // May be undefined for PENDING statuses
    type?: string | null
    status: JobStatusEnum
}

export interface JobResultResponse extends JobStatusResponse {
    result: any
    type: string | null
    ready: boolean
    successful: boolean
    failed: boolean
    queue: string | null
    retries: number | null
    traceback: string | null
    finished_date: string | null
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
    master_notebook_path: string
    student_notebook_path: string
    protected_files: string[]
    overwritable_files: string[]
    max_attempts: number | null
    current_attempts: number
    grader_question_feedback: boolean
    created_date: string
    available_date: string | null
    adjusted_available_date: string | null
    due_date: string | null
    adjusted_due_date: string | null
    last_modified_date: string

    status: AssignmentStatus
    is_deferred: boolean
    is_extended: boolean
    is_published: boolean
    is_available: boolean
    is_closed: boolean

    submissions?: SubmissionResponse[]
    staged_changes?: StagedChangeResponse[]
}

export interface CourseResponse {
    id: number
    name: string
    master_remote_url: string
    instructors: InstructorResponse[]
}

export interface ServerSettingsResponse {
    serverVersion: string
    repoRoot: string
}