import hilog from "@ohos:hilog";
import distributedDataObject from "@ohos:data.distributedDataObject";
import type { Context } from "@ohos:abilityAccessCtrl";
const TAG = 'CommentManager';
const DOMAIN = 0x0000;
export class CommentReplyData {
    id: string = '';
    text: string = '';
    author: string = '';
    timestamp: number = 0;
}
export class CommentAnchorData {
    id: string = '';
    x: number = 0;
    y: number = 0;
    text: string = '';
    author: string = '';
    color: string = '';
    timestamp: number = 0;
    resolved: boolean = false;
    replies: CommentReplyData[] = [];
}
export class CommentAnchor {
    id: string = '';
    x: number = 0;
    y: number = 0;
    text: string = '';
    author: string = '';
    color: string = '#FFD700';
    timestamp: number = 0;
    resolved: boolean = false;
    replies: CommentReply[] = [];
}
export class CommentReply {
    id: string = '';
    text: string = '';
    author: string = '';
    timestamp: number = 0;
}
export class CommentSyncState {
    commentsJson: string = '[]';
    lastUpdateTimestamp: number = 0;
}
export default class CommentManager {
    private comments: CommentAnchor[] = [];
    private distributedObject: distributedDataObject.DataObject | null = null;
    private syncState: CommentSyncState = new CommentSyncState();
    private onCommentsChange: (() => void) | null = null;
    private nextId: number = 1;
    private localAuthor: string = '';
    init(context: Context, localAuthor: string, onCommentsChange: () => void): void {
        this.localAuthor = localAuthor;
        this.onCommentsChange = onCommentsChange;
        try {
            this.distributedObject = distributedDataObject.create(context, this.syncState);
            this.distributedObject.on('change', () => {
                this.onRemoteChange();
            });
            hilog.info(DOMAIN, TAG, 'CommentManager initialized');
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to init CommentManager: %{public}s', JSON.stringify(error) ?? '');
        }
    }
    addComment(x: number, y: number, text: string, color: string = '#FFD700'): CommentAnchor {
        let comment = new CommentAnchor();
        comment.id = `comment_${this.nextId++}`;
        comment.x = x;
        comment.y = y;
        comment.text = text;
        comment.author = this.localAuthor;
        comment.color = color;
        comment.timestamp = Date.now();
        this.comments.push(comment);
        this.syncToRemote();
        if (this.onCommentsChange) {
            this.onCommentsChange();
        }
        return comment;
    }
    addReply(commentId: string, text: string): void {
        for (let i = 0; i < this.comments.length; i++) {
            if (this.comments[i].id === commentId) {
                let reply = new CommentReply();
                reply.id = `reply_${this.nextId++}`;
                reply.text = text;
                reply.author = this.localAuthor;
                reply.timestamp = Date.now();
                this.comments[i].replies.push(reply);
                this.syncToRemote();
                if (this.onCommentsChange) {
                    this.onCommentsChange();
                }
                return;
            }
        }
    }
    resolveComment(commentId: string): void {
        for (let i = 0; i < this.comments.length; i++) {
            if (this.comments[i].id === commentId) {
                this.comments[i].resolved = true;
                this.syncToRemote();
                if (this.onCommentsChange) {
                    this.onCommentsChange();
                }
                return;
            }
        }
    }
    deleteComment(commentId: string): void {
        this.comments = this.comments.filter((c: CommentAnchor) => c.id !== commentId);
        this.syncToRemote();
        if (this.onCommentsChange) {
            this.onCommentsChange();
        }
    }
    getAllComments(): CommentAnchor[] {
        return this.comments.filter((c: CommentAnchor) => !c.resolved);
    }
    getAllCommentsIncludingResolved(): CommentAnchor[] {
        return this.comments;
    }
    setSessionId(sessionId: string): void {
        if (this.distributedObject) {
            try {
                this.distributedObject.setSessionId(sessionId);
            }
            catch (error) {
                hilog.error(DOMAIN, TAG, 'Failed to set session: %{public}s', JSON.stringify(error) ?? '');
            }
        }
    }
    private syncToRemote(): void {
        try {
            let jsonArray: CommentAnchorData[] = [];
            for (let i = 0; i < this.comments.length; i++) {
                let c = this.comments[i];
                let repliesArr: CommentReplyData[] = [];
                for (let j = 0; j < c.replies.length; j++) {
                    let r = c.replies[j];
                    let rd = new CommentReplyData();
                    rd.id = r.id;
                    rd.text = r.text;
                    rd.author = r.author;
                    rd.timestamp = r.timestamp;
                    repliesArr.push(rd);
                }
                let cd = new CommentAnchorData();
                cd.id = c.id;
                cd.x = c.x;
                cd.y = c.y;
                cd.text = c.text;
                cd.author = c.author;
                cd.color = c.color;
                cd.timestamp = c.timestamp;
                cd.resolved = c.resolved;
                cd.replies = repliesArr;
                jsonArray.push(cd);
            }
            this.syncState.commentsJson = JSON.stringify(jsonArray);
            this.syncState.lastUpdateTimestamp = Date.now();
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to sync comments: %{public}s', JSON.stringify(error) ?? '');
        }
    }
    private onRemoteChange(): void {
        try {
            let rawArray = JSON.parse(this.syncState.commentsJson) as Array<Record<string, Object>>;
            let newComments: CommentAnchor[] = [];
            for (let i = 0; i < rawArray.length; i++) {
                let raw = rawArray[i];
                let c = new CommentAnchor();
                c.id = raw['id'] as string;
                c.x = raw['x'] as number;
                c.y = raw['y'] as number;
                c.text = raw['text'] as string;
                c.author = raw['author'] as string;
                c.color = raw['color'] as string;
                c.timestamp = raw['timestamp'] as number;
                c.resolved = raw['resolved'] as boolean;
                let repliesRaw = raw['replies'] as Array<Record<string, Object>>;
                for (let j = 0; j < repliesRaw.length; j++) {
                    let rr = repliesRaw[j];
                    let reply = new CommentReply();
                    reply.id = rr['id'] as string;
                    reply.text = rr['text'] as string;
                    reply.author = rr['author'] as string;
                    reply.timestamp = rr['timestamp'] as number;
                    c.replies.push(reply);
                }
                newComments.push(c);
            }
            this.comments = newComments;
            this.nextId = this.comments.length + 1;
            if (this.onCommentsChange) {
                this.onCommentsChange();
            }
        }
        catch (error) {
            hilog.error(DOMAIN, TAG, 'Failed to apply remote comments: %{public}s', JSON.stringify(error) ?? '');
        }
    }
}
