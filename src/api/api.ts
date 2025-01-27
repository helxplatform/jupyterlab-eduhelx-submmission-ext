import qs from 'qs'
import { ServerConnection } from '@jupyterlab/services'
import { requestAPI } from '../handler'
import { IAssignment, Assignment, ICurrentAssignment } from './assignment'
import { IStudent, Student } from './student'
import { ISubmission, Submission } from './submission'
import { ICourse, Course } from './course'
import { IServerSettings, ServerSettings } from './server-settings'
import { IJobResult, IJobStatus, JobResult, JobStatus } from './job'
import {
    AssignmentResponse,
    CourseResponse,
    StudentResponse,
    SubmissionResponse,
    ServerSettingsResponse,
    JobStatusResponse,
    JobResultResponse
} from './api-responses'

export interface GetAssignmentsResponse {
    assignments: IAssignment[] | null
    currentAssignment: ICurrentAssignment | null
}

export interface GetStudentAndCourseResponse {
    student: IStudent
    course: ICourse
}

export interface NotebookFilesResponse {
    notebooks: { [assignmentId: string]: string[] }
}

export async function listNotebookFiles(requestOptions: RequestInit={}): Promise<NotebookFilesResponse> {
    const data = await requestAPI<NotebookFilesResponse>(`/notebook_files`, {
        method: 'GET',
        ...requestOptions
    })
    return data
}

export async function getStudentAndCourse(requestOptions: RequestInit={}): Promise<GetStudentAndCourseResponse> {
    const { student, course } = await requestAPI<{
        student: StudentResponse
        course: CourseResponse
    }>(`/course_student`, {
        method: 'GET',
        ...requestOptions
    })
    return {
        student: Student.fromResponse(student),
        course: Course.fromResponse(course)
    }
}

export async function getAssignments(path: string, requestOptions: RequestInit={}): Promise<GetAssignmentsResponse> {
    const queryString = qs.stringify({ path })
    const { assignments, current_assignment } = await requestAPI<{
        assignments: AssignmentResponse[] | null
        current_assignment: AssignmentResponse | null
    }>(`/assignments?${ queryString }`, {
        method: 'GET',
        ...requestOptions
    })
    return {
        assignments: assignments ? assignments.map((data) => Assignment.fromResponse(data)) : null,
        currentAssignment: current_assignment ? Assignment.fromResponse(current_assignment) as ICurrentAssignment : null
    }
}

export async function getServerSettings(requestOptions: RequestInit={}): Promise<IServerSettings> {
    try {
        const data = await requestAPI<ServerSettingsResponse>('/settings', {
            method: 'GET',
            ...requestOptions
        })
        return ServerSettings.fromResponse(data)
    } catch (e) {
        if (e instanceof ServerConnection.ResponseError) {
            const response = e.response;
            if (response.status === 404) {
                const message =
                    'EduHeLx Submission server extension is unavailable. Please ensure you have installed the ' +
                    'JupyterLab EduHeLx Submission server extension by running: pip install --upgrade eduhelx_jupyterlab_student. ' +
                    'To confirm that the server extension is installed, run: jupyter server extension list.'
                throw new ServerConnection.ResponseError(response, message);
            } else {
                const message = e.message;
                console.error('Failed to get the server extension settings', message);
                throw new ServerConnection.ResponseError(response, message);
            }
        } else {
            throw e;
        }
    }
}

export async function submitAssignment(
    currentPath: string,
    summary: string,
    description?: string,
    requestOptions: RequestInit={}
): Promise<void> {
    const res = await requestAPI<void>(`/submit_assignment`, {
        method: 'POST',
        body: JSON.stringify({
            summary,
            description,
            current_path: currentPath
        }),
        ...requestOptions
    })
}

export async function cloneStudentRepository(repositoryUrl: string, currentPath: string, requestOptions: RequestInit={}): Promise<string> {
    const repositoryRootPath = await requestAPI<string>(`/clone_student_repository`, {
        method: 'POST',
        body: JSON.stringify({
            repository_url: repositoryUrl,
            current_path: currentPath
        }),
        ...requestOptions
    })
    return repositoryRootPath
}

export async function getJobStatus(jobId: string, requestOptions: RequestInit={}): Promise<IJobStatus> {
    const data = await requestAPI<JobStatusResponse>(`/job_status`, {
        method: 'POST',
        ...requestOptions
    })
    return JobStatus.fromResponse(data)
}

export async function getJobResult(jobId: string, requestOptions: RequestInit={}): Promise<IJobResult> {
    const data = await requestAPI<JobResultResponse>(`/job_result`, {
        method: 'POST',
        ...requestOptions
    })
    return JobResult.fromResponse(data)
}