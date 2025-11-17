import { formatDistanceToNowStrict } from "date-fns"

export const timeAgo = (createdAt: Date) => {
    const result = formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true }).split(" ")
    return `${result[0]}${result[1][0]}`
}