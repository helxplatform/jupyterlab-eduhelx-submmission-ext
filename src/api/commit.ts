import { CommitResponse } from './api-responses'

export interface ICommit {
    id: string
    idShort: string
    // The author and committer should always be the same, but there is a practical distinction in the git spec.
    // The author is the person who originally wrote the changes for the commit.
    author: string
    // The committer is the person who actually commits the changes.
    committer: string
    message: string
    // The summary is everything before the first newline character in the commit message.
    summary: string
    // The description is everything after the first newline character in the commit message.
    description: string
}

export class Commit implements ICommit {
    constructor(
        private _id: string,
        private _author: string,
        private _committer: string,
        private _message: string
    ) {}

    get id() { return this._id }
    get idShort() { return this._id.slice(0, 7) }
    get author() { return this._author }
    get committer() { return this._committer }
    get message() { return this._message }
    get summary() {
        const [summary, ...description] = this.message.split("\n")
        return summary
    }
    get description() {
        const [summary, ...description] = this.message.split("\n")
        return description.join("\n")
    }

    static fromResponse(data: CommitResponse): ICommit {
        return new Commit(
            data.id,
            data.author,
            data.committer,
            data.message
        )
    }
}